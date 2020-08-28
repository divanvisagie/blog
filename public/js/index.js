var themeToggleButton = document.createElement('div')

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
    themeToggleButton.innerText = getTextFor(currentTheme);

    detectColorScheme(); //apply the theme
}

 // https://stackoverflow.com/questions/56300132/how-to-over-ride-css-prefers-color-scheme-setting
    //determines if the user has a set theme
function detectColorScheme(){
    var theme="light";    //default to light

    //local storage is used to override OS theme settings
    if(localStorage.getItem("theme")){
        if(localStorage.getItem("theme") == "dark"){
            var theme = "dark";
        }
    } else if(!window.matchMedia) {
        //matchMedia method not supported
        return false;
    } else if(window.matchMedia("(prefers-color-scheme: dark)").matches) {
        //OS theme setting detected as dark
        var theme = "dark";
    }

    //dark theme preferred, set document with a `data-theme` attribute
    if (theme=="dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }
}
//detectColorScheme();
(function() {
    var currentTheme = getCurrentTheme();

    themeToggleButton.innerText = getTextFor(getOpposite(currentTheme))
    themeToggleButton.onclick = toggleDarkMode
    themeToggleButton.style.display = 'block'
    themeToggleButton.style.top = '16px'
    themeToggleButton.style.right = '16px'
    themeToggleButton.style.position = 'absolute'
    themeToggleButton.style.height = '38px'
    themeToggleButton.style.width = '38px'
    themeToggleButton.style.border = 'none'
    themeToggleButton.style.background = 'none'
    themeToggleButton.style.color = 'white'
    themeToggleButton.style.fontSize = '24px'
    themeToggleButton.style.padding = '0'
    themeToggleButton.style.textAlign = 'center'
    themeToggleButton.style.userSelect = 'none'
    themeToggleButton.style.cursor = 'pointer'
    document.querySelector('nav').appendChild(themeToggleButton)
}());
