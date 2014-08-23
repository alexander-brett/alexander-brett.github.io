$(".blog-post").click(function(e){
  if(!$(e.target).is(".expander")) $(this).addClass("expanded");
});

$(".expander").click(function(e){
  $(this).parent().toggleClass("expanded");
});

