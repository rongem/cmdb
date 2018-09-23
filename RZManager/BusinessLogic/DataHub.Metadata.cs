using assystConnector.Objects;
using RZManager.Objects;
using RZManager.Objects.Assets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.BusinessLogic
{
    public partial class DataHub
    {
        /// <summary>
        /// Erzeugt ein neues Produkt
        /// </summary>
        /// <param name="productClassId">Id der Produktklasse</param>
        /// <param name="manufacturerId">Id des Herstellers</param>
        /// <param name="productName">Name des neuen Produkts</param>
        /// <param name="stackingfactor">Anzahl der Höheneinheiten, die das Produkt im Rack benötigt</param>
        /// <param name="notes">Zusätzliche Bemerkungen</param>
        /// <returns></returns>
        public Product CreateProduct(int productClassId, int manufacturerId, string productName, int stackingfactor, string notes)
        {
            Product p = dataWrapper.CreateProduct(productClassId, manufacturerId, productName, 1, stackingfactor, notes);
            if (p != null)
                OnDataChanged();
            return p;
        }

        /// <summary>
        /// Gibt die Liste der Hersteller und Lieferanten zurück
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Supplier> GetSuppliers()
        {
            return suppliers;
        }

        /// <summary>
        /// Gibt die Liste der vorhandenen Status-Ids und Namen zurück
        /// </summary>
        /// <returns></returns>
        private Dictionary<string, int> GetItemStatuses(out Dictionary<int, string> statusValues)
        {
            Dictionary<string, int> itemStatuses = new Dictionary<string, int>();

            statusValues = new Dictionary<int, string>();

            foreach (ItemStatus st in dataWrapper.GetItemStatuses())
            {
                itemStatuses.Add(st.name.ToLower(), st.id);
                statusValues.Add(st.id, st.name.ToLower());
            }

            return itemStatuses;
        }

        /// <summary>
        /// Liefert alle Abteilungen zurück, deren Namen mit dem angegebenen String beginnt
        /// </summary>
        /// <param name="start">Anfang des Namens, nach dem gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<Department> GetDepartsmentsByNameStartsWith(string start)
        {
            return dataWrapper.GetDepartmentByNameStartsWith(start).OrderBy(d => d.name);
        }

        /// <summary>
        /// Liefert alle Produktklassen zurück
        /// </summary>
        /// <returns></returns>
        public IEnumerable<ProductClass> GetProductClasses()
        {
            return productClasses;
        }

        /// <summary>
        /// Liefert alle Produktklassen zurück
        /// </summary>
        /// <returns></returns>
        public IEnumerable<ProductClass> GetHardwareProductClasses()
        {
            return productClasses.Where(x => DataCenterHardwareProductClasses.Contains(x.name));
        }

        /// <summary>
        /// Gibt die ID zum Namen des Status zurück
        /// </summary>
        /// <param name="statusName">Name des gesuchten Status</param>
        /// <returns></returns>
        public int GetStatusId(string statusName)
        {
            statusName = statusName.ToLower();
            if (!itemStatusValues.ContainsKey(statusName))
                return -1;
            return itemStatusValues[statusName];
        }

        /// <summary>
        /// LIefert eine Produktklasse mit der angegebenen Id zurück
        /// </summary>
        /// <param name="productClassId">Id der gesuchten Produktklasse</param>
        /// <returns></returns>
        public IEnumerable<Product> GetProductsForProductClass(int productClassId)
        {
            return dataWrapper.GetProductsByProductClass(productClassId);
        }

        /// <summary>
        /// Liefert alle generischen Klassen zurück, die nicht der Rechenzentrumsklasse entsprechen
        /// </summary>
        /// <returns></returns>
        public IEnumerable<GenericClass> GetGenericClasses()
        {
            return dataWrapper.GetGenericClasses().Where(gc => !gc.name.Equals(s.DataCenterGenericClassName, StringComparison.CurrentCultureIgnoreCase));
        }

        /// <summary>
        /// Liefert alle Produktklassen zu einer generischen Klasse zurück
        /// </summary>
        /// <param name="genericClassId">Id der generischen Klasse</param>
        /// <returns></returns>
        public IEnumerable<ProductClass> GetProductClasses(int genericClassId)
        {
            return dataWrapper.GetProductClassesByGenericClass(genericClassId);
        }

        /// <summary>
        /// Liefert alle Produkte zu einer Produktklasse zurück
        /// </summary>
        /// <param name="productClassId">Id der Produktklasse</param>
        /// <returns></returns>
        public IEnumerable<Product> GetProducts(int productClassId)
        {
            return dataWrapper.GetProductsByProductClass(productClassId);
        }

        /// <summary>
        /// Liefert alle Items zurück, die einem bestimmten Produkt zuzuordnen sind
        /// </summary>
        /// <param name="pc">Produktklasse des Produkts</param>
        /// <param name="p">Produkt, nach dem gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<GenericRackMountable> GetItems(ProductClass pc, Product p)
        {
            if (p.productClassId != pc.id)
                throw new ArgumentException("Die Produktklassen-Id des Produkts stimmt nicht mit der Id der Produktklasse überein.");
            foreach (Item item in dataWrapper.GetItemsByProduct(p.id))
            {
                yield return DataCenterFactory.CreateGenericRackMountable(item, pc.name, p.name);
            }
        }

    }
}
