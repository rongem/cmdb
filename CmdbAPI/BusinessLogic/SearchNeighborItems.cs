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
    /// Sucht benachbarte Items mit den angegebenen Suchkriterien
    /// </summary>
    public class SearchNeighborItems
    {
        public static IEnumerable<NeighborItem> Search(NeighborSearch search)
        {
            SearchNeighborItems sni = new SearchNeighborItems(search.SourceItem, search.ItemType);
            return sni.SearchForItems(search);
        }

        private Guid itemId;
        private Guid targetType;
        private ConfigurationItem originItem;
        private List<NeighborItem> result = new List<NeighborItem>();

        #region Konstruktoren

        /// <summary>
        /// Konstruktor
        /// <param name="startItemId">Guid des Items, ab dem die Suche begonnen wird</param>
        /// <param name="targetItemTypeId">Guid des ItemType, nach dem gesucht wird</param>
        /// </summary>
        private SearchNeighborItems(Guid startItemId, Guid targetItemTypeId)
        {
            targetType = targetItemTypeId;
            itemId = startItemId;
            originItem = DataHandler.GetConfigurationItem(itemId);
            if (originItem == null)
                throw new ArgumentException("Konnte das StartItem nicht finden.");
            if (MetaDataHandler.GetItemType(targetType) == null)
                throw new ArgumentException("Konnte den Zieltyp nicht finden.");
        }

        #endregion

        /// <summary>
        /// Sucht die angegebene Anzahl von Ebenen
        /// </summary>
        /// <param name="maxLevel"></param>
        /// <param name="search">Parameter für die Suche</param>
        public IEnumerable<NeighborItem> SearchForItems(NeighborSearch search)
        {
            NeighborItem startItem = new NeighborItem() { Item = originItem, Level = 0, Path = string.Empty };
            int minLevel = 1;
            if (search.MaxLevels < minLevel)
                search.MaxLevels = minLevel;

            switch (search.SearchDirection)
            {
                case Direction.Upward:
                    SearchUpward(startItem, minLevel, search.MaxLevels);
                    break;
                case Direction.Downward:
                    SearchDownward(startItem, minLevel, search.MaxLevels);
                    break;
                case Direction.Both:
                    SearchUpward(startItem, minLevel, search.MaxLevels);
                    SearchDownward(startItem, minLevel, search.MaxLevels);
                    break;
            }
            if (search.ExtraSearch == null || string.IsNullOrWhiteSpace(search.ExtraSearch.NameOrValue) && search.ExtraSearch.Attributes == null && string.IsNullOrWhiteSpace(search.ExtraSearch.ResponsibleToken) && search.ExtraSearch.ConnectionsToLower == null && search.ExtraSearch.ConnectionsToUpper == null)
                return result;
            search.ExtraSearch.ItemType = search.ItemType;
            List<Guid> itemIds = SearchItems.Search(search.ExtraSearch).Select(i => i.ConfigurationItem.ItemId).ToList();
            return result.Where(i => itemIds.Contains(i.Item.ItemId));
        }

        /// <summary>
        /// Durchläuft die Suche iterativ nach oben
        /// </summary>
        /// <param name="startItem">Item, ab dem gesucht wird</param>
        /// <param name="minLevel">Mindest-Anzahl von Suchebenen</param>
        /// <param name="maxLevel">Maximal-Anzahl von Suchebenen</param>
        private void SearchUpward(NeighborItem startItem, int minLevel, int maxLevel)
        {
            if (startItem.Level <= maxLevel && !(startItem.Level > 0 && startItem.Item.ItemId == originItem.ItemId)) // 
            {
                if (startItem.Level >= minLevel && startItem.Item.ItemType.Equals(targetType) && result.Where(a => a.Item.ItemId.Equals(startItem.Item.ItemId)).Count() == 0)
                {
                    result.Add(startItem);
                }
                foreach (Connection cr in DataHandler.GetConnectionsToUpperForItem(startItem.Item.ItemId))
                {
                    ConfigurationItem r = DataHandler.GetConfigurationItem(cr.ConnUpperItem);
                    NeighborItem nextItem = new NeighborItem() { Item = r, Level = startItem.Level + 1, Path = startItem.Path + "," + startItem.Item.ItemId.ToString() };
                    SearchUpward(nextItem, minLevel, maxLevel);
                }
            }
        }

        /// <summary>
        /// Durchläuft die Suche iterativ nach unten
        /// </summary>
        /// <param name="startItem">Item, ab dem gesucht wird</param>
        /// <param name="minLevel">Mindest-Anzahl von Suchebenen</param>
        /// <param name="maxLevel">Maximal-Anzahl von Suchebenen</param>
        private void SearchDownward(NeighborItem startItem, int minLevel, int maxLevel)
        {
            if (startItem.Level <= maxLevel && !(startItem.Level > 0 && startItem.Item.ItemId == originItem.ItemId)) //
            {
                if (startItem.Level >= minLevel && startItem.Item.ItemType.Equals(targetType) && result.Where(a => a.Item.ItemId.Equals(startItem.Item.ItemId)).Count() == 0)
                    result.Add(startItem);
                foreach (Connection cr in DataHandler.GetConnectionsToLowerForItem(startItem.Item.ItemId))
                {
                    ConfigurationItem r = DataHandler.GetConfigurationItem(cr.ConnLowerItem);
                    NeighborItem nextItem = new NeighborItem() { Item = r, Level = startItem.Level + 1, Path = startItem.Path + "," + startItem.Item.ItemId.ToString() };
                    SearchDownward(nextItem, minLevel, maxLevel);
                }
            }
        }

    }
}
