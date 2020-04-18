using CmdbAPI.BusinessLogic;
using CmdbAPI.DataAccess;
using CmdbAPI.DataObjects;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CmdbAPI.Factories
{
    /// <summary>
    /// Erzeugt ConfigurationItems
    /// </summary>
    public static class ConfigurationItemFactory
    {
        /// <summary>
        /// Wandelt eine Datenzeile mit einem Configuration Item in ein Objekt um
        /// </summary>
        /// <param name="r">Datensatz mit Configuration Item</param>
        /// <returns></returns>
        public static ConfigurationItem GetConfigurationItem(CMDBDataSet.ConfigurationItemsRow r)
        {
            return new ConfigurationItem()
            {
                ItemId = r.ItemId,
                ItemName = r.ItemName,
                ItemType = r.ItemType,
                ItemLastChange = r.ItemLastChange.Ticks - Constants.ticksDifference,
                ItemVersion = r.ItemVersion,
                TypeName = r.TypeName,
            };
        }

        /// <summary>
        /// Gibt eine Liste aller in der Datenbank enthaltenen Configuration Items zurück
        /// </summary>
        /// <param name="withConnections">Gibt an, ob die Verbindungen zwischen Objekten hinzugefügt werden sollen</param>
        /// <param name="withResponsibilities">Gibt an, ob die Liste der Benutzernamen hinzugefügt werden soll</param>
        /// <returns>List</returns>
        public static IEnumerable<ConfigurationItemExtender> GetAllItems(bool withConnections, bool withResponsibilities)
        {
            //Timer tmr = new Timer();
            //tmr.Start();

            List<ConfigurationItemExtender> items = new List<ConfigurationItemExtender>();
            CMDBDataSet.ResponsibilityDataTable rt = null;
            if (withResponsibilities)
                rt = Responsibility.SelectAll();
            foreach (CMDBDataSet.ConfigurationItemsRow r in ConfigurationItems.SelectAll().Rows)
            {
                ConfigurationItemExtender item = new ConfigurationItemExtender(r);
                if (withResponsibilities)
                {
                    item.ConfigurationItem.ResponsibleUsers = rt.Where(r1 => r1.ItemId.Equals(item.ConfigurationItem.ItemId)).Select(r2 => r2.ResponsibleToken).ToArray();
                }
                items.Add(item);
            }
            if (withConnections)
            {
                foreach (CMDBDataSet.ConnectionsRow cr in Connections.SelectAll())
                {
                    ConnectionExtender conn = new ConnectionExtender(cr);
                    ConfigurationItemExtender upperItem = items.Single(i => i.ConfigurationItem.ItemId.Equals(cr.ConnUpperItem));
                    conn.ConnectedUpperItem = upperItem.ConfigurationItem;
                    ConfigurationItemExtender lowerItem = items.Single(i => i.ConfigurationItem.ItemId.Equals(cr.ConnLowerItem));
                    conn.ConnectedLowerItem = lowerItem.ConfigurationItem;
                    upperItem.Connections.Add(conn);
                    lowerItem.Connections.Add(conn);
                }
            }
            //System.Diagnostics.Debug.WriteLine(tmr.Stop());
            return items;
        }

        /// <summary>
        /// Gibt eine Liste aller in der Datenbank enthaltenen Configuration Items zurück
        /// </summary>
        /// <param name="itemTypes">Gibt die GUIDs der ItemTypes an, auf den die Suche beschränkt wird</param>
        /// <param name="withConnections">Gibt an, ob die Verbindungen zwischen Objekten hinzugefügt werden sollen</param>
        /// <param name="withResponsibilities">Gibt an, ob die Liste der Benutzernamen hinzugefügt werden soll</param>
        /// <returns>List</returns>
        public static IEnumerable<ConfigurationItemExtender> GetItemsOfTypes(IEnumerable<Guid> itemTypes, bool withConnections, bool withResponsibilities)
        {
            List<ConfigurationItemExtender> items = new List<ConfigurationItemExtender>();
            foreach (CMDBDataSet.ConfigurationItemsRow r in ConfigurationItems.SelectAll().Rows)
            {
                if (itemTypes.Contains(r.ItemType)) // Nur Items erzeugen, die den geforderten Typen entsprechen
                {
                    ConfigurationItemExtender item = new ConfigurationItemExtender(r);
                    if (withResponsibilities)
                    {
                        item.ConfigurationItem.ResponsibleUsers = GetResponsibleUserArray(item.ConfigurationItem.ItemId);
                    }
                    items.Add(item);
                }
            }
            if (withConnections)
            {
                foreach (CMDBDataSet.ConnectionsRow cr in Connections.SelectAll())
                {
                    if (items.Where(i => i.ConfigurationItem.ItemId.Equals(cr.ConnUpperItem)).Count() != 1 || items.Where(i => i.ConfigurationItem.ItemId.Equals(cr.ConnLowerItem)).Count() != 1)
                        continue; // Nur aufnehmen, falls beide Items vorhanden sind
                    ConfigurationItemExtender upperItem = items.Single(i => i.ConfigurationItem.ItemId.Equals(cr.ConnUpperItem));
                    ConfigurationItemExtender lowerItem = items.Single(i => i.ConfigurationItem.ItemId.Equals(cr.ConnLowerItem));
                    ConnectionExtender conn = new ConnectionExtender(cr);
                    conn.ConnectedUpperItem = upperItem.ConfigurationItem;
                    conn.ConnectedLowerItem = lowerItem.ConfigurationItem;
                    upperItem.Connections.Add(conn);
                    lowerItem.Connections.Add(conn);
                }
            }
            return items;

        }
        /// <summary>
        /// Gibt eine Liste aller in der Datenbank enthaltenen Configuration Items zurück
        /// </summary>
        /// <param name="itemTypes">Gibt den Namen der ItemTypes an, auf den die Suche beschränkt wird</param>
        /// <param name="withConnections">Gibt an, ob die Verbindungen zwischen Objekten hinzugefügt werden sollen</param>
        /// <param name="withResponsibilities">Gibt an, ob die Liste der Benutzernamen hinzugefügt werden soll</param>
        /// <returns>List</returns>
        public static IEnumerable<ConfigurationItemExtender> GetItemsOfTypes(IEnumerable<string> itemTypes, bool withConnections, bool withResponsibilities)
        {
            List<Guid> itemTypeIds = new List<Guid>(itemTypes.Count());
            foreach (string itemTypeName in itemTypes)
            {
                try
                {
                    itemTypeIds.Add(ItemTypes.SelectByName(itemTypeName).TypeId);
                }
                catch { }
            }
            return GetItemsOfTypes(itemTypeIds, withConnections, withResponsibilities);

        }

        /// <summary>
        /// Gibt ein einzelnes Item zurück, wahlweise mit weiteren Daten
        /// </summary>
        /// <param name="itemId">GUID des gewünschten Items. Gibt Null zurück, falls die GUID nicht in der Datenbank ist</param>
        /// <param name="withConnections">Gibt an, ob die Verbindungen zu anderen Items hinzugefügt werden sollen</param>
        /// <param name="withResponsibilities">Gibt an, ob die Liste der Benutzernamen hinzugefügt werden soll</param>
        /// <returns></returns>
        public static ConfigurationItemExtender GetSingleItem(Guid itemId, bool withConnections, bool withResponsibilities)
        {
            CMDBDataSet.ConfigurationItemsRow r = ConfigurationItems.SelectOne(itemId);
            if (r == null)
                return null;

            ConfigurationItemExtender item = new ConfigurationItemExtender(r);
            if (withResponsibilities)
            {
                item.ConfigurationItem.ResponsibleUsers = GetResponsibleUserArray(item.ConfigurationItem.ItemId);
            }
            if (withConnections)
            {
                foreach (CMDBDataSet.ConnectionsRow cr in Connections.SelectConnectionsToLowerForItemId(itemId))
                {
                    ConfigurationItemExtender lowerItem = ConfigurationItemFactory.GetSingleItem(cr.ConnLowerItem, false, false);
                    ConnectionExtender conn = new ConnectionExtender(cr) { ConnectedUpperItem = item.ConfigurationItem, ConnectedLowerItem = lowerItem.ConfigurationItem };
                    item.Connections.Add(conn);
                    //lowerItem.Connections.Add(conn);
                }
                foreach (CMDBDataSet.ConnectionsRow cr in Connections.SelectConnectionsToUpperForItemId(itemId))
                {
                    ConfigurationItemExtender upperItem = ConfigurationItemFactory.GetSingleItem(cr.ConnUpperItem, false, false);
                    ConnectionExtender conn = new ConnectionExtender(cr) { ConnectedUpperItem = upperItem.ConfigurationItem, ConnectedLowerItem = item.ConfigurationItem };
                    item.Connections.Add(conn);
                    //upperItem.Connections.Add(conn);
                }
            }
            return item;
        }

        /// <summary>
        /// Liest die verantwortlichen Benutzer zu einem Item aus und gibt sie als String zurück
        /// </summary>
        /// <param name="itemId"></param>
        /// <returns></returns>
        private static string[] GetResponsibleUserArray(Guid itemId)
        {
            return Responsibility.SelectForItem(itemId).Select(a => a.ResponsibleToken).ToArray();
        }

        /// <summary>
        /// Erzeugt ein History-Item aus einem Datensatz
        /// </summary>
        /// <param name="cir">Configuration-Item-Row</param>
        /// <returns></returns>
        public static HistoricConfigurationItem.HistoricItem CreateHistoricItem(CMDBDataSet.ConfigurationItemsHistoryRow cir)
        {
            return new HistoricConfigurationItem.HistoricItem()
            {
                TypeId = cir.ItemType,
                TypeName = cir.ItemTypeName,
                NewName = cir.ItemNewName,
                OldName = cir.ItemOldName,
                ChangeDate = cir.ItemChange.Ticks - Constants.ticksDifference,
                ChangedByToken = cir.ChangedByToken,
            };
        }

        /// <summary>
        /// Erzeugt ein History-Attribut aus einem Datensatz
        /// </summary>
        /// <param name="iahr">ItemAttribute-History-Row</param>
        /// <returns></returns>
        public static HistoricConfigurationItem.HistoricAttribute CreateHistoricAttribute(CMDBDataSet.ItemAttributesHistoryRow iahr) 
        {
            return new HistoricConfigurationItem.HistoricAttribute()
            {
                Id = iahr.AttributeId,
                ItemId = iahr.ItemId,
                TypeId = iahr.AttributeTypeId,
                TypeName = iahr.AttributeTypeName,
                OldValue = iahr.AttributeOldValue,
                NewValue = iahr.AttributeNewValue,
                ChangeDate = iahr.AttributeChange.Ticks - Constants.ticksDifference,
                ChangedByToken = iahr.ChangedByToken,
            };
        }

        /// <summary>
        /// Erzeugt eine History-Verbindung aus einem Datensatz
        /// </summary>
        /// <param name="itemId">Item-Id</param>
        /// <param name="chr">Connections-History-Row</param>
        /// <returns></returns>
        public static HistoricConfigurationItem.HistoricConnection CreateHistoricConnection(Guid itemId, CMDBDataSet.ConnectionsHistoryRow chr)
        {
            return new HistoricConfigurationItem.HistoricConnection()
            {
                Id = chr.ConnId,
                TypeId = chr.ConnType,
                TypeName = chr.ConnTypeName,
                RuleId = chr.ConnectionRuleId,
                Description = chr.ConnDescription,
                TargetItemId = chr.ConnUpperItem.Equals(itemId) ? chr.ConnLowerItem : chr.ConnLowerItem.Equals(itemId) ? chr.ConnUpperItem : Guid.Empty,
                ChangeDate = chr.ConnChange.Ticks - Constants.ticksDifference,
                ChangedByToken = chr.ChangedByToken,
            };
        }

    }
}