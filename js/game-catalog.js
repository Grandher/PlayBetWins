$(function() {
    $.post("scripts/getHeaderInfo.php", {}, function (data) {
        if (data === "NotSession") {
            $(".header__left").attr("href","index.html");
        } else {
            data = JSON.parse(data);
            if (data.Avatar) {
                $("img[alt='Avatar']").attr("src", `img/store/avatars/${data.Name}.svg`);
                CURRENT_AVATAR = data.Avatar;
            }
            $(".nickname").text(data.Login);
            $(".balance span").text(data.Balance);
            let statistic = [data.Wins, data.Losses, data.Draws];
            let i = 0;
            $(".drop-stat__number").each(function () {
                $(this).text(statistic[i++]);
            });
            $("#header_unlogin").hide();
            $("#header_login").css("display","flex");
        }

    });
    $.post("scripts/getGames.php", {}, function (data) {
        data = JSON.parse(data);
        for (let i = 0; i < data.length; i++) {
            let game = $("#structure .gametitle").clone();
            $(game).attr("href","gameinfo.html?" + data[i].Name);
            $(game).find(".namegame").text(data[i].Title);

            $(game).find(".img-game").attr("gameID", data[i].GameID);
            $(game).find(".img-game").attr("src", `img/games/${data[i].Name}.svg`);
            $(game).find(".img-game").attr("alt", `${data[i].Title} картинка`);
            $(".main__wrapper").append(game);
        }
    });

})