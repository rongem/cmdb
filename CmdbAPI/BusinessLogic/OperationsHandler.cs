using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.BusinessLogic
{
    public static class OperationsHandler
    {
        public static OperationResult ConvertAttributeTypeToCIType(AttributeType attributeType, string newItemTypeName, string colorCode,
            ConnectionType connType, Position position, IEnumerable<AttributeType> attributeTypesToTransfer, WindowsIdentity identity)
        {
            try
            {
                StringBuilder result = new StringBuilder();
                List<ItemType> itemTypes = new List<ItemType>();
                itemTypes.AddRange(MetaDataHandler.GetItemTypesByAllowedAttributeType(attributeType.TypeId));

                bool newTypeIsUpperRule = position == Position.Above;

                ItemType itemType = GetOrCreateItemType(newItemTypeName, colorCode, result);
                CreateRules(connType, identity, result, itemTypes, newTypeIsUpperRule, itemType);

                return new OperationResult() { Success = true, Message = result.ToString() };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        private static void CreateRules(ConnectionType connType, WindowsIdentity identity, StringBuilder result, List<ItemType> itemTypes, bool newTypeIsUpperRule, ItemType itemType)
        {
            ItemType upperType, lowerType;

            foreach (ItemType myType in itemTypes)
            {
                upperType = newTypeIsUpperRule ? itemType : myType;
                lowerType = newTypeIsUpperRule ? myType : itemType;

                ConnectionRule cr = new ConnectionRule()
                {
                    RuleId = Guid.NewGuid(),
                    ConnType = connType.ConnTypeId,
                    ItemUpperType = upperType.TypeId,
                    ItemLowerType = lowerType.TypeId,
                    MaxConnectionsToLower = 9999,
                    MaxConnectionsToUpper = 9999
                };
                MetaDataHandler.CreateConnectionRule(cr, identity);
                result.AppendLine(string.Format("Verbindungsregel {0} {1} / {2} {3} angelegt.", upperType.TypeName,
                    connType.ConnTypeName, connType.ConnTypeReverseName, lowerType.TypeName));
            }
        }

        private static ItemType GetOrCreateItemType(string newItemTypeName, string colorCode, StringBuilder result)
        {
            ItemType itemType = MetaDataHandler.GetItemType(newItemTypeName);
            if (itemType == null)
            {
                itemType = new ItemType() { TypeId = Guid.NewGuid(), TypeName = newItemTypeName, TypeBackColor = colorCode };
                result.AppendLine(string.Format("Item-Typ {0} angelegt", newItemTypeName));
            }

            return itemType;
        }
    }
}
