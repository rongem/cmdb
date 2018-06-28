var isIntranet = false;
var isDOMCapable = false;
if (document.getElementsByTagName && document.getElementById && document.createElement && document.createTextNode && document.appendChild) {
    isDOMCapable = true;
}
function addEvent(obj, evType, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(evType, fn, false);
        return true;
    } else if (obj.attachEvent) {
        var r = obj.attachEvent("on" + evType, fn);
        return r;
    } else {
        return false;
    }
}
function init(id, src, text, introtxt) {
    if (document.getElementsByTagName) {
        var anchors = document.getElementsByTagName("a");
        for (var i = 0;
        i < anchors.length;
        i++) {
            var myAnchor = anchors[i];
        }
    }
    renderPrintLink(id, src, text, introtxt);
}
function printPage() {
    var isIE = (navigator.appName == "Microsoft Internet Explorer") ? true : false;
    var platform = navigator.platform;
    var isMac = (platform.match(/mac/i)) ? true : false;
    var isMacIE = isIE && isMac;
    var isSafari = navigator.userAgent.indexOf("Safari") != -1;
    if (window.print && !isMacIE && !isSafari) {
        window.print();
    } else if (document.getElementsByTagName) {
        var a;
        for (var i = 0;
        (a = document.getElementsByTagName("link")[i]) ;
        i++) {
            if (a.getAttribute("rel").indexOf("style") != -1) {
                a.disabled = true;
                if (a.getAttribute("rel").indexOf("alt") != -1 && a.getAttribute("title") == "Druckansicht") {
                    a.disabled = false;
                }
            }
        }
    } else {
        alert("Diese Funktion wird von Ihrem Browser nicht unterstützt.\nBitte benutzen Sie die Druckfunktion Ihres Browsers.");
    }
}
if (!document.getElementById) {
    document.getElementById = function () {
        return null;
    }
}
function renderPrintLink(id, src, text, introtxt) {
    var node = document.getElementById(id);
    if (isDOMCapable && node) {
        if (introtxt && introtxt != "") {
            introtxt += " ";
            node.appendChild(document.createTextNode(introtxt));
        }
        var img = document.createElement("img");
        img.setAttribute("src", src);
        img.setAttribute("alt", text);
        node.appendChild(img);
        var a = document.createElement("a");
        a.href = "javascript:printPage();";
        a.style.color = "#900";
        a.appendChild(document.createTextNode(text));
        node.appendChild(a);
        var span = document.createElement("span");
        span.className = "white";
        node.appendChild(span);
    }
}
var newWindow;
function makeNewWindow(obj) {
    newWindow = window.open("", "sub", "status,resizable,height=200,width=400");
    if (!newWindow.opener) {
        newWindow.opener = window;
    }
    setTimeout("writeToWindow('" + obj + "')", 500);
    newWindow.focus();
}
function writeToWindow(obj) {
    var newContent = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"\n";
    newContent += "    \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n\n";
    newContent += "<html>\n<head>\n";
    newContent += "<title>Online-Styleguide : Hinweis</title>\n";
    for (var i = 0;
    (a = document.getElementsByTagName("link")[i]) ;
    i++) {
        if (a.getAttribute("rel") == "stylesheet") {
            newContent += "<link rel=\"stylesheet\" href=\"" + a.getAttribute('href') + "\" type=\"text/css\" media=\"screen, projection\" title=\"Standard\" />\n";
        }
    }
    newContent += "</head>\n";
    newContent += "<body id=\"hinweis\"><div><p>Die Adresse <a href=\"" + obj + "\" target=\"_blank\" title=\"&Ouml;ffnet neues Fenster\">" + (obj.indexOf('http://www') != -1 ? obj.substring(7) : obj) + "</a> ist nur &uuml;ber einen Internetzugang erreichbar.</p></div>";
    newContent += "</body>\n</html>";
    newWindow.document.write(newContent);
    newWindow.document.close();
}
