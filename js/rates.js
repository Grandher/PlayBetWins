$(function () {
    $.post("scripts/getHeaderInfo.php", {}, function (data) {
        if (data === "NotSession") {
            $(".header__left").attr("href", "index.html");
        } else {
            data = JSON.parse(data);
            $(".nickname").text(data.Login);
            $(".balance span").text(data.Balance);
            let statistic = [data.Wins, data.Losses, data.Draws];
            let i = 0;
            $(".drop-stat__number").each(function () {
                $(this).text(statistic[i++]);
            });
            $("#header_unlogin").hide();
            $("#header_login").css("display", "flex");
        }
    });

    $(".menu_section").click(function () {
        $(".menu_section").removeClass("selected");
        $(this).addClass("selected");
        fillTopPlayer($(this).attr("gameID"));        
    })

    $.post("scripts/getGames.php", {}, function (data) {
        data = JSON.parse(data);
        for (let i = 0; i < data.length; i++) {
            let game = $("#structure .menu_section").clone(true);
            $(game).find(".text").text(data[i].Title);
            $(game).attr("gameID", data[i].GameID);
            $(".borderElement1").append(game);
        }
    });

    function fillTopPlayer(index) {
        $(".borderElement3 .player_rate").remove();
        $.post("scripts/getRates.php", { "GameID": index }, function (data) {
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++) {
                let topPlayer = $("#structure .player_rate").clone(true);

                $(topPlayer).find(".nick_rate").text(data[i].Login);
                $(topPlayer).find(".score_kda").text(data[i].Wins + '/' + data[i].Losses + '/' + data[i].Draws);
                $(topPlayer).find(".score").text(Math.round(data[i].Score));

                $(".borderElement3").append(topPlayer);
            }
        });
    }

    fillTopPlayer(0);

})