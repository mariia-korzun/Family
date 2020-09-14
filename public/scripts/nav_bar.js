function toExpendCloseNavBar() {
    let style = document.getElementById('expended_nav_bar').style
    if (style.display == '') {
        style.display = 'initial'
    }
    else {
        style.display = ''
    }
}
function toCloseNavBar() {
    let widthOfWindow = window.innerWidth;
    let maxWidthOfWindow = 600
    if (widthOfWindow >= maxWidthOfWindow) {
        document.getElementById('expended_nav_bar').style.display = ''
    }
}