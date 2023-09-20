$(function () {
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    $.post("scripts/getHeaderInfo.php", {}, function (data) {
        data = JSON.parse(data);

        $(".nickname").text(data.Login);
        $(".balance span").text(data.Balance);
        let statistic = [data.Wins, data.Losses, data.Draws];
        let i = 0;
        $(".drop-stat__number").each(function () {
            $(this).text(statistic[i++]);
        })

        $("#header_login").css("display","flex");

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
            $(topPlayer).find(".score").text(data[i].Score);
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
                $(lastGame).attr("href","gameinfo.html?" + data[i].Name);
                $(lastGame).find("img").attr("src", `img/games/${data[i].Name}.svg`);
                $(lastGame).find("img").attr("alt", `${data[i].Title} картинка`);
                $(".games_square").append(lastGame);
            }
        }

    });

})