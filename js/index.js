$(function () {
    //Открытие окна авторизации
    $("#header_unlogin").find(".menu-button").click(function () {
        $('html, body').animate({ scrollTop: 0 }, 400);
        $("body").css("overflow", "hidden");
        $("#modal-login").fadeIn(400);
    })
    //Открытие окна регистрации
    $(".button__registration").click(function () {
        $('html, body').animate({ scrollTop: 0 }, 400);
        $("body").css("overflow", "hidden");
        $("#modal-register").fadeIn(400);
    })
    //Закрытие модальных окон
    $(document).click(function (e) {
        if (e.target.id == "modal-login") {
            $("body").css("overflow", "auto");
            $("#modal-login").fadeOut(400);
            $("#modal-login .error-message").fadeOut();
        }
        if (e.target.id == "modal-register") {
            $("body").css("overflow", "auto");
            $("#modal-register").fadeOut(400);
        }
    })

    $("#modal-login .support_flex .modal_support").last().click(function () {
        $("#modal-register").css("display", "block");
        $("#modal-login").hide();
    })
    $("#modal-register .modal_support").click(function () {
        $("#modal-login").css("display", "block");
        $("#modal-register").hide();
    })

    $(".login_button").click(function () {
        let username = $('#modal-login input[name="username"]').val();
        let password = $('#modal-login input[name="password"]').val();
        if (password.length < 0 || username.length > 15) {
            $("#modal-login .error-message").text("Неверный логин или пароль");
            $("#modal-login .error-message").fadeIn();
        } else {
            $.post("scripts/login.php", { "username": username, "password": password }, function (data) {
                console.log(data);
                if (data === "SessionStart") {
                    window.location.href = 'home.html';
                } else {
                    $("#modal-login .error-message").text(data);
                    $("#modal-login .error-message").fadeIn();
                }
            });
        }
    })

    $(".reg_button").click(function () {
        let username = $('#modal-register input[name="username"]').val();
        let password = $('#modal-register input[name="password"]').val();
        let passwordRepeat = $('#modal-register input[name="password-repeat"]').val();
        if (username.length > 15) {
            $("#modal-register .error-message").text("Логин не должен превышать 15 символов");
            $("#modal-register .error-message").fadeIn();
        } else if (password.length < 6 || password.length > 20 ) {
            $("#modal-register .error-message").text("Неверный пароль");
            $("#modal-register .error-message").fadeIn();
        } else {
            $.post("scripts/register.php", { "username": username,
                                             "password": password,
                                             "password-repeat": passwordRepeat },
            function (data) {
                console.log(data);
                if (data === "RegisterSuccess") {
                    //window.location.href = 'home.html';
                    alert("Круто");
                } else {
                    $("#modal-register .error-message").text(data);
                    $("#modal-register .error-message").fadeIn();
                }
            });
        }
    })
})