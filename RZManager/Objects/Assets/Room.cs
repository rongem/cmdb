﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public class Room : NamedObject
    {
        public Guid id { get; set; }
        public string Name { get; set; }
        public string BuildingName { get; set; }
    }
}
