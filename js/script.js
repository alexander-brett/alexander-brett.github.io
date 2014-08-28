function highlightLinks(){
  $("a").each(function(){
    var href = window.location.pathname == '/' ? '/index.html' : window.location.pathname;
    if ($(this).attr("href") == href) $(this).addClass('activeLink');
    else $(this).removeClass('activeLink');
  })
}

function transitionContent(newDiv){
    $("#content").empty();
    
    var $newDiv = $(newDiv)
    
    $("#content").append($(newDiv))
}

function navigateToLink(href){
  $.ajax(href).done(function(data){
    var newDiv;
    if(href.match(/.png|.jpg|.webm|.jpeg/)) {
      newDiv = $('<div><a class="back internal" href="' + window.location.pathname + '">&#9664;</a></div>')
        .addClass('gallery-expanded')
        .css({"background-image": "url("+href+")"});
    }  else {
      newDiv = $($(data)[19]).children()[0];
    }
    transitionContent(newDiv);
    highlightLinks();
    setupLinks();
  });
}

function setupLinks(){
  $(".expanded").removeClass("expanded");
  
  $(".blog-post").click(function(e){
    if(!$(e.target).is(".expander")) $(this).addClass("expanded");
  });
  
  $(".expander").click(function(e){
    $(this).parent().toggleClass("expanded");
  });
  
  $("a.internal:not(.activeLink)").click(function(e){
    var href = $(this).attr('href');
    history.pushState(null, null, href);
    navigateToLink(href);
    e.preventDefault();
  });
  
  $("a.activeLink").click(function(e){
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