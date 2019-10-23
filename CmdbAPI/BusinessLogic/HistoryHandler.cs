using CmdbAPI.DataAccess;
using CmdbAPI.DataObjects;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.BusinessLogic
{
    /// <summary>
    /// Enthält alle Methoden zur Rückgabe von aufgezeichneten Aktionen an Items
    /// </summary>
    public static class HistoryHandler
    {
        public static IEnumerable<HistoryEntry> GetHistoryEntriesForItem(Guid itemId)
        {
            List<HistoryEntry> entries = new List<HistoryEntry>(History.GetItemChanges(itemId));
            entries.AddRange(History.GetAttributeChanges(itemId));
            entries.AddRange(History.GetConnectionChanges(itemId));
            return entries.OrderBy(e => e.DateTime);
        }

        public static HistoricConfigurationItem GetHistoricConfigurationItem(Guid itemId)
        {
            ConfigurationItem ci = DataHandler.GetConfigurationItem(itemId);
            HistoricConfigurationItem item = new HistoricConfigurationItem()
            {
                Id = itemId,
                activeItem = ci,
                activeItemPresent = ci != null,
                CurrentTypeName = (ci != null) ? ci.TypeName : string.Empty,
            };
            return item;
        }
    }
}
