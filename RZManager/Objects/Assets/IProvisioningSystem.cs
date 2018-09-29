using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public interface IProvisioningSystem
    {
        AssetConnection ConnectionToServer { get; set; }
    }
}
