$(function () {
    let CURRENT_AVATAR;

    const themes = {
        default: null,
        silver: {
            '--color-basic': '#07569B',
            '--color-ground': '#DCE4E9',
            '--color-black': '#333',
            '--color-white': '#FAFAFA',
            '--color-light-blue': '#7A9CB6',
            '--color-blue-grey': '#5C7080',
            '--color-light-grey': '#A2ACB3',
            '--color-hover': '#2D72B5'
        },
        green: {
            '--color-basic': '#4CAF50',
            '--color-ground': '#F5F5F5',
            '--color-black': '#000',
            '--color-white': '#FFF',
            '--color-light-blue': '#0BDA51',
            '--color-blue-grey': '#607D8B',
            '--color-light-grey': '#CFD8DC',
            '--color-hover': '#138808'
        },
        dark: {
            '--color-basic': '#3f7ab7',
            '--color-ground': '#212e3b',
            '--color-black': '#FFF',
            '--color-white': '#111111',
            '--color-light-blue': '#1c628f',
            '--color-blue-grey': '#95a5a6',
            '--color-light-grey': '#bdc3c7',
            '--color-hover': '#3498db',
        }
    };

    $(".color_card").each(function () {
        let name = $(this).attr("name");
        let current_theme = name == 'default' ? {
            '--color-basic': '#0E87DF',
            '--color-ground': '#EFF7FB',
            '--color-black': '#000',
            '--color-white': '#FFF',
            '--color-light-blue': '#95C8E7',
            '--color-blue-grey': '#7B98B5',
            '--color-light-grey': '#B8C4C4',
            '--color-hover': '#3C9AE1',
        } : themes[name]
        for (let color in current_theme) {
            let card = $("#structure .color").clone();
            $(card).css("background", current_theme[color]);
            $(this).append(card);
        }
    })

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

    $("#theme_menu .color_card").click(function () {
        let name = $(this).attr('name');

        window.localStorage.setItem('theme', JSON.stringify(themes[name]));

        let current_theme = name == 'default' ? {
            '--color-basic': '#0E87DF',
            '--color-ground': '#EFF7FB',
            '--color-black': '#000',
            '--color-white': '#FFF',
            '--color-light-blue': '#95C8E7',
            '--color-blue-grey': '#7B98B5',
            '--color-light-grey': '#B8C4C4',
            '--color-hover': '#3C9AE1',
        } : themes[name]
        for (let color in current_theme) {
            $(':root').css(color, current_theme[color]);
        }
    });
})