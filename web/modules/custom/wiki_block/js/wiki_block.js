/**
 * @file
 * Embed YouTube videos on Click.
 */
(function($, Drupal) {
    var count = 1;
    function wikiblock_popap(src) {
        z_index = ++count;
        string = src.split("/");
        if (string[4] == "en" && string[5] == "thumb") {
            title = src.split("/")[8].split(".")[0].split("%")[0];
            jQuery('.'+title).attr('src','https://upload.wikimedia.org/wikipedia/en/thumb/'+string[6]+'/'+string[7]+'/'+string[8]+'/600px-'+string[8]);
        } else if (string[5] == "thumb") {
            title = src.split("/")[8].split(".")[0].split("%")[0];
            jQuery('.'+title).attr('src','https://upload.wikimedia.org/wikipedia/commons/thumb/'+string[6]+'/'+string[7]+'/'+string[8]+'/600px-'+string[8]);
        } else {
            title = src.split("/")[7].split(".")[0].split("%")[0];
            jQuery('.'+title).attr('src','https://upload.wikimedia.org/wikipedia/commons/'+string[5]+'/'+string[6]+'/'+string[7]);
        }
        $('.'+title).css({
            "position": "fixed",
            "width": "30%",
            "right": "10%",
            "top": "15%",
            "z-index": z_index,
            "border": "2em solid rgb(52, 46, 56)",
            "background": "#fff"
        });
        $('.link'+title).css({
            "z-index": z_index,
        });
        $('a.link'+title).css({
            "text-decoration": "none"
        });
        $('.all'+title).css({
            "z-index": z_index,
        });
        $('a.all'+title).css({
            "text-decoration": "none"
        });
        $('.'+title).once().click(function(e) {
            e.preventDefault();
            return false;
        });
        $('.link'+title).once().click(function() {
            $(this).prev().remove();
            $(this).next().remove();
            $(this).remove();
        });
        $('.all'+title).once().click(function() {
            $('.img_close').remove();
        });
    }
    Drupal.behaviors.wiki_block = {
        attach:function() {
            url_wiki = "https://en.wikipedia.org/w/api.php?action=";
            console.log(url_wiki);
            title_page_wiki = window.location.href.split("/")[4];
            console.log(title_page_wiki);
            jQuery.ajax({
                url: url_wiki+"query&list=search&srsearch="+title_page_wiki+"&format=json&srprop=pageid&srqiprofile=wsum_inclinks_pv",
                async: false,
                dataType: "jsonp",
                data: {name: name},
                success: function (data) {
                    rows = data.query.search;
                    $(rows).each(function(index, value) {
                        title_article = value.title.replace(/ /g,"_");
                        if(title_article != title_page_wiki) {
                            console.log(title_article);
                        }
                    });
                }
            });
            $(function () {
                $(".wiki_img_block img").once().click(function(e){
                    $('a.image img.img_close').remove();
                    $('a.image a.img_close').remove();
                    string = $( this ).attr('src').split("/");
                    e.preventDefault();
                    if (string[5] == "thumb") {
                        img_link = $( this );
                        title = img_link.attr('src').split("/")[8].split(".")[0].split("%")[0];
                    }  else if (string[4] == "en") {
                        img_link = $( this );
                        title = img_link.attr('src').split("/")[8].split(".")[0].split("%")[0];
                    } else {
                        img_link = $( this );
                        title = img_link.attr('src').split("/")[7].split(".")[0].split("%")[0];
                    }
                    $( this ).parent().append( $("<img class='img_close class_popap "+title+"' alt='Wiki Img Frame' src=''>"));
                    $( this ).parent().append( $("<a class='img_close class_link link"+title+"' onclick='return false'>X</a>"));
                    $( this ).parent().append( $("<a class='img_close class_all all"+title+"' onclick='return false'>close all</a>"));
                    wikiblock_popap(jQuery(this).attr('src'));
                    return false;
                });
                $("div.wiki_img_block a.title-wiki-block-popap").once().hover(function(){
                    wiki_link = $( this );
                    url_title_wiki = wiki_link.attr('href');
                    title_wiki = url_title_wiki.substr(6);
                    jQuery.ajax({
                        url: "https://en.wikipedia.org/w/api.php?format=json&action=parse&page="+ title_wiki,
                        dataType: "jsonp",
                        success: function (rows) {
                            page_wiki = rows;
                            $(page_wiki).each(function() {
                                $('div.popap-wiki').append().html(page_wiki.parse.text['*']);
                            });
                        }
                    });
                    $( this ).append( $("<div class='popap-wiki'></div>"));
                },function() {
                    $( this ).find("div.popap-wiki").remove();
                });
            });
        }
    }
}(jQuery, Drupal));
