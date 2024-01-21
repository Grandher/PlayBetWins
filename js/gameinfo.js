$(function () {
    let gameID = 0;
    let TIMER;

    $.post("scripts/getHeaderInfo.php", {}, function (data) {
        if (data === "NotSession") {
            $(".betting_menu").hide();
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

            if (data.topPlayer[i].Name) {
                $(topPlayer).find(".avatar").attr("src", `img/store/avatars/${data.topPlayer[i].Name}.svg`);
            }

            $(".rate_white").append(topPlayer);

            let option = $("#structure option").clone();
            $(option).text(data.topPlayer[i].Login);
            $(".betting_menu select").append(option)
        }

    });

    $("#test").click(function () {
        $.post("scripts/testScript.php", { "game": gameID }, function (data) {
            console.log(data);
        });
    });




    $("#startRandom").click(function () {
        $.post("scripts/addMatching.php", { "game": gameID }, function (data) {
            data = parseInt(data);
            switch (data) {
                case 201:
                    $("body").css("overflow", "hidden");
                    $("#modal-waiting").fadeIn(400);
                    $("#modal-waiting").css("top", $(document).scrollTop());
                    let time = 1;
                    TIMER = setInterval(function () {
                        min = parseInt(time / 60, 10);
                        sec = parseInt(time % 60, 10);
                        min = min < 10 && min > 0 ? "0" + min : min;
                        sec = sec < 10 ? "0" + sec : sec;
                        $('#timer').text(min + ":" + sec);
                        time++;

                        $.post("scripts/checkMatching.php", { "game": gameID }, function (match) {
                            match = parseInt(match);
                            if (match == 200) {
                                window.location.href = 'game.html';
                            }
                        });
                    }, 1000);
                    break;
                case 208:
                    window.location.href = 'game.html';
                    break;
                case 500:
                    location.reload();
                    break;
                case 401:
                    $('html, body').animate({ scrollTop: 0 }, 400);
                    $("body").css("overflow", "hidden");
                    $("#modal-login").fadeIn(400);
                    break;
                case 402:
                    alert("Завершите все текущие игры");
                    break;
                default:
                    console.log("error");
            }
        });
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
        if (e.target.id == "modal-waiting") {
            clearInterval(TIMER);
            $("body").css("overflow", "auto");
            $("#modal-waiting").fadeOut(400);
            $.post("scripts/removeMatching.php", {}, function (data) {
                console.log(data);
            });
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
    $("#modalCancel").click(function () {
        clearInterval(TIMER);
        $("body").css("overflow", "auto");
        $("#modal-waiting").fadeOut(400);
        $.post("scripts/removeMatching.php", {}, function (data) {
            console.log(data);
        });
    })
})