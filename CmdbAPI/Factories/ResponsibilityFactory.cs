using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.Factories
{
    /// <summary>
    /// Erzeugt ein ItemResponsibility-Objekt aus einer ResponsibilityRow
    /// </summary>
    public static class ResponsibilityFactory
    {
        public static ItemResponsibility CreateResponsibilityTransferObject(CMDBDataSet.ResponsibilityRow rr)
        {
            return new ItemResponsibility()
            {
                ItemId = rr.ItemId,
                ResponsibleToken = rr.ResponsibleToken,
            };
        }

        /// <summary>
        /// Gibt alle Verantwortlichkeiten aus der Datenbank zurück
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<ItemResponsibility> GetAllResponsibilites()
        {
            foreach (CMDBDataSet.ResponsibilityRow rr in DataAccess.Responsibility.SelectAll())
            {
                yield return CreateResponsibilityTransferObject(rr);
            }
        }
    }
}
