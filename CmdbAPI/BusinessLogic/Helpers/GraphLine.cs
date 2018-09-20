using System;

namespace CmdbAPI.BusinessLogic.Helpers
{
    /// <summary>
    /// Klasse zur Darstellung von Linien als Verbindung zwischen einzelnen Configuration Items
    /// </summary>
    [Serializable]
    public class GraphLine
    {
        private GraphItem originObject = null, targetObject = null;
        private string typeName;
        private double topY, topX, bottomY, bottomX;
        private int originPosition, targetPosition;
        private Guid ownId;

        #region Eigenschaften

        public string ConnectionTypeName { get { return this.typeName; } }

        public int OriginPosition { get { return this.originPosition; } }

        public int TargetPosition { get { return this.targetPosition; } }

        public GraphItem OriginObject { get { return this.originObject; } }

        public GraphItem TargetObject { get { return this.targetObject; } }

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
        public GraphLine(Guid connectionId, GraphItem origin, GraphItem target, string lineDescription)
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

    }
}
