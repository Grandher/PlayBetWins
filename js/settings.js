$(function () {
    let CURRENT_AVATAR;

    $.post("scripts/getHeaderInfo.php", {}, function (data) {

        data = JSON.parse(data);

        if (data.Avatar) {
            $("img[alt='Avatar']").attr("src", `img/store/avatars/${data.Name}.svg`);
            CURRENT_AVATAR = data.Avatar;
        }

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

    $(".menu_section").click(function () {
        let name = $(this).attr('name');
        $(".menu_section").removeClass("selected");
        $(this).addClass("selected");
        $('#password_menu').hide();
        $('#avatars_menu').hide();
        $('#theme_menu').hide();
        $('#' + name + '_menu').show();
    });

    $.post("scripts/getPeopleShop.php", {}, function (data) {
        if (data === 'returnToIndex') {
            window.location.href = 'index.html';
        } else {
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++) {
                let lastGame = $("#structure img[class='avatars']").clone(true);
                if (data[i].Type == 1) {
                    $(lastGame).attr("src", `img/store/avatars/${data[i].Name}.svg`);
                    $(lastGame).attr("alt", `${data[i].Name} image`);
                    $(lastGame).attr("ProductID", data[i].ProductID);
                    $(lastGame).attr("name", data[i].Name);
                    $("#avatarsMenu").append(lastGame);

                    if (CURRENT_AVATAR == data[i].ProductID) {
                        $(lastGame).addClass("disabled");
                    }
                }
            }
        }
    });

    $(".avatars").click(function () {
        let ProductID = $(this).attr('ProductID');
        let name = $(this).attr('Name');
        $(".avatars").removeClass("disabled");
        $(this).addClass("disabled");

        $.post("scripts/setAvatar.php", { "Avatar": ProductID }, function (data) {
            if (data == 200 && ProductID != 0) {
                $("img[alt='Avatar']").attr("src", `img/store/avatars/${name}.svg?${new Date().valueOf()}`);
            } else if (ProductID == 0) {
                $("img[alt='Avatar']").attr("src", `img/icons/Avatars-1.svg?${new Date().valueOf()}`);
            }
        })
    });

    $("#password_menu .menu-button").click(function () {
        let password = $('#password_menu input[name="password"]').val();
        let newPassword = $('#password_menu input[name="new-password"]').val();
        let passwordRepeat = $('#password_menu input[name="password-repeat"]').val();
        if (newPassword != passwordRepeat) {
            $("#password_menu .error-message").text("Пароли не совпадают");
            $("#password_menu .error-message").fadeIn();
        } else if (newPassword.length < 6 || newPassword.length > 20) {
            $("#password_menu .error-message").text("Неподходящий пароль");
            $("#password_menu .error-message").fadeIn();
        } else {
            $.post("scripts/setPassword.php", {
                "password": password,
                "newPassword": newPassword
            },
                function (data) {
                    if (data == 200) {
                        $("#modal-success").fadeIn(400);
                    } else {
                        $("#password_menu .error-message").text(data);
                        $("#password_menu .error-message").fadeIn();
                    }
                });
        }
    })

    $(document).click(function (e) {
        if (e.target.id == "modal-success") {
            $("body").css("overflow", "auto");
            $("#modal-success").fadeOut(400);
        }
    })

    $("#modal-success .menu-button").click(function () {
        $("#modal-success").fadeOut(400);
    })
})