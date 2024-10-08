export function getCookie(cname) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}
export function setCookie(cname, cvalue, exdays = 30) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 8 * 60 * 60 * 1000);
    var expires = 'expires='
    document.cookie = cname + '=' + cvalue + ";" + expires + ';path=/';
}
export function clearCookie(cname) {
    setCookie(cname, '', -1);
}