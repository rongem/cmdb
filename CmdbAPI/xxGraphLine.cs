using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;

namespace CmdbDataAccess
{
    /// <summary>
    /// Klasse zur Darstellung von Linien als Verbindung zwischen einzelnen Configuration Items
    /// </summary>
    [Serializable]
    public class GraphLine
    {
        private GraphObject originObject = null, targetObject = null;
        private string typeName;
        private double topY, topX, bottomY, bottomX;
        private int originPosition, targetPosition;
        private Guid ownId;

        #region Eigenschaften

        public string ConnectionTypeName { get { return this.typeName; } }

        public int OriginPosition { get { return this.originPosition; } }

        public int TargetPosition { get { return this.targetPosition; } }

        public GraphObject OriginObject { get { return this.originObject; } }

        public GraphObject TargetObject { get { return this.targetObject; } }

        public double TopY { get { return this.topY; } }

        public double TopX { get { return this.topX; } }

        public double BottomY { get { return this.bottomY; } }

        public double BottomX { get { return this.bottomX; } }

        public Guid OwnId { get { return this.ownId; } }

        #endregion

        /// <summary>
        /// Konstruktor. Erstellt eine Verbindung zwischen zwei Objekten und fügt sich selbst den Objekten hinzu
        /// </summary>
        /// <param name="origin">Ausgangs-Configuration Item (oberes Item)</param>
        /// <param name="target">Ziel-Configuration Item (unteres Item)</param>
        /// <param name="lineDescription">Beschreibung der Linie (wird als Tooltip angezeigt</param>
        public GraphLine(Guid connectionId, GraphObject origin, GraphObject target, string lineDescription)
        {
            this.ownId = connectionId;
            this.originObject = origin;
            this.targetObject = target;
            this.typeName = lineDescription;
            this.originPosition = this.originObject.AddConnection(this);
            this.targetPosition = this.targetObject.AddConnection(this);
        }

        /// <summary>
        /// Legt die Start- und Ende-Position der Polyline fest
        /// </summary>
        /// <param name="xStart">X-Koordinate des Startpunkts (Origin)</param>
        /// <param name="yStart">Y-Koordinate des Startpunkts (Origin)</param>
        /// <param name="xEnd">X-Koordinate des Endpunkts (Target)</param>
        /// <param name="yEnd">Y-Koordinate des Endpunkts (Target)</param>
        public void SetPosition(double xStart, double yStart, double xEnd, double yEnd)
        {
            this.topX = xStart;
            this.topY = yStart;
            this.bottomX = xEnd;
            this.bottomY = yEnd;
        }

        /// <summary>
        /// Fügt eine Polyline der Leinwand hinzu, die vom Ursprungs-Item zum Ziel-Item führt
        /// </summary>
        /// <param name="parent">Canvas, auf der gezeichnet wird</param>
        public void AddToCanvas(Canvas parent)
        {
            Polyline pl = new Polyline();
            pl.Points.Add(new System.Windows.Point(this.topX, this.topY));
            pl.Points.Add(new System.Windows.Point(this.topX, this.topY + Math.Abs(this.topY - this.bottomY) / 2 - 1.5 * GraphObjectWpf.Margin));
            pl.Points.Add(new System.Windows.Point(this.bottomX, this.topY + Math.Abs(this.topY - this.bottomY) / 2 + 1.5 * GraphObjectWpf.Margin));
            pl.Points.Add(new System.Windows.Point(this.bottomX, this.bottomY));
            pl.StrokeThickness = 1;
            pl.Stroke = Brushes.Black;
            pl.StrokeEndLineCap = PenLineCap.Triangle;
            pl.StrokeLineJoin = PenLineJoin.Bevel;
            parent.Children.Add(pl);
            // Unsichtbare dickere Linie zeichnen, um das Tooltip leichter sichtbar zu machen
            pl = (Polyline)WpfHelper.CloneUIElement(pl);
            pl.StrokeThickness = 4;
            pl.Stroke = Brushes.Transparent;
            pl.ToolTip = this.typeName;
            parent.Children.Add(pl);
        }
    }
}
