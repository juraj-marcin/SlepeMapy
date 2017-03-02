var prvky;
var dataJSON;

$(document).ready(function () {
    $("#app #close").click(function () {
        $("#app").removeAttr("data-opened");
        $("title").html("Slepé mapy");
    });
    $('a[href^="#"]').click(function () {
        if (this.hash.substring(1) != "")
            init(this.hash.substring(1));
    });
});

$(window).on("load", function () {
    if (window.location.hash) {
        if (window.location.hash.substring(1) != "")
            init(window.location.hash.substring(1));
    }
})

$(document).keydown(function (e) {
    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
    if (key == 27) {
        $("#app #close").click();
    }
})

function init(map) {
    $.getJSON("/resources/data/" + map + ".json", function (data) {
        dataJSON = data;
        prvky = data.prvky;
        generate();
        $("title").html(dataJSON.title + " | Slepé mapy");
        $("#app #ansT").html("");
        $("#app #ansF").html("");
        $("#app #control").html("");
        $("#app #check").click(function () {
            check();
        });
        $("#app #generate").click(function () {
            generate();
        });
        $("#app #answer").keydown(function (e) {
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key == 13) {
                e.preventDefault();
                check();
            } else if (key == 17) {
                generate();
            }
        });
        $("#app .slepamapa").css("width", "100%");
        $("#app .slepamapa").attr("src", "/resources/data/img/" + map + ".jpg");
        $("#app").attr("data-opened", "");
    }).fail(function (data, status, error) {
        alert(error);
        return;
    });
}

function generate() {
    var num;
    var type;
    if (Object.keys(prvky).length == 0) {
        $("#app #control").html(dataJSON.success);
    } else {
        num = prvky[Math.floor(Math.random() * prvky.length)];
        if (isNaN(num)) {
            if (num == num.toUpperCase()) {
                type = dataJSON.types.upp.name;
                $("#app #number").css("background", dataJSON.types.upp.bg);
                $("#app #number").css("color", dataJSON.types.upp.color);
            } else {
                type = dataJSON.types.low.name;
                $("#app #number").css("background", dataJSON.types.low.bg);
                $("#app #number").css("color", dataJSON.types.low.color);
            }
        } else {
            type = dataJSON.types.num.name;
            $("#app #number").css("background", dataJSON.types.num.bg);
            $("#app #number").css("color", dataJSON.types.num.color);
        }
        $("#app #number").attr("value", num);
        $("#app #type").attr("value", type);
        $("#app #answer").val("");
    }
}

function check() {
    var num = $("#app #number").attr("value");
    var type = $("#app #type").attr("value");
    var ans = $("#app #answer").val();
    var repeat = false;
    var spravne = JSON.parse(JSON.stringify(dataJSON[type][num]).toLowerCase());
    var spravneN = dataJSON[type][num];
    if (spravne.indexOf(ans.toLowerCase()) > -1) {
        $("#app #control").html("Správna odpoveď.");
        $("#app #ansT").html($("#app #ansT").html() + num + ":" + ans + "<br>");
        var index = prvky.indexOf(num);
        if (index > -1 && !repeat) {
            prvky.splice(index, 1);
        }
    } else {
        var spravnao = spravneN[0];
        for (var i = 1; i < spravneN.lenght; i++)
            spravnao += "/" + spravneN[i];
        $("#app #control").html("Zlá odpoveď. (" + spravnao + ")");
        $("#app #ansF").html($("#app #ansF").html() + num + ":" + ans + ":" + spravnao + "<br>");
    }
    $("#app #number").attr("value", "");
    $("#app #type").attr("value", "");
    $("#app #answer").val("");
    generate();
}