$(function () {
    let gameID = 0;

    $.post("scripts/getHeaderInfo.php", {}, function (data) {
        if (data === "NotSession") {
            $(".betting_menu").hide();
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

    $(".player_rate").click(function () {
        let nickname = $(this).find(".nickname").text();
        $("select option:selected").removeAttr('selected');
        $(".betting_menu select option").each(function () {
            if ($(this).text() == nickname) {
                $(this).attr("selected", "selected");
            }
        })

    })

    $.post("scripts/getGameStats.php", { "game": document.location.search }, function (data) {
        data = JSON.parse(data);

        gameID = data.gameInfo.GameID;
        document.title = data.gameInfo.Title;
        $(".chess1").text(data.gameInfo.Title.toUpperCase());
        $(".rook_img").attr("src", `img/games/${data.gameInfo.Name}-white.svg`);

        if (data.gameScore != "NotFound") {
            let statistic = [data.gameScore.Wins, data.gameScore.Losses, data.gameScore.Draws];
            let i = 0;
            $(".counter-p").each(function () {
                $(this).text(statistic[i++]);
            });
        }


        for (let i = 0; i < data.topPlayer.length; i++) {
            let topPlayer = $("#structure .player_rate").clone(true);

            $(topPlayer).find(".nick_rate").text(data.topPlayer[i].Login);
            $(topPlayer).find(".score_kda").text(data.topPlayer[i].Wins + '/' + data.topPlayer[i].Losses + '/' + data.topPlayer[i].Draws);
            $(topPlayer).find(".score").text(data.topPlayer[i].ScoreElo);

            $(".rate_white").append(topPlayer);

            let option = $("#structure option").clone();
            $(option).text(data.topPlayer[i].Login);
            $(".betting_menu select").append(option)
        }

    });


    $("#submitBets").click(function () {
        $("body").css("overflow", "hidden");
        let betSum = parseInt($("#summ").val());
        if (parseInt($(".balance span").text()) > betSum && betSum >= 10) {
            $("#modal-conf").fadeIn(400);
            $("#modal-conf").css("top", $(document).scrollTop());
        } else {
            $("#modal-error").fadeIn(400);
            $("#modal-error").css("top", $(document).scrollTop());
        }
    });

    $("#buttonPay").click(function () {
        let betSum = parseInt($("#summ").val());
        if (parseInt($(".balance span").text()) > betSum && betSum >= 10) {
            let player = $(".betting_menu select").val();
            $.post("scripts/setBets.php", { "Player": player, "Summa": betSum, "GameID": gameID }, function (data) {
                if (data === "Ok") {
                    let balance = parseInt($(".balance span").text());
                    $(".balance span").text(balance - betSum);
                    $("#summ").val("");

                    $("body").css("overflow", "hidden");
                    $("#modal-success").fadeIn(400);
                    $("#modal-success").css("top", $(document).scrollTop());
                }
            });
        }
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
        if (e.target.id == "modal-error") {
            $("body").css("overflow", "auto");
            $("#modal-error").fadeOut(400);
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
})