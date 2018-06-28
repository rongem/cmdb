function windowOpenAndWaitForClose(url) {
    var win = window.open(url, 'popup_window', 'width=400,height=160,left=100,top=100,resizable=yes');
}
function popUpWindowClosed() {
    location.reload();
}
