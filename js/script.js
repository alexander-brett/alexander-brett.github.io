$(".expanded").removeClass("expanded");

$(".blog-post").click(function(e){
  if(!$(e.target).is(".expander")) $(this).addClass("expanded");
});

$(".expander").click(function(e){
  $(this).parent().toggleClass("expanded");
});

$(".gallery-item").click(function(e){
  var background = $(this).css("background-image").replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
  $("body").append(
  )
});