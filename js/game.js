$(function () {
    $.post("scripts/getGameInfo.php", {}, function (data) {
        if (data === "401") {
            window.location.href = 'index.html';
        } else if (data === "402") {
            window.location.href = 'home.html';
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
            $("#header_login").css("display", "flex");

            i = 0;

            let playersID = [data.PlayerID_1, data.PlayerID_2];
            let nickname = [data.PlayerLogin_1, data.PlayerLogin_2];
            $(".playerInfo").each(function () {
                $(this).find(".playerName").text(nickname[i]);
                $(this).attr("playerID", playersID[i++]);
            });

            $('html, body').animate({ scrollTop: $(document).height() - $(window).height() }, 400);

            let Enemy = data.PeopleID == data.PlayerID_1 ? data.PlayerID_2 : data.PlayerID_1;

            window.gameData = {
                'MatchID': data.MatchID, 'GameID': data.GameID,
                'Player': data.PeopleID, 'Enemy': Enemy
            };
            $.getScript(`js/games/${data.GameName}.js`, function () {
                // вызов скрипта конкретной игры
            });
        }
    });

    $(".leave-game").click(function () {
        $("body").css("overflow", "hidden");
        $("#modal-conf").fadeIn(400);
        $("#modal-conf").css("top", $(document).scrollTop());
    });

    $("#buttonLeave").click(function () {
        $.post("scripts/leaveGame.php", {
            'MatchID': window.gameData.MatchID,
            'GameID': window.gameData.GameID,
            'Losser': window.gameData.Player,
            'Winner': window.gameData.Enemy
        }, function () {
            window.location.href = 'home.html';
        });
    })

    $(document).click(function (e) {
        if (e.target.id == "modal-conf") {
            $("body").css("overflow", "auto");
            $("#modal-conf").fadeOut(400);
        }
        if (e.target.id == "modal-success") {
            $("body").css("overflow", "auto");
            $("#modal-success").fadeOut(400);
        }
    })
    $(".button__confirmation").click(function () {
        $("body").css("overflow", "auto");
        $("#modal-conf").fadeOut(400);
    })
    $(".button__thanksforpay").click(function () {
        $("body").css("overflow", "auto");
        $("#modal-success").fadeOut(400);
    })
});