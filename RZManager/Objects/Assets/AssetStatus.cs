using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public enum AssetStatus
    {
        InProduction,
        Reserved,
        Free,
        Stored,
        PendingScrap,
        SwitchedOff,
        Scrap,
        Unknown,
    }
}
