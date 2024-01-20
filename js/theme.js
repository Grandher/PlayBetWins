$(document).ready(function () {
    let theme = JSON.parse(window.localStorage.getItem('theme'));

    for (let color in theme) {
        $(':root').css(color, theme[color]);
    }
});

