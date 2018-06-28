using System.Windows;
using System.Windows.Media;

namespace CmdbHelpers.ExportHelper
{
    /// <summary>
    /// Hilfsfunktionen zur Berechnung der grafischen Darstellung von Text
    /// </summary>
    public static class StringHelper
    {
        /// <summary>
        /// Berechnet den Size (Höhe und Breite) eines gegebenen Textes in der angegebenen Schriftausprägung
        /// </summary>
        /// <param name="candidate">Textkandidat zum prüfen</param>
        /// <param name="fontFamily">FontFamily</param>
        /// <param name="emSize">Größe in em</param>
        /// <param name="fontStyle">Italic oder nicht</param>
        /// <param name="fontWeight">Fett oder nicht</param>
        /// <param name="fontStretch">Streckungsgrad</param>
        /// <returns>Size</returns>
        public static Size MeasureString(string candidate, FontFamily fontFamily, double emSize, FontStyle fontStyle, FontWeight fontWeight, FontStretch fontStretch)
        {
            FormattedText formattedText = new FormattedText(
                candidate,
                System.Globalization.CultureInfo.CurrentUICulture,
                FlowDirection.LeftToRight,
                new Typeface(fontFamily, fontStyle, fontWeight, fontStretch),
                emSize,
                Brushes.Black);
            formattedText.MaxTextWidth = 200;

            return new Size(formattedText.Width, formattedText.Height);
        }

        /// <summary>
        /// Berechnet den Size (Höhe und Breite) eines gegebenen Textes in Arial, Century Gothic, Sans Serif 12
        /// </summary>
        /// <param name="candidate">Textkandidat zum prüfen</param>
        /// <returns></returns>
        public static Size MeasureString(string candidate)
        {
            return MeasureString(candidate, new FontFamily("Arial, Century Gothic, Sans Serif"), 12, FontStyles.Normal, FontWeights.Normal, FontStretches.Normal);
        }

    }
}
