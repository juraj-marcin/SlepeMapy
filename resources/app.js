var prvky;
var dataJSON;
var mapName;

registerEvents();

function init(map) {
    mapName = map;
    $.getJSON("resources/data/" + mapName + ".json", function(data) {
        dataJSON = data;
        prvky = data.prvky;
        generate();
        $("#app #ansT").html("");
        $("#app #ansF").html("");
        $("#app #control").html("");
        $("#app .slepamapa").attr("src", "./resources/data/img/" + mapName + ".jpg");
        $("#app").attr("data-opened", "");
    }).fail(function(data, status, error) {
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
        $("#app #ansT").html($("#app #ansT").html() + "<tr><td>" + num + "</td><td>" + ans + "</td></tr>");
        var index = prvky.indexOf(num);
        if (index > -1 && !repeat) {
            prvky.splice(index, 1);
        }
    } else {
        var spravnao = spravneN[0];
        for (var i = 1; i < spravneN.lenght; i++)
            spravnao += "/" + spravneN[i];
        $("#app #control").html("Zlá odpoveď. (Správna odpoveď: " + spravnao + ")");
        $("#app #ansF").html($("#app #ansF").html() + "<tr><td>" + num + "</td><td>" + ans + "</td><td>" + spravnao + "</td></tr>");
    }
    $("#app #number").attr("value", "");
    $("#app #type").attr("value", "");
    $("#app #answer").val("");
    generate();
}

function close() {
    $("#app").removeAttr("data-opened");
}

function registerEvents() {
    $('a[data-map]').click(function(e) {
        init($(this).attr("data-map"));
    });

    $("#app #close").click(function() {
        close();
    });
    $("#app #cheatsheet").click(function() {
        if (mapName == "")
            return;
        window.open("./resources/cheatsheets/" + mapName + ".pdf");
    });
    $("#app #check").click(function() {
        if (mapName == "")
            return;
        check();
    });
    $("#app #generate").click(function() {
        if (mapName == "")
            return;
        generate();
    });

    $("#app #answer").keydown(function(e) {
        if (mapName == "")
            return;
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            e.preventDefault();
            check();
        } else if (key == 9) {
            e.preventDefault();
            generate();
        }
    });
    $(document).keydown(function(e) {
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 27) {
            close();
        }
    });
}
