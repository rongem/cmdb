using CmdbAPI.TransferObjects;
using CmdbAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.Factories
{
    public static class ConnectionRuleFactory
    {
        public static ConnectionRule GetConnectionRuleTransferObject(CMDBDataSet.ConnectionRulesRow crr)
        {
            return new ConnectionRule()
            {
                RuleId = crr.RuleId,
                ConnType = crr.ConnType,
                ItemLowerType = crr.ItemLowerType,
                ItemUpperType = crr.ItemUpperType,
                MaxConnectionsToLower = crr.MaxConnectionsToLower,
                MaxConnectionsToUpper = crr.MaxConnectionsToUpper
            };
        }
    }
}
