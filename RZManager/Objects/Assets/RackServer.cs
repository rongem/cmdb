﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public class RackServer : RackMountable, IProvisioningSystem
    {
        public Connection ConnectionToServer { get; set; }
    }
}
