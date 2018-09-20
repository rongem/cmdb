using RZManager.Objects.Assets;

namespace RZManager.Objects
{
    public class BlockedUnit
    {
        public Rack Rack { get; set; }
        public BladeEnclosure Enclosure { get; set; }
        public int Unit { get; set; }
        public string Reason { get; set; }
        public string ForegroundColor { get; set; }
    }
}
