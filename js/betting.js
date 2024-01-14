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

    $(".player_rate").click(function () {
        let nickname = $(this).find(".nickname").text();
        $("select option:selected").removeAttr('selected');
        $(".betting_menu select option").each(function () {
            if ($(this).text() == nickname) {
                $(this).attr("selected", "selected");
            }
        })
    })

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
        let gameID = $(".selected").attr("GameID");
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

    $("#modal-error .menu-button").click(function () {
        $("body").css("overflow", "auto");
        $("#modal-error").fadeOut(400);
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

    //Обработка выбора игры
    $(".menu_section").click(function () {
        $(".menu_section").removeClass("selected");
        $(this).addClass("selected");
        fillTopPlayer($(this).attr("gameID"));
    })

    $.post("scripts/getGames.php", {}, function (data) {
        data = JSON.parse(data);
        for (let i = 0; i < data.length; i++) {
            let game = $("#structure .menu_section").clone(true);
            if (i == 0) {
                $(game).addClass("selected");
            }
            $(game).find(".text").text(data[i].Title);
            $(game).attr("gameID", data[i].GameID);
            $(".borderElement1").append(game);
        }
    });
    function fillTopPlayer(index) {
        $(".borderElement3 .player_rate").remove();
        $(".betting_menu select option").remove();
        $.post("scripts/getRates.php", { "GameID": index }, function (data) {
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++) {
                let topPlayer = $("#structure .player_rate").clone(true);

                $(topPlayer).find(".nick_rate").text(data[i].Login);
                $(topPlayer).find(".score_kda").text(data[i].Wins + '/' + data[i].Losses + '/' + data[i].Draws);
                $(topPlayer).find(".score").text(Math.round(data[i].Score));
                if (data[i].Name) {
                    $(topPlayer).find(".avatar").attr("src", `img/store/avatars/${data[i].Name}.svg`);
                }

                let option = $("#structure option").clone();
                $(option).text(data[i].Login);
                $(".betting_menu select").append(option);
                //$(".borderElement3").append(topPlayer);
                $(".betting_menu").before(topPlayer);
            }
        });
    }

    fillTopPlayer(0);

})