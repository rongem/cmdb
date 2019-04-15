<%@ Application Language="C#" %>

<script runat="server">

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
        string[] allowedOrigin = new string[] { "http://localhost:4200", "http://localhost:51717" };
        var origin = HttpContext.Current.Request.Headers["Origin"];
        if (origin != null && allowedOrigin.Contains(origin))
        {
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", origin);
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
        }
        HttpContext.Current.Response.AddHeader("Test", "Test");
    }

</script>
