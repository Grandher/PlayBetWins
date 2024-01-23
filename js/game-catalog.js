$(function () {
    $.post("scripts/getHeaderInfo.php", {}, function (data) {
        if (data === "NotSession") {
            $(".header__left").attr("href", "index.html");
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
            $("#header_login").css("display", "flex");
        }

    });
    $.post("scripts/getGames.php", {}, function (data) {
        data = JSON.parse(data);

        let loadedGames = 0;
        let loadedImages = [];
        let loadedTitles = [];
        let loadedLinks = [];

        for (let i = 0; i < data.length; i++) {

            loadedTitles[i] = data[i].Title;
            loadedLinks[i] = "gameinfo.html?" + data[i].Name;

            $.get(`img/games/${data[i].Name}.svg`, function (svgContent) {

                svgContent = $(svgContent).find('svg');
                $(svgContent).addClass('img-game');
                $(svgContent).attr("gameID", data[i].GameID);

                loadedImages[i] = svgContent;
                loadedGames++;

                if (loadedGames === data.length) {

                    for (let j = 0; j < loadedImages.length; j++) {
                        let game = $('<a class="gametitle"></a>');
                        $(game).attr("href", loadedLinks[j]);
                        $(game).html(loadedImages[j]);
                        $(game).append(`<div class="namegame">${loadedTitles[j]}</div>`);
                        $(".main__wrapper").append(game.clone());
                    }
                }
            });
        }
    });

})