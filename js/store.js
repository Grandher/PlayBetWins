$(function () {
    let SHOP = [];
    let PEOPLE_ITEMS = [];
    let isLogin = false;
    let thisButton;

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
            isLogin = true;
        }
    });

    $(".pricebutton").click(function () {
        let balance = parseInt($(".balance span").text());
        let cost = parseInt($(this).find(".text").text())
        if (!isLogin) {
            $('html, body').animate({ scrollTop: 0 }, 400);
            $("body").css("overflow", "hidden");
            $("#modal-login").fadeIn(400);
        } else if (balance - cost < 0) {
            $("#modal-error").fadeIn(400);
            $("#modal-error").css("top", $(document).scrollTop());
        } else if (!$(this).hasClass("disabled")) {
            thisButton = $(this);
            $("body").css("overflow", "hidden");
            $("#modal-conf").fadeIn(400);
            $("#modal-conf").css("top", $(document).scrollTop());
        }
    });

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

    $("#modal-error .menu-button").click(function () {
        $("body").css("overflow", "auto");
        $("#modal-error").fadeOut(400);
    })

    $("#buttonPay").click(function () {
        $.post("scripts/buyItem.php",
            { "ProductID": $(thisButton).attr("ProductID") }, function (data) {
                if (data === "Ok") {
                    let balance = parseInt($(".balance span").text());
                    $(".balance span").text(balance - parseInt($(thisButton).find(".text").text()));
                    $(thisButton).addClass("disabled");
                    //$(thisButton).parent().find(".shopcatalog img").css("filter", "grayscale(100%)");
                    $(thisButton).parent().find(".shopcatalog .img-game").css("border", ".25vw solid var(--color-light-grey)");
                    $(thisButton).find(".text").text("Куплено");

                    $("body").css("overflow", "hidden");
                    $("#modal-success").fadeIn(400);
                    $("#modal-success").css("top", $(document).scrollTop());
                }
            })
    })

    $(".button__confirmation").click(function () {
        $("body").css("overflow", "auto");
        $("#modal-conf").fadeOut(400);
    })
    $(".button__thanksforpay").click(function () {
        $("body").css("overflow", "auto");
        $("#modal-success").fadeOut(400);
    })

    $(".menu_section").click(function () {
        $(".menu_section").removeClass("selected");
        $(this).addClass("selected");
        fillingShop($(this).attr("type"));
    })

    $.post("scripts/getStore.php", {}, function (data) {
        data = JSON.parse(data);
        SHOP = data.shop;
        PEOPLE_ITEMS = data.peopleitems;
        fillingShop(1);
    });

    function fillingShop(index) {
        $(".borderElement2 .shop").remove();
        let folders = { 1: "avatars", 2: "smiles" };
        for (let i = 0; i < SHOP.length; i++) {
            if (SHOP[i].Type == index) {
                let shop = $("#structure .shop").clone(true);
                $(shop).find(".shopcatalog img").attr("src", `img/store/${folders[index]}/${SHOP[i].Name}.svg`);
                $(shop).find(".shopcatalog img").attr("alt", `image ${SHOP[i].Name}`);
                $(shop).find(".pricebutton .text").text(SHOP[i].Price);
                $(shop).find(".pricebutton").attr("ProductID", SHOP[i].ProductID);

                for (let j = 0; j < PEOPLE_ITEMS.length; j++) {

                    if (PEOPLE_ITEMS[j].Type == index &&
                        PEOPLE_ITEMS[j].ProductID == SHOP[i].ProductID) {
                        $(shop).find(".pricebutton").addClass("disabled");
                        //$(shop).find(".shopcatalog img").css("filter", "grayscale(100%)");
                        $(shop).find(".shopcatalog .img-game").css("border", ".25vw solid var(--color-light-grey)");
                        $(shop).find(".pricebutton .text").text("Куплено");
                    }
                }

                $(".borderElement2").append(shop);
            }
        }
    }

})