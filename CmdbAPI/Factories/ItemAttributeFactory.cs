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
    /// Erzeugt ItemAttributes
    /// </summary>
    public static class ItemAttributeFactory
    {
        /// <summary>
        /// Gibt alle existierenden ItemAttributes zurück
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<ItemAttribute> GetAllAttributes()
        {
            List<ItemAttribute> attributes = new List<ItemAttribute>();
            attributes.AddRange(ItemAttributes.SelectAll().Select(a => GetAttributeTransferObject(a)));
            return attributes;
        }

        /// <summary>
        /// Gibt alle Attribute zurück, die zu einem bestimmten Configuration Item gehören
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <returns></returns>
        public static IEnumerable<ItemAttribute> GetAttributesForItem(Guid itemId)
        {
            List<ItemAttribute> attributes = new List<ItemAttribute>();
            attributes.AddRange(ItemAttributes.SelectForItem(itemId).Select(a => GetAttributeTransferObject(a)));
            return attributes;
        }

        public static ItemAttribute GetAttributeTransferObject(CMDBDataSet.ItemAttributesRow iar)
        {
            return new ItemAttribute()
            {
                AttributeId = iar.AttributeId,
                ItemId = iar.ItemId,
                AttributeTypeId = iar.AttributeTypeId,
                AttributeTypeName = iar.AttributeTypeName,
                AttributeValue = iar.AttributeValue,
                AttributeLastChange = iar.AttributeLastChange.Ticks - Constants.ticksDifference,
                AttributeVersion = iar.AttributeVersion
            };
        }
    }
}
