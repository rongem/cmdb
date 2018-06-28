<%@ Page Language="C#" MasterPageFile="~/HelpPages/help.master" AutoEventWireup="true" %>
<asp:Content ID="cSectionHeader" ContentPlaceHolderID="cphSectionHeader" runat="server">
    Allgemeine Suche (Startseite)
</asp:Content>
<asp:Content ID="cSectionArticle" ContentPlaceHolderID="cphSectionArticle" runat="server">
    <h1>Suchkriterien </h1>
    <p>
        Mit der allgemeinen Suche k&ouml;nnen Configuration Items (CIs) nach folgenden Kriterien 
    gefunden werden:
    </p>
    <ul>
        <li><b>Name oder Attributwert</b>: Es werden alle Configuration Items angezeigt, die den 
            eingegebenen Text als Bestandteil des Namens oder eines Attributwerts enthalten. Wird 
            vor dem zu suchenden Text ein Ausrufezeichen (!) eingegeben, werden alle Configuration 
            Items gesucht, die den eingegebenen Text <b>nicht</b> als Bestandteil des Namens oder 
            eines Attributwerts enthalten.</li>
        <li><b>Typ des Configuration Items</b>: Es werden nur Configuration Items gesucht, die dem 
            angegebenen Typ entsprechend. Diese Suchoption ist als Standard aktiviert. Durch das 
            Aktivieren werden zus&auml;tzliche Suchm&ouml;glichkeiten freigeschaltet, au&szlig;erdem 
            k&ouml;nnen mehrere gleichartige Items 
            <a href="editmultipleitems.aspx">gleichzeitig bearbeitet</a> werden.</li>
        <ul>
            <li><b>Attributwert</b>: Zus&auml;tzlich zur allgemeinen Suche nach Name oder Attributwert 
                kann nach Configuration Items gesucht werden, bei denen ein bestimmtes Attribut einen 
                angegebenen Text enth&auml;lt. Bleibt das Textfeld mit dem zu suchenden Text hinter 
                dem Attributnamen leer, werden alle Items gefunden, bei denen das Attribut nicht 
                vorhanden ist. Wird in dem Textfeld nur ein Ausrufezeichen eingegeben, werden nur die 
                Configuration Items angezeigt, bei denen das Attribut vorhanden ist, egal welchen Wert 
                es enth&auml;lt. Steht das Ausrufezeichen am Anfang und es folgen weitere Zeichen, wird 
                nach Attributen des angegebenen Typs gesucht, bei denen der Text nicht vorkommt.</li>
            <li><b>Abw&auml;rts gerichtete Verbindungen</b>: Hierbei werden Verkn&uuml;pfungen zwischen 
                den Objekten untersucht. Die Suchrichtung ist abw&auml;rts, d. h. es wird nach CIs 
                gesucht, von denen das gefundene CI abh&auml;ngig ist. Es wird der Verbindungstyp und 
                die Anzahl der zu suchenden Verbindungen angegeben. 0 bedeutet, dass keine Verbindungen 
                existieren d&uuml;rfen, 1, dass genau eine Verbindung existiert, > 0 bzw. > 1, dass 
                mindestens eine bzw. zwei Verbindungen dieses Typs existieren d&uuml;rfen.</li>
            <ul>
                <li>Zus&auml;tzlich kann noch der am Ende der Verbindung liegende CI-Typ angegeben, 
                    auf den sich die Anzahl dann bezieht. Wird er nicht angegeben, werden alle CI-Typen 
                    gesucht. Das ist z. B. sinnvoll, wenn in einer Suche egal ist, ob eine Server-Hardware 
                    in ein Blade Enclosure oder ein Rack eingebaut ist. </li>
            </ul>
            <li><b>Aufw&auml;rts gerichtete Verbindungen</b>: Hierbei werden Verkn&uuml;pfungen zwischen den 
                Objekten untersucht. Die Suchrichtung ist aufw&auml;rts, d. h. es wird nach CIs gesucht, 
                die von dem gefundenen CI abh&auml;ngen. Es wird der Verbindungstyp und die Anzahl der zu 
                suchenden Verbindungen angegeben. 0 bedeutet, dass keine Verbindungen existieren 
                d&uuml;rfen, 1, dass genau eine Verbindung existiert, > 0 bzw. > 1, dass mindestens eine 
                bzw. zwei Verbindungen dieses Typs existieren d&uuml;rfen.</li>
            <ul>
                <li>Zus&auml;tzlich kann noch der am Ende der Verbindung liegende CI-Typ angegeben, 
                    auf den sich die Anzahl dann bezieht. Wird er nicht angegeben, werden alle CI-Typen 
                    gesucht. Das ist z. B. sinnvoll, wenn in einer Suche egal ist, ob in einer eine 
                    Server-Hardware ein ESX-Host oder ein Server l&auml;uft.</li>
            </ul>
        </ul>
        <li><b>Nur Items anzeigen, f&uuml;r die ich verantwortlich bin </b>: Hierbei wird die Suche 
            auf die CIs eingeschr&auml;nkt, f&uuml;r die der aktive Benutzer die Verantwortung 
            &uuml;bernommen hat.</li>
    </ul>
    <h1>Suche durchf&uuml;hren</h1>
    <p>
        Ein Klick auf die Schaltfl&auml;che &quot;Suchen&quot; startet die Suche, wobei die Suchdauer 
        von der Anzahl er gefundenen Items abh&auml;ngt: je mehr CIs gefunden werden, desto l&auml;nger 
        dauert der Aufbau der Suchergebnisse.
    </p>
    <h1>Suchergebnisse</h1>
    <p>
        Das Suchergebnis wird als Linkliste dargestellt. Dabei wird jedes gefundene CI mit seinem Typ 
        und seinem eindeutigen Namen dargestellt. Attribute oder verkn&uuml;pfte CIs werden nicht 
        dargestellt.
    </p>
    <p>Sofern alle CIs den gleichen Typ besitzen, kann eine Massenbearbeitung stattfinden.</p>
    <p>
        Wird ein einzelnes CI angeklickt, wird die <a href="showitem.aspx">Detaildarstellung zur Ansicht</a>
        ge&ouml;ffnet. Dr&uuml;ckt man beim Anklicken die Strg-Taste, &ouml;ffnet sich die Seite 
        in einem neuen Browser-Tab, so dass man mehrere gefundene CIs nacheinander ansehen (und ggf. 
        bearbeiten) kann.
    </p>
    <h1>Export</h1>
    <p>
        Die Liste der gefundenen CIs kann als Excel-Datei im Excel-2003-XML-Format oder als CSV-Datei 
        exportiert werden. Dabei wird neben dem Typ und dem Namen der CIs auch alle Attribute ausgegeben.
    </p>
    <h2>Zus&auml;tzliche Informationen anzeigen</h2>
    <p>
        Es besteht die M&ouml;glichkeit, einzelne Attribute oder Verbindungen zu anderen Configuration 
        Items anzuzeigen. Diese werden in der Liste hinter dem Namen angef&uuml;gt.
    </p>
    <h1>Mehrfachauswahl</h1>
    <p>
        Sofern der entsprechende Button geklickt wird, erscheinen die Suchergebnisse als Liste mit 
        einer vorgestellten Auswahlbox. Dabei sind alle Eintr&auml;ge bereits ausgew&auml;hlt, 
        f&uuml;r die der aktuelle Anwender die Verantwortung &uuml;bernommen hat. Die Auswahl kann 
        entweder manuell ver&auml;ndert werden, oder durch Auswahl der Auswahlliste 
        &quot;(Ausw&auml;hlen)&quot; k&ouml;nnen folgende Vorauswahlen getroffen werden:
    </p>
    <ul>
        <li>Alle angezeigten Items ausw&auml;hlen</li>
        <li>Auswahl aufheben</li>
        <li>Alle Items ausw&auml;hlen, f&uuml;r die ich verantwortlich bin</li>
        <li>Alle Items ausw&auml;hlen, f&uuml;r die ich nicht verantwortlich bin</li>
    </ul>
    <p>Diese Aktionen ver&auml;ndern vorhandene manuelle Auswahlen.</p>
    <p>
        Da beim Klicken auf die Schaltfl&auml;che 
        <a href="editmultipleitems.aspx">&quot;Ausgew&auml;hlte gemeinsam editieren&quot;</a>
        f&uuml;r alle ausgew&auml;hlten CIs, f&uuml;r die der aktuelle Benutzer nicht 
        verantwortlich ist, die Verantwortung automatisch &uuml;bernommen wird, kann 
        diese Aktion dazu verwendet werden, um f&uuml;r mehrere Items gleichzeitig die 
        Verantwortung zu &uuml;bernehmen. In diesem Fall wird danach kein weiterer 
        Schritt mehr ausgef&uuml;hrt.
    </p>
</asp:Content>
