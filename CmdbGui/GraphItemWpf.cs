using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace CmdbEditor
{

    /// <summary>
    /// Klasse zur Erstellung von Grafik-Objekten für die Darstellung von Configuration Items
    /// </summary>
    public class GraphItemWpf : GraphItem
    {
        private Button button;
        private TextBlock textBlock;
        private Color backgroundColor;
        private MenuItem miAttributes, miLinks, miResponsible;

        /// <summary>
        /// Click kann das Click-Event auf dem Button an ein externes Programm weiterleiten
        /// Expand wird gefeuert, wenn ein Objekt seine Kindelemente anzeigen soll
        /// ExpandAll wird gefeuert, wenn ein Objekt rekursiv alle Kindelemente anzeigen soll
        /// </summary>
        public event EventHandler Click, Expand, ExpandAll, CenterNewWindow;

        #region Eigenschaften

        /// <summary>
        /// Gibt die Farbe als Farbe zurück
        /// </summary>
        public Color Color { get { return this.backgroundColor; } }

        #endregion

        /// <summary>
        /// Konstruktor. Erzeugt ein GraphObject, das einen Button mit dem Typ und Namen des CI anzeigt. Hier ist die Farbe der HTML-Code
        /// </summary>
        /// <param name="r">Configuration Item-Datensatz, für den das Objekt erzeugt wird</param>
        /// <param name="backColor">Hintergrundfarbe für den Button</param>
        /// <param name="direction">Richtung, in der das Objekt erweitert wurde: Upward für Objekte oberhalb, Downward für Objekte unterhalb und Both für das zentrale Objekt</param>
        /// <param name="Level">Ebene, auf der das Objekt steht. Negativ für Objekte oberhalb, Positiv für Objekte unterhalb und 0 für das zentrale Objekt</param>
        /// <param name="canExpand">Gibt an, ob das Objekt in der angegebenen Richtung erweitert werden kann</param>
        public GraphItemWpf(CMDBDataSet.ConfigurationItemsRow r, string backColor, GraphDirection direction, int Level, bool canExpand) :
            base(r, backColor, direction, Level, canExpand)
        {
            this.textBlock = WpfHelper.createTextBlock(this.Caption, new Thickness(10, 5, 10, 5));
            this.textBlock.MaxWidth = 180;
            this.textBlock.TextWrapping = TextWrapping.Wrap;
            this.button = WpfHelper.createButton(this.textBlock, this.button_Click);
            this.backgroundColor = (Color)ColorConverter.ConvertFromString(backColor);
            this.button.Background = new LinearGradientBrush(Colors.LightGray, this.backgroundColor , 90);
            this.button.BorderThickness = (myDirection == GraphDirection.Both ? new Thickness(4, 4, 4, 4) : new Thickness(1, 1, 1, 1));
            this.button.MaxHeight = 80;
            this.button.MaxWidth = 200;
            this.button.ToolTip = "Klicken für weitere Optionen";
            this.button.Measure(new Size(200, double.PositiveInfinity));
            this.height = this.button.DesiredSize.Height;
            this.width = this.button.DesiredSize.Width;
            this.ownId = r.ItemId;
            this.HasFollowers = canExpand;
            this.level = Level;
            this.myDirection = direction;
        }

        /// <summary>
        /// Fügt die Attribute zur Ansicht dem Kontextmenü hinzu
        /// </summary>
        /// <param name="attributes">String-Array mit den Attributen im Stil: Attributtyp: Wert</param>
        /// <param name="dtl">Tabelle mit den ItemLinks</param>
        /// <param name="users">Benutzerdaten der Verantwortlichen</param>
        public void AddAttributesAndLinksAndResponsible(string[] attributes, CMDBDataSet.ItemLinksDataTable dtl, Dictionary<string, string>[] users)
        {
            // Attribute
            miAttributes = new MenuItem();
            miAttributes.Header = "Attribute";
            miAttributes.IsEnabled = attributes.Length > 0;
            for (int i = 0; i < attributes.Length; i++)
            {
                MenuItem ai = new MenuItem();
                ai.Header = attributes[i];
                ai.IsEnabled = false;
                miAttributes.Items.Add(ai);
            }
            // Links
            miLinks = new MenuItem();
            miLinks.Header = "Links";
            miLinks.IsEnabled = dtl.Count > 0;
            foreach (CMDBDataSet.ItemLinksRow r in dtl.Rows)
            {
                MenuItem li = new MenuItem();
                li.Header = r.LinkDescription;
                li.ToolTip = r.LinkURI;
                li.Click += menuLink_Click;
                miLinks.Items.Add(li);
            }
            //Verantwortliche
            miResponsible = new MenuItem();
            miResponsible.Header = "Verantwortliche";
            miResponsible.IsEnabled = users.Count() > 0;
            for (int i = 0; i < users.Length; i++)
            {
                MenuItem ui = new MenuItem();
                ui.Header = users[i]["displayname"];
                ui.ToolTip = "Mail schreiben";
                ui.Click += menuUser_Click;
                ui.Tag = string.Format("mailto:{0}?subject={1}", users[i]["mail"], this.textBlock.Text.Replace("\r\n", " "));
                miResponsible.Items.Add(ui);
            }
        }

        private void menuUser_Click(object sender, RoutedEventArgs e)
        {
            //Startet einen Prozess mit der Mail-Adresse des Links
            System.Diagnostics.Process.Start(((MenuItem)sender).Tag.ToString());
        }

        private void menuLink_Click(object sender, RoutedEventArgs e)
        {
            // Startet einen Prozess mit dem Link im Attribut. Windows erkennt, ob es sich um einen Weblink
            // oder um eine Datei handelt und öffnet das entsprechende Programm automatisch
            System.Diagnostics.Process.Start(((MenuItem)sender).ToolTip.ToString());
        }

        private void button_Click(object sender, RoutedEventArgs e)
        {
            Button b = (Button)sender;
            if (b.ContextMenu != null)
            {
                b.ContextMenu.PlacementTarget = b;
                b.ContextMenu.Placement = System.Windows.Controls.Primitives.PlacementMode.Bottom;
                b.ContextMenu.IsOpen = true;
            }
            if (this.Click != null)
                this.Click(this, e);
        }

        /// <summary>
        /// Zeichnet das Objekt auf einer Leinwand
        /// </summary>
        /// <param name="parent">Canvas-Objekt, auf dem gezeichnet wird</param>
        /// <param name="xOffset">X-Position der linken oberen Ecke</param>
        /// <param name="yOffset">Y-Position der linken oberen Ecke</param>
        /// <param name="width">Vorgegebene Breite des Objekts</param>
        /// <param name="height">Vorgegebene Höhe des Objekts</param>
        public void AddToCanvas(Canvas parent, double xOffset, double yOffset, double width, double height)
        {
            this.height = height;
            this.width = width;
            this.button.Width = width;
            this.button.Height = height;
            this.button.MaxWidth = width;
            this.button.MaxHeight = height;
            this.textBlock.MaxWidth = width - 20;
            this.textBlock.MaxHeight = height - 10;
            this.textBlock.VerticalAlignment = VerticalAlignment.Center;
            this.textBlock.HorizontalAlignment = HorizontalAlignment.Center;
            if (this.button.ContextMenu != null) // ContextMenu löschen, bevor es neu zugewiesen wird, um Fehler zu vermeiden
            {
                this.button.ContextMenu.Items.Clear();
                this.button.ContextMenu = null;
            }
            ContextMenu cm = new ContextMenu();
            if (miAttributes.IsEnabled) // Attribute ggf. hinzufügen
                cm.Items.Add(miAttributes);
            if (miLinks.IsEnabled) // Links ggf. hinzufügen
                cm.Items.Add(miLinks);
            if (miResponsible.IsEnabled) // Verantwortliche ggf. hinzufügen
                cm.Items.Add(miResponsible);
            if (this.HasFollowers) // Verbundene CIs hinzufügen, wenn vorhanden und nicht bereits ausgeklappt
            {
                if (cm.Items.Count > 0)
                    cm.Items.Add(new Separator());
                MenuItem mi = new MenuItem();
                mi.Header = "Verbundene CIs ansehen " + (this.Direction == GraphDirection.Upward ? "(aufwärts)" : "(abwärts)");
                mi.Click += miExpand_Click;
                cm.Items.Add(mi);
                //mi = new MenuItem();
                //mi.Header = "Alle verbundenen CIs ansehen " + (this.Direction == GraphDirection.Upward ? "(aufwärts)" : "(abwärts)");
                //mi.Click += miExpandAll_Click;
                //cm.Items.Add(mi);
            }
            if (this.Direction != GraphDirection.Both) // Eigenes Fenster für CI öffnen hinzufügen
            {
                MenuItem mi = new MenuItem();
                mi.Header = "Dieses Item in neuem Fenster zentrieren";
                mi.Click += miCenterNewWindow;
                cm.Items.Add(mi);
            }
            if (cm.Items.Count > 0) // Kontextmenü hinzufügen, wenn Einträge vorhanden. Sonst Tooltips verändern
                this.button.ContextMenu = cm;

            // Element positionieren
            parent.Children.Add(this.button);
            Canvas.SetTop(this.button, yOffset);
            Canvas.SetLeft(this.button, xOffset);
            this.left = xOffset;
            this.top = yOffset;
            if (!this.button.IsMeasureValid)
                this.button.UpdateLayout();
        }

        /// <summary>
        /// Wird vom MenuItem aufgerufen, wenn ein Objekt in einem neuen Fenster zentriert werden soll
        /// </summary>
        private void miCenterNewWindow(object sender, RoutedEventArgs e)
        {
            if (this.CenterNewWindow != null)
                this.CenterNewWindow(this, EventArgs.Empty);
        }

        /// <summary>
        /// Wird vom MenuItem aufgerufen, wenn ein Objekt seine Kindelemente erweitern soll
        /// </summary>
        private void miExpand_Click(object sender, RoutedEventArgs e)
        {
            if (this.Expand != null)
            {
                this.HasFollowers = false;
                this.Expand(this, EventArgs.Empty);
            }
            e.Handled = true;
        }

        /// <summary>
        /// Wird vom MenuItem aufgerufen, wenn ein Objekt rekursiv über seine Kindelemente bis zum Ende iterieren und diese anzeigen soll
        /// </summary>
        private void miExpandAll_Click(object sender, RoutedEventArgs e)
        {
            if (this.Expand != null)
            {
                this.ExpandAll(this, EventArgs.Empty);
                this.HasFollowers = false;
            }
            e.Handled = true;
        }

        public void ExpandAllSubs()
        {
            if (this.ExpandAll != null && this.HasFollowers == true)
            {
                this.ExpandAll(this, EventArgs.Empty);
                this.HasFollowers = false;
            }
        }

    }
}
