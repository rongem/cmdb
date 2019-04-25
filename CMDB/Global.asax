<%@ Application Language="C#" %>

<script RunAt="server">

    void Application_Start(object sender, EventArgs e)
    {
        // Code, der beim Anwendungsstart ausgeführt wird

    }

    void Application_End(object sender, EventArgs e)
    {
        //  Code, der beim Herunterfahren der Anwendung ausgeführt wird

    }

    void Application_Error(object sender, EventArgs e)
    {
        // Code, der ausgeführt wird, wenn ein nicht behandelter Fehler auftritt

    }

    void Session_Start(object sender, EventArgs e)
    {
        // Code, der ausgeführt wird, wenn eine neue Sitzung gestartet wird

    }

    void Session_End(object sender, EventArgs e)
    {
        // Code, der ausgeführt wird, wenn eine Sitzung beendet wird. 
        // Hinweis: Das Ereignis "Session_End" wird nur ausgelöst, wenn der Modus "sessionstate"
        // in der Datei "Web.config" auf "InProc" festgelegt ist. Wenn der Sitzungsmodus auf "StateServer" 
        // oder "SQLServer" festgelegt ist, wird das Ereignis nicht ausgelöst.

    }

    protected void Application_BeginRequest()
    {
        string origin = HttpContext.Current.Request.Headers["Origin"];
        if (!string.IsNullOrWhiteSpace(origin))
        {
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", origin);
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Credentials", "true");
            HttpContext.Current.Response.AddHeader("Access-Control-Max-Age", "1728000");
        }
        if (HttpContext.Current.Request.HttpMethod == "OPTIONS") // Preflight Check von Angular muss ohne Credentials erfolgreich sein
        {
            HttpContext.Current.Response.End();
        }
    }

</script>
