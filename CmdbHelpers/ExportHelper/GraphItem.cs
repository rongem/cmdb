using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;

namespace CmdbHelpers.ExportHelper
{
    /// <summary>
    /// Klasse zur Darstellung von graphischen Items
    /// </summary>
    [Serializable]
    public class GraphItem
    {
        protected Guid ownId;
        protected int level;
        protected int backColorRGB;
        protected string backgroundColorHtml;
        protected string caption;
        protected GraphDirection myDirection;
        protected double top = double.NaN, left = double.NaN, width = double.NaN, height = double.NaN;
        protected List<GraphLine> connections = new List<GraphLine>();
        private bool hasFollowers;

        public bool HasFollowers
        {
            get { return hasFollowers; }
            set { hasFollowers = value; }
        }

        #region Eigenschaften

        /// <summary>
        /// Guid des ConfigurationItem-Datensatzes
        /// </summary>
        public Guid OwnId { get { return this.ownId; } }

        /// <summary>
        /// Ebene, auf der das Objekt dargestellt wird. 0 ist zentral, negative Zahlen oberhalb und positive Unterhalb des Zentrums
        /// </summary>
        public int Level { get { return this.level; } }

        /// <summary>
        /// Dargestellte Breite des Objekts
        /// </summary>
        public double Width { get { return this.width; } }

        /// <summary>
        /// Dargestellte Höhe des Objekts
        /// </summary>
        public double Height { get { return this.height; } set { this.height = value; } }

        /// <summary>
        /// Obere Begrenzung des Objekts
        /// </summary>
        public double Top { get { return this.top; } }

        /// <summary>
        /// Linke Begrenzung des Objekts
        /// </summary>
        public double Left { get { return this.left; } }

        /// <summary>
        /// Gibt die Beschriftung des Objekts zurück
        /// </summary>
        public string Caption { get { return this.caption; } }

        /// <summary>
        /// Gibt die Farbe als Integer für Powerpoint zurück
        /// </summary>
        public int ColorRGB { get { return this.backColorRGB; } }

        /// <summary>
        /// Gibt die Farbe als HTML-String zurück
        /// </summary>
        public string ColorHtml { get { return this.backgroundColorHtml; } }

        /// <summary>
        /// Richtung in der das Objekt vom Zentrum aus gesehen angelegt wurde
        /// </summary>
        public GraphDirection Direction { get { return this.myDirection; } }

        /// <summary>
        /// Alle Verbindungen zu anderen Objekten (Obsolet?)
        /// </summary>
        public IEnumerable<GraphLine> Connections { get { return this.connections; } }

        /// <summary>
        /// Alle Verbindungen zu Objekten oberhalb
        /// </summary>
        public IEnumerable<GraphLine> ConnectionsToUpper { get { return this.connections.Where(a => a.TargetObject.Equals(this)); } }

        /// <summary>
        /// Alle Verbindungen zu Objekten unterhalb
        /// </summary>
        public IEnumerable<GraphLine> ConnectionsToLower { get { return this.connections.Where(a => a.OriginObject.Equals(this)); } }

        #endregion

        /// <summary>
        /// Konstruktor. Erzeugt ein GraphObject, das einen Button mit dem Typ und Namen des CI anzeigt. Hier ist die Farbe der HTML-Code
        /// </summary>
        /// <param name="id">Guid des Datensatzes, für den das Item erzeugt wird</param>
        /// <param name="typeName">Name des Typs, für den das Item erzeugt wird</param>
        /// <param name="itemName">Name des Configuration Items, für den das Item erzeugt wird</param>
        /// <param name="backColor">Hintergrundfarbe für den Button</param>
        /// <param name="direction">Richtung, in der das Objekt erweitert wurde: Upward für Objekte oberhalb, Downward für Objekte unterhalb und Both für das zentrale Objekt</param>
        /// <param name="Level">Ebene, auf der das Objekt steht. Negativ für Objekte oberhalb, Positiv für Objekte unterhalb und 0 für das zentrale Objekt</param>
        /// <param name="canExpand">Gibt an, ob das Objekt in der angegebenen Richtung erweitert werden kann</param>
        public GraphItem(Guid id, string typeName, string itemName, string backColor, GraphDirection direction, int Level, bool canExpand)
        {
            this.caption = string.Format("{0}:\r\n{1}", typeName,itemName);
            this.backColorRGB = int.Parse(backColor.Substring(1), System.Globalization.NumberStyles.HexNumber);
            this.backgroundColorHtml = backColor;
            Size sz = StringHelper.MeasureString(this.Caption);
            this.height = sz.Height + 2 * GraphItem.Margin;
            this.width = sz.Width + 2 * GraphItem.Margin;
            this.ownId = id;
            this.hasFollowers = canExpand;
            this.level = Level;
            this.myDirection = direction;
        }

        /// <summary>
        /// Fügt dem Objekt eine Verbindung hinzu, und gibt die Position der Verbindung in der entsprechenden Collection (Oben oder Unten) zurück
        /// </summary>
        /// <param name="line">GraphLine-Objekt, das hinzugefügt wird</param>
        /// <returns>Int32</returns>
        public int AddConnection(GraphLine line)
        {
            int ret = line.OriginObject.Equals(this) ? this.ConnectionsToLower.Count() : this.ConnectionsToUpper.Count();
            this.connections.Add(line);
            return ret;
        }

        /// <summary>
        /// Legt die Position des Elements fest
        /// </summary>
        /// <param name="x">Abstand vom linken Rand</param>
        /// <param name="y">Abstand vom oberen Rand</param>
        public void SetPosition(double x, double y)
        {
            this.top = y;
            this.left = x;
        }

        /// <summary>
        /// Gibt die Standard-Breite des Rahmens um das Objekt zurück
        /// </summary>
        public static double Margin { get { return 10; } }
    }
}
