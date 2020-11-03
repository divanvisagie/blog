
var themeToggleButton = document.querySelector('#darkmode-button')
function getTextFor(theme) {
    if (theme === 'dark')
        return '☽'
    return '☼';
}

function getOpposite(theme) {
    if (theme === 'dark') return 'light'
    return 'dark'
}

function getCurrentTheme() {
    var dataTheme = document.documentElement.getAttribute('data-theme');
    if (!dataTheme) {
        dataTheme = 'light'
    }
    return dataTheme
}

function toggleDarkMode() {
    var currentTheme = getCurrentTheme()
    var opposite = getOpposite(currentTheme);

    localStorage.setItem('theme', opposite)
    document.documentElement.setAttribute('data-theme', opposite);
    themeToggleButton.title = (currentTheme);

    detectColorScheme(); //apply the theme
}

// https://stackoverflow.com/questions/56300132/how-to-over-ride-css-prefers-color-scheme-setting
//determines if the user has a set theme
function detectColorScheme() {
    var theme = "light";    //default to light

    //local storage is used to override OS theme settings
    if (localStorage.getItem("theme")) {
        if (localStorage.getItem("theme") == "dark") {
            var theme = "dark";
        }
    } else if (!window.matchMedia) {
        //matchMedia method not supported
        return false;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        //OS theme setting detected as dark
        var theme = "dark";
    }

    //dark theme preferred, set document with a `data-theme` attribute
    if (theme == "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }
}
detectColorScheme();
(function () {
    var currentTheme = getCurrentTheme();

    themeToggleButton.setAttribute('title', getOpposite(currentTheme))

    // themeToggleButton.innerText = getTextFor(getOpposite(currentTheme))
    themeToggleButton.onclick = toggleDarkMode;
}());
