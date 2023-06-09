$(function () {
    $.post("scripts/getHeaderInfo.php", {}, function (data) {

        data = JSON.parse(data);

        $(".nickname").text(data.Login);
        $(".nickname__account__txt").text(data.Login);
        $(".balance span").text(data.Balance);
        $(".coins__txt").text(data.Balance);

        let statistic = [data.Wins, data.Losses, data.Draws];
        let i = 0;
        $(".drop-stat__number").each(function () {
            $(this).text(statistic[i++]);
        });
        i = 0;
        $(".header__account__txt").each(function () {
            $(this).find("span").text(statistic[i++]);
        });

        $("#header_login").css("display", "flex");
    });

    $.post("scripts/getPeopleRating.php", {}, function (data) {
        if (data === 'returnToIndex') {
            window.location.href = 'index.html';
        } else {
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++) {
                let lastGame = $("#structure .player_rate[name='top']").clone();
                $(lastGame).find(".nickname").text(data[i].Login);
                $(lastGame).find(".kda").text(data[i].Score);
                $(lastGame).find(".score_rate").text('#' + data[i].Rank);

                /*$(lastGame).find(".avatar").attr("src", `img/games/${data[i].Name}.svg`);
                $(lastGame).find(".avatar").attr("alt", `${data[i].Name} image`);*/
                $("#topMenu .menu-button").before(lastGame);
            }
            for (let i = 0; i < 5 - data.length; i++) {
                $("#topMenu .menu-button").before($("<p></p>"));
            }
        }

    });

    $.post("scripts/getLastBets.php", {}, function (data) {
        if (data === 'returnToIndex') {
            window.location.href = 'index.html';
        } else {
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++) {
                let lastGame = $("#structure .player_rate[name='bets']").clone();
                $(lastGame).find(".nickname").text(data[i].Login);
                $(lastGame).find(".score_rate").text(data[i].Sum);

                $(lastGame).find(".avatar").attr("src", `img/games/${data[i].Name}.svg`);
                $(lastGame).find(".avatar").attr("alt", `${data[i].Name} image`);
                $("#betsMenu .menu-button").before(lastGame);
            }
            for (let i = 0; i < 5 - data.length; i++) {
                $("#betsMenu .menu-button").before($("<p></p>"));
            }
        }

    });

    $.post("scripts/getLastResult.php", {}, function (data) {
        if (data === 'returnToIndex') {
            window.location.href = 'index.html';
        } else {
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++) {
                let lastGame = $("#structure .small__grey__rectangle").clone();
                $(lastGame).find(".nickname").text(data[i].Login);
                $(lastGame).find(".score").text(data[i].Status);

                $(lastGame).find(".avatar").attr("src", `img/games/${data[i].Name}.svg`);
                $(lastGame).find(".avatar").attr("alt", `${data[i].Name} image`);
                $("#gameMenu .menu-button").before(lastGame);
            }
            for (let i = 0; i < 5 - data.length; i++) {
                $("#gameMenu .menu-button").before($("<p></p>"));
            }
        }

    });

    $.post("scripts/getPeopleShop.php", {}, function (data) {
        if (data === 'returnToIndex') {
            window.location.href = 'index.html';
        } else {
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++) {
                let lastGame = $("#structure img[class='avatars']").clone();
                if (data[i].Type == 1) {
                    $(lastGame).attr("src", `img/store/avatars/${data[i].Name}.svg`);
                    $(lastGame).attr("alt", `${data[i].Name} image`);
                    $("#avatarsMenu").append(lastGame);
                } else if (data[i].Type == 2) {
                    $(lastGame).attr("src", `img/store/smiles/${data[i].Name}.svg`);
                    $(lastGame).attr("alt", `${data[i].Name} image`);
                    $("#smilesMenu").append(lastGame);
                }
            }
            if ($("#avatarsMenu img").length == 0) {
                $("#avatarsMenu").append($("#structure .not_pictures").clone());
            }
            if ($("#smilesMenu img").length == 0) {
                $("#smilesMenu").append($("#structure .not_pictures").clone());
            }
        }

    });
})