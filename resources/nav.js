if (window.location.search) {
    if (window.location.hash.substring(1) != "")
        nav(window.location.hash.substring(1), false);
}

$("nav li").click(function(e) {
    nav($(this).attr("data-nav"), true);
    window.location.hash = $(this).attr("data-nav");
});

$(window).resize(function () {
    nav(window.location.hash.substring(1), false);
});

function nav(page, animate) {
    var time = animate ? 500 : 0;
    var scroll = $("#" + page).offset().top;
    $("html, body").animate({
        scrollTop: scroll
    }, time)
}
