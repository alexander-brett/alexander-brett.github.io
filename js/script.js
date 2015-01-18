function highlightLinks(){
    $("a").each(function(){
	var href = window.location.pathname == '/' ? '/index.html' : window.location.pathname;
	if ($(this).attr("href") == href) $(this).addClass('activeLink');
	else $(this).removeClass('activeLink');
    })
	}

function transitionContent(newDiv){
    var $oldDiv = $("#content").children();
    var $newDiv = $(newDiv).hide();
    
    $oldDiv.fadeOut(function(){
	$oldDiv.remove();
	$("#content").append($newDiv);
	$newDiv.fadeIn();
	highlightLinks();
	setupLinks();
    });
    
    
}

function navigateToLink(href, callback){
    $.ajax(href).done(function(data){
	var newDiv;
	if(href.match(/.png|.jpg|.webm|.jpeg/)) {
	    newDiv = $('<div><a class="back internal" href="' + window.location.pathname + '">&#9664;</a></div>')
		.addClass('gallery-expanded')
		.css({"background-image": "url("+href+")"});
	}  else {
	    newDiv = $(data).filter(function(i,e){return e.id=="content"}).children();
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
    highlightLinks();
    setupLinks();
});
