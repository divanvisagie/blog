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
// (function() {


// var currentTheme = getCurrentTheme();

// themeToggleButton.innerText = getTextFor(getOpposite(currentTheme))
// themeToggleButton.onclick = toggleDarkMode
// themeToggleButton.style.display = 'block'
// themeToggleButton.style.top = '16px'
// themeToggleButton.style.right = '16px'
// themeToggleButton.style.position = 'absolute'
// themeToggleButton.style.height = '38px'
// themeToggleButton.style.width = '38px'
// themeToggleButton.style.border = 'none'
// themeToggleButton.style.background = 'none'
// themeToggleButton.style.color = 'white'
// themeToggleButton.style.fontSize = '24px'
// themeToggleButton.style.padding = '0'
// themeToggleButton.style.textAlign = 'center'
// themeToggleButton.style.userSelect = 'none'
// themeToggleButton.style.cursor = 'pointer'
// document.querySelector('nav').appendChild(themeToggleButton)
// }())
