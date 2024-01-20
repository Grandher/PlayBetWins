$(function () {
    let Reward;

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    $.post("scripts/getHeaderInfo.php", {}, function (data) {
        data = JSON.parse(data);
        Reward = data.Reward;

        if (data.Avatar) {
            $("img[alt='Avatar']").attr("src", `img/store/avatars/${data.Name}.svg`);
            CURRENT_AVATAR = data.Avatar;
        }

        $(".flex-item-prize").text(Reward);
        $(".nickname").text(data.Login);
        $(".balance span").text(data.Balance);
        let statistic = [data.Wins, data.Losses, data.Draws];

        $(".drop-stat__number").each(function (i = 0) {
            $(this).text(statistic[i++]);
        })

        $("#header_login").css("display", "flex");

        $(".flex-item").each(function (i = 0) {
            if (data.Rewards[i] < Reward) {
                $(this).closest('.button_with_day').css("filter", "grayscale(100%)");
            }
            if (data.Rewards[i] == Reward) {
                $(this).closest('.button_with_day').addClass('current_button');
            }
            $(this).text("+" + data.Rewards[i++]);
        })

        let checkDate = addDays(data.CheckmarkDate, 1);
        let currentDate = new Date();
        let timeDiff = new Date(checkDate.getTime() - currentDate.getTime());
        let humanTime = timeDiff.toISOString().substring(11, 19);

        if (data.CheckmarkDate != 0 && timeDiff > 0) {
            let Timer = setInterval(function () {
                if (timeDiff <= 1) {
                    clearInterval(Timer);
                }
                currentDate = new Date();
                timeDiff = new Date(checkDate.getTime() - currentDate.getTime());
                humanTime = timeDiff.toISOString().substring(11, 19);

                $("#checkmark_time").text("через " + humanTime);
            }, 1000);
            $("#checkmark_time").text("через " + humanTime);
        } else {
            $("#checkmark_time").text("прямо сейчас!");
            $("#checkmark_time").css("font-weight", "bold");

            var scale = 1;
            setInterval(function () {
                scale = scale == 1 ? 1.1 : 1;
                $('.white_rectangle .present').css('transform', `scale(${scale})`);
            }, 1000)
        }
    });

    $.post("scripts/getRating.php", {}, function (data) {
        data = JSON.parse(data);
        for (let i = 0; i < data.length; i++) {
            let topPlayer = $("#structure .top_player").clone();
            $(topPlayer).find(".top-nickname").text(data[i].Login);
            $(topPlayer).find(".score").text(Math.round(data[i].Score));
            if (data[i].Name) {
                $(topPlayer).find(".avatar").attr("src", `img/store/avatars/${data[i].Name}.svg`);
            }
            $("#topList .menu-button").before(topPlayer);

        }
    });

    $.post("scripts/getLastGame.php", {}, function (data) {
        if (data === 'returnToIndex') {
            window.location.href = 'index.html';
        } else {
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++) {
                let lastGame = $("#structure .game_image").parent().clone();
                $(lastGame).attr("href", "gameinfo.html?" + data[i].Name);
                $(lastGame).find("img").attr("src", `img/games/${data[i].Name}.svg`);
                $(lastGame).find("img").attr("alt", `${data[i].Title} картинка`);
                $(".games_square").append(lastGame);
            }

            if (data.length == 0) {
                $(".games_square").append("<p>Пока нет игр :с</p>");
            }
        }

    });

    $(".button_with_day").click(function () {
        if ($(this).hasClass('current_button')) {
            let button = $(this);
            $.post("scripts/setCheckmark.php", {}, function (data) {
                if (data == 200) {
                    $(button).removeClass("current_button");
                    $(button).css("filter", "grayscale(100%)");
                    $(".balance span").text(parseInt($(".balance span").text()) + Reward);

                    $("#modal-checkmark").fadeIn(200);
                    $("#modal-calendar").fadeOut(400);
                }
            });
        }
    })

    $(".calendar").click(function () {
        $('html, body').animate({ scrollTop: 0 }, 400);
        $("body").css("overflow", "hidden");
        $("#modal-calendar").fadeIn(400);
    })

    $(document).click(function (e) {
        if (e.target.id == "modal-calendar") {
            $("body").css("overflow", "auto");
            $("#modal-calendar").fadeOut(400);
        }
        if (e.target.id == "modal-checkmark") {
            $("body").css("overflow", "auto");
            $("#modal-checkmark").fadeOut(400);
        }
    })

})