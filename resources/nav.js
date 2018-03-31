var currPage;

$("nav li").click(function(e) {
    nav($(this).attr("data-nav"), true);
});

$(window).resize(function () {
    nav(currPage, false);
});

function nav(page, animate) {
    var time = animate ? 500 : 0;
    var scroll = $("#" + page).offset().top;
    currPage = page;
    $("html, body").animate({
        scrollTop: scroll
    }, time)
}
