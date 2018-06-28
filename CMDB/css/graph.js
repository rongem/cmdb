function showMenu(id)
{
    hideAllMenus();
    var elem = document.getElementById(id);
    elem.style.display = "inline";
}

function hideAllMenus()
{
    var all = document.getElementsByClassName("graphMenu");
    for (var i = 0, max = all.length; i < max; i++)
    {
        all[i].style.display = "none";
    }
}