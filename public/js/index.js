var themToggle = document.createElement('div')

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
    themToggle.innerText = getTextFor(currentTheme);

    detectColorScheme(); //apply the theme
}
(function() {


var currentTheme = getCurrentTheme();

themToggle.innerText = getTextFor(getOpposite(currentTheme))
themToggle.onclick = toggleDarkMode
themToggle.style.display = 'block'
themToggle.style.top = '16px'
themToggle.style.right = '16px'
themToggle.style.position = 'absolute'
themToggle.style.height = '38px'
themToggle.style.width = '38px'
themToggle.style.border = 'none'
themToggle.style.background = 'none'
themToggle.style.color = 'white'
themToggle.style.fontSize = '24px'
themToggle.style.padding = '0'
themToggle.style.textAlign = 'center'
themToggle.style.userSelect = 'none'
document.querySelector('nav').appendChild(themToggle)
}())