function highlightLinks(){
    $("a").each(function(){$(this).toggleClass(
	'activeLink', $(this).attr("href") == window.location.pathname
    );});
}

function setupHeaderScrolling(){
  $('header').animate({top: '0'},300);
  $('#blog').scroll(function(e){
    var header = $('header');
    var body = $('#blog');
    var offset = body.scrollTop();
    var top = Math.min(offset, $('header h1').outerHeight(true));
    header.css('top', -top);
  });
}

function transitionContent(newDiv){
    var $oldDiv = $("#content").children();
    var $newDiv = $(newDiv).hide();

    $oldDiv.fadeOut(function(){
        $oldDiv.remove();
        $("#content").append($newDiv.fadeIn());
        highlightLinks();
        setupLinks();
        setupHeaderScrolling();
    });
}

function navigateToLink(href, callback){
    $.ajax(href).done(function(data){
        var newDiv;
      	if (href.match(/.png|.jpg|.webm|.jpeg/)) {
      	    newDiv =  $(
      		'<div><a class="back internal" href="'
      		    + window.location.pathname + '">&#9664;</a></div>'
      	    ).addClass(
      		'gallery-expanded'
      	    ).css({
      		"background-image": "url("+href+")"
      	    })
      	} else {
      	    newDiv = $(data).filter(
      		function(i,e){return e.id=="content"}
      	    ).children();
      	    document.title = $(data).filter('title').text();
      	}

      	transitionContent(newDiv);
      	if (callback) callback();
    });
}

function setupLinks(){
    $(".expanded:not(.noShrink)").removeClass("expanded");

    $(".blog-post").off("click").click(function(e){
        if(!$(e.target).is(".expander")) $(this).addClass("expanded");
    });

    $(".expander").off("click").click(function(e){
        $(this).parent().toggleClass("expanded");
    });

    $("a.internal:not(.activeLink)").off("click").click(function(e){
        var href = $(this).attr('href');
        navigateToLink(href, function(){history.pushState(null, null, href)});
        e.preventDefault();
    });

    $("a.activeLink").off("click").click(function(e){
        e.preventDefault();
    });
}

$(window).on("popstate", function(e){
    navigateToLink(location.href);
});

$(function(){
    setupHeaderScrolling();
    highlightLinks();
    setupLinks();
});
