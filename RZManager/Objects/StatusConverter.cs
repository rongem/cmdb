using RZManager.Objects.Assets;
using System.Windows.Media;

namespace RZManager.Objects
{
    public static class StatusConverter
    {
        /// <summary>
        /// Wandelt einen Text in einen Status um
        /// </summary>
        /// <param name="text">Text</param>
        /// <returns></returns>
        public static AssetStatus GetStatusFromText(string text)
        {
            if (string.IsNullOrEmpty(text))
                return AssetStatus.Unknown;
            switch (text.ToLower())
            {
                case "in betrieb":
                    return AssetStatus.InProduction;
                case "reserviert":
                    return AssetStatus.Reserved;
                case "frei":
                    return AssetStatus.Free;
                case "im dezentralen lager":
                    return AssetStatus.Stored;
                case "zur aussonderung vorzubereiten":
                    return AssetStatus.PendingScrap;
                case "inaktiv":
                    return AssetStatus.SwitchedOff;
                case "ausgesondert":
                    return AssetStatus.Scrap;
                default:
                    if (text.ToLower().StartsWith("reserviert"))
                        return AssetStatus.Reserved;
                    if (text.ToLower().Contains("lager"))
                        return AssetStatus.Stored;
                    return AssetStatus.Unknown;
            }
        }

        /// <summary>
        /// Gibt den Status als Klartext zurück
        /// </summary>
        /// <param name="status">AssetStatus</param>
        /// <returns></returns>
        public static string GetTextForStatus(AssetStatus status)
        {
            switch (status)
            {
                case AssetStatus.InProduction:
                    return "In Betrieb";
                case AssetStatus.Reserved:
                    return "Reserviert";
                case AssetStatus.Free:
                    return "Frei";
                case AssetStatus.Stored:
                    return "Im Dezentralen Lager";
                case AssetStatus.PendingScrap:
                    return "Zur Aussonderung vorzubereiten";
                case AssetStatus.SwitchedOff:
                    return "Inaktiv";
                case AssetStatus.Scrap:
                    return "Ausgesondert";
                default:
                    return string.Empty;
            }
        }

        /// <summary>
        /// Gibt einen Farbpinsel zum Status zurück
        /// </summary>
        /// <param name="status">Status, für den die Farbe ermittelt wird</param>
        /// <returns></returns>
        public static Brush GetBrushForStatus(AssetStatus status)
        {
            switch (status)
            {
                case AssetStatus.InProduction:
                    return new LinearGradientBrush(Colors.PaleGreen, Colors.DarkSeaGreen, 90);
                case AssetStatus.Reserved:
                    return new LinearGradientBrush(Colors.LightYellow, Colors.Yellow, 90);
                case AssetStatus.Free:
                    return new LinearGradientBrush(Colors.CornflowerBlue, Colors.AliceBlue, 90);
                case AssetStatus.PendingScrap:
                case AssetStatus.SwitchedOff:
                    return new LinearGradientBrush(Colors.IndianRed, Colors.Red, 90);
                default:
                    return new LinearGradientBrush(Colors.Red, Colors.MediumVioletRed, 90);
            }
        }
    }
}
