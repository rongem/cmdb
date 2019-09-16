using CmdbAPI.Security;
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

        /// <summary>
        /// Wandelt ein Security-User-Objekt in ein Item.Responsibility-Objekt um
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static Item.Responsibility GetItem_Responsibility(Security.ADSHelper.UserObject user)
        {
            return new Item.Responsibility()
            {
                name = user.displayname,
                account = user.NTAccount.Value,
                mail = user.mail,
                phone = user.telephonenumber,
                office = user.physicaldeliveryofficename,
            };
        }

        /// <summary>
        /// Wandelt ein User-Objekt in ein UserInfo-Objekt um, das im WebService zurückgegeben werden kann
        /// </summary>
        /// <param name="user">User-Objekt</param>
        /// <returns></returns>
        public static UserInfo GetUserInfo(ADSHelper.UserObject user)
        {
            return new UserInfo()
            {
                AccountName = user.NTAccount.Value,
                DisplayName = user.displayname,
                Mail = user.mail,
                Office = user.physicaldeliveryofficename,
                Phone = user.telephonenumber,
            };
        }
    }
}
