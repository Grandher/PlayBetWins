$(document).ready(function () {
    let theme = JSON.parse(window.localStorage.getItem('theme'));

    for (let color in theme) {
        $(':root').css(color, theme[color]);
    }

    $('.phoneMenu').hover(
        function () {
            $('.header__center').css({
                'visibility': 'visible',
                'opacity': '1'
            });
        },
        function () {
            $('.header__center').css({
                'visibility': 'hidden',
                'opacity': '0'
            });
        }
    );
});

