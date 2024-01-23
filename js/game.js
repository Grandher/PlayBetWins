$(function () {
    let CHAT_LEN = 0;
    $.post("scripts/getGameInfo.php", {}, function (data) {
        if (data === "401") {
            window.location.href = 'index.html';
        } else if (data === "402") {
            window.location.href = 'home.html';
        } else {
            data = JSON.parse(data);
            if (data.Avatar) {
                $("img[alt='Avatar']").attr("src", `img/store/avatars/${data.Name}.svg`);
            }
            if (data.PlayerAvatar_1) {
                $(".playerInfo img").first().attr("src", `img/store/avatars/${data.PlayerAvatar_1}.svg`);
            }
            if (data.PlayerAvatar_2) {
                $(".playerInfo img").last().attr("src", `img/store/avatars/${data.PlayerAvatar_2}.svg`);
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

    $.post("scripts/getPeopleShop.php", {}, function (data) {
        data = JSON.parse(data);
        for (let i = 0; i < data.length; i++) {
            let image = $("#structure .smile").clone(true);
            if (data[i].Type == 2) {
                $(image).attr("src", `img/store/smiles/${data[i].Name}.svg`);
                $(image).attr("alt", `${data[i].Name} smile`);
                $(image).attr("ProductID", data[i].ProductID);
                $(".smiles_box").append(image);
            }
        }
        if ($(".smiles_box img").length == 0) {
            $(".smiles_box").append("<p>У вас нет смайликов для общения :с</p>")
        }
    });

    $(".smile").click(function () {
        $.post("scripts/addMessage.php", {
            'MatchID': window.gameData.MatchID,
            'Message': null,
            'Smile': $(this).attr("ProductID")
        }, function (data) {
        });
    });

    $(".message_box button").click(function () {
        $.post("scripts/addMessage.php", {
            'MatchID': window.gameData.MatchID,
            'Message': $(this).text(),
            'Smile': null
        }, function (data) {
        });
    });

    TIMER = setInterval(function () {
        $.post("scripts/getMessage.php", {
            'MatchID': window.gameData.MatchID
        }, function (data) {
            data = JSON.parse(data);
            if (data.length > CHAT_LEN) {
                CHAT_LEN = data.length;
                $("#chat").empty();
                for (let i = 0; i < data.length; i++) {
                    let message = $("#structure .message").clone();
                    if (data[i].AuthorID == window.gameData.Player) {
                        $(message).addClass("user");
                    }
                    if (data[i].Avatar) {
                        $(message).find("img").attr("src", `img/store/avatars/${data[i].Avatar}.svg`);
                    }
                    if (data[i].Smile) {
                        let smile = $(`<img src="img/store/smiles/${data[i].Smile}.svg" alt="${data[i].Smile} smile">`);
                        $(message).find(".content").append(smile);
                    } else if (data[i].Content) {
                        let span = $(`<span>${data[i].Content}</span>`);
                        $(message).find(".content").append(span);
                    }
                    $(message).find(".date").text(data[i].Time.slice(11, 16));
                    $("#chat").append(message);
                }
                $("#chat").scrollTop($("#chat")[0].scrollHeight);
            }
        });
    }, 1000);

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