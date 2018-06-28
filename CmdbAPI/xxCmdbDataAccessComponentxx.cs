using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbDataAccess
{
    /// <summary>
    /// Diese Klasse übernimmt den gesamten Zugriff auf die Datenbank und stellt neben den Methoden auch den DataSet bereit
    /// </summary>
    public class CmdbDataAccessComponent
    {
        // Feld, das das Dataset-Objekt mit allen Tabellen enthält
        private CMDBDataSet ds;

        // Privates Objekt für Singleton-Instanz
        private static CmdbDataAccessComponent da;

        #region TableAdapters
        // Alle TableAdapter für die Tabellen
        private CMDBDataSetTableAdapters.AttributeTypesTableAdapter attributeTypesTableAdapter = new CMDBDataSetTableAdapters.AttributeTypesTableAdapter();
        private CMDBDataSetTableAdapters.TableAdapterManager tableAdapterManager = new CMDBDataSetTableAdapters.TableAdapterManager();
        private CMDBDataSetTableAdapters.ItemTypesTableAdapter itemTypesTableAdapter = new CMDBDataSetTableAdapters.ItemTypesTableAdapter();
        private CMDBDataSetTableAdapters.ConnectionTypesTableAdapter connectionTypesTableAdapter = new CMDBDataSetTableAdapters.ConnectionTypesTableAdapter();
        private CMDBDataSetTableAdapters.AttributeGroupsTableAdapter attributeGroupsTableAdapter = new CMDBDataSetTableAdapters.AttributeGroupsTableAdapter();
        private CMDBDataSetTableAdapters.ConnectionRulesTableAdapter connectionRulesTableAdapter = new CMDBDataSetTableAdapters.ConnectionRulesTableAdapter();
        private CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter configurationItemsTableAdapter = new CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter();
        private CMDBDataSetTableAdapters.ConnectionsTableAdapter connectionsTableAdapter = new CMDBDataSetTableAdapters.ConnectionsTableAdapter();
        private CMDBDataSetTableAdapters.GroupAttributesTableAdapter groupAttributesTableAdapter = new CMDBDataSetTableAdapters.GroupAttributesTableAdapter();
        private CMDBDataSetTableAdapters.ItemAttributeGroupsTableAdapter itemAttributeGroupsTableAdapter = new CMDBDataSetTableAdapters.ItemAttributeGroupsTableAdapter();
        private CMDBDataSetTableAdapters.ItemAttributesTableAdapter itemAttributesTableAdapter = new CMDBDataSetTableAdapters.ItemAttributesTableAdapter();
        private CMDBDataSetTableAdapters.ItemLinksTableAdapter itemLinksTableAdapter = new CMDBDataSetTableAdapters.ItemLinksTableAdapter();
        private CMDBDataSetTableAdapters.ResponsibilityTableAdapter responsibilityTableAdapter = new CMDBDataSetTableAdapters.ResponsibilityTableAdapter();
        private CMDBDataSetTableAdapters.View_ConnectionRulesCleartextTableAdapter view_ConnectionRulesTableAdapter = new CMDBDataSetTableAdapters.View_ConnectionRulesCleartextTableAdapter();
        private CMDBDataSetTableAdapters.QueriesTableAdapter queriesTableAdapter = new CMDBDataSetTableAdapters.QueriesTableAdapter();
        #endregion

        /// <summary>
        /// Privater Konstruktor für Singleton-Zugriff
        /// </summary>
        private CmdbDataAccessComponent() {}

        /// <summary>
        /// Instanziierung des Singletons
        /// </summary>
        /// <returns></returns>
        public static CmdbDataAccessComponent GetInstance()
        {
            // Falls noch nicht angelegt, Singleton-Instanz erzeugen
            if (da == null)
                da = new CmdbDataAccessComponent();

            // Singleton-Instanz zurückgeben
            return da;
        }

        /// <summary>
        /// Gibt den DataSet zum Zugriff auf die Tabellen zurück. Falls noch nicht angelegt, wird er zuvor erzeugt und gefüllt.
        /// </summary>
        public CMDBDataSet Dataset
        {
            get
            {
                if (this.ds == null)
                {
                    this.ds = new CMDBDataSet();
                    this.fillDataSet();
                }
                return this.ds;
            }
        }

        /// <summary>
        /// Füllt alle Tabellen im Dataset
        /// </summary>
        private void fillDataSet()
        {
            this.attributeGroupsTableAdapter.Fill(this.ds.AttributeGroups);
            this.attributeTypesTableAdapter.Fill(this.ds.AttributeTypes);
            this.configurationItemsTableAdapter.Fill(this.ds.ConfigurationItems);
            this.connectionsTableAdapter.Fill(this.ds.Connections);
            this.connectionRulesTableAdapter.Fill(this.ds.ConnectionRules);
            this.connectionTypesTableAdapter.Fill(this.ds.ConnectionTypes);
            this.groupAttributesTableAdapter.Fill(this.ds.GroupAttributes);
            this.itemAttributeGroupsTableAdapter.Fill(this.ds.ItemAttributeGroups);
            this.itemAttributesTableAdapter.Fill(this.ds.ItemAttributes);
            this.itemLinksTableAdapter.Fill(this.ds.ItemLinks);
            this.itemTypesTableAdapter.Fill(this.ds.ItemTypes);
            this.responsibilityTableAdapter.Fill(this.ds.Responsibility);
        }

        #region AttributeTypes
        /// <summary>
        /// Speichert einen neuen AttributeType-Datensatz
        /// </summary>
        /// <param name="id">ID des Datensatzes</param>
        /// <param name="name">Name</param>
        public void AttributeTypesRow_Insert(Guid id, string name)
        {
            this.attributeTypesTableAdapter.Insert(id, name);
            this.attributeTypesTableAdapter.Fill(this.Dataset.AttributeTypes);
        }

        /// <summary>
        /// Speichert einen aktualisierten AttributeType-Datensatz in die Datenbank
        /// </summary>
        /// <param name="r">Veränderter Datensatz</param>
        public void AttributeTypesRow_Update(CMDBDataSet.AttributeTypesRow r)
        {
            if (r == null)
                throw new Exception("Kein Datensatz angegeben");
            this.attributeTypesTableAdapter.Update(r);
            this.attributeTypesTableAdapter.Fill(this.Dataset.AttributeTypes);
        }

        /// <summary>
        /// Löscht einen vorhandenen AttributeType-Datensatz
        /// </summary>
        /// <param name="id">ID des Datensatzes</param>
        /// <param name="name">Name des Datensatzes</param>
        public void AttributeTypesRow_Delete(Guid id, string name)
        {
            this.attributeTypesTableAdapter.Delete(id, name);
            this.attributeTypesTableAdapter.Fill(this.Dataset.AttributeTypes);
        }

        /// <summary>
        /// Gibt eine Tabelle mit allen zu einer Gruppe gehörigen AttributeTypes zurück
        /// </summary>
        /// <param name="groupId">GUID der Gruppe, nach der gesucht wird</param>
        public CMDBDataSet.AttributeTypesDataTable getGroupAttributeTypes(Guid groupId)
        {
            return this.attributeTypesTableAdapter.GetGroupedByGroupId(groupId);
        }

        /// <summary>
        /// Gibt eine Tabelle mit allen nicht zu einer Gruppe gehörigen AttributeTypes zurück
        /// </summary>
        public CMDBDataSet.AttributeTypesDataTable getUngroupedAttributeTypes()
        {
            return this.attributeTypesTableAdapter.GetUngrouped();
        }

        #endregion

        #region ConnectionTypes

        /// <summary>
        /// Erstellt einen neuen ConnectionType-Datensatz
        /// </summary>
        /// <param name="id">GUID des Verbindungstyps</param>
        /// <param name="name">Bezeichnung des Verbindungstyps</param>
        /// <param name="reverseName">Rückwärts-Bezeichnung des Verbindungstyps</param>
        public void ConnectionTypesRow_Insert(Guid id, string name, string reverseName)
        {
            this.connectionTypesTableAdapter.Insert(id, name, reverseName);
            this.connectionTypesTableAdapter.Fill(this.Dataset.ConnectionTypes);
        }

        /// <summary>
        /// Speichert einen aktualisierten ConnectionType-Datensatz
        /// </summary>
        /// <param name="r">Veränderter Datensatz</param>
        public void ConnectionTypesRow_Update(CMDBDataSet.ConnectionTypesRow r)
        {
            if (r == null)
                throw new Exception("Kein Datensatz angegeben");
            this.connectionTypesTableAdapter.Update(r);
            this.connectionTypesTableAdapter.Fill(this.Dataset.ConnectionTypes);
        }

        /// <summary>
        /// Löscht einen bestehenden ConnectionType-Datensatz
        /// </summary>
        /// <param name="id">GUID des Verbindungstyps</param>
        /// <param name="name">Bezeichnung des Verbindungstyps</param>
        /// <param name="reverseName">Rückwärts-Bezeichnung des Verbindungstyps</param>
        public void ConnectionTypesRow_Delete(Guid id, string name, string reverseName)
        {
            this.connectionTypesTableAdapter.Delete(id, name, reverseName);
            this.connectionTypesTableAdapter.Fill(this.Dataset.ConnectionTypes);
        }

        #endregion

        #region AttributeGroups

        /// <summary>
        /// Erstellt einen neuen AttributeGroup-Datensatz
        /// </summary>
        /// <param name="id">ID der neuen Attributgruppe</param>
        /// <param name="name">Bezeichnung der neuen Attributgruppe</param>
        public void AttributeGroupsRow_Insert(Guid id, string name)
        {
            this.attributeGroupsTableAdapter.Insert(id, name);
            this.attributeGroupsTableAdapter.Fill(this.Dataset.AttributeGroups);
        }

        /// <summary>
        /// Speichert einen geänderten AttributeGroup-Datensatz
        /// </summary>
        /// <param name="r">Geänderter Datensatz mit Attributgruppe</param>
        public void AttributeGroupsRow_Update(CMDBDataSet.AttributeGroupsRow r)
        {
            this.attributeGroupsTableAdapter.Update(r);
            this.attributeGroupsTableAdapter.Fill(this.Dataset.AttributeGroups);
        }

        /// <summary>
        /// Löscht einen existierenden AttributeGroup-Datensatz
        /// </summary>
        /// <param name="id">ID der Attributgruppe</param>
        /// <param name="name">Bezeichnung der Attributgruppe</param>
        public void AttributeGroupsRow_Delete(Guid id, string name)
        {
            this.attributeGroupsTableAdapter.Delete(id, name);
            this.attributeGroupsTableAdapter.Fill(this.Dataset.AttributeGroups);
        }

        #endregion

        #region GroupAttributes

        /// <summary>
        /// Erstellt einen neuen GroupAttribute-Datensatz
        /// </summary>
        /// <param name="group">ID der Attributgruppe</param>
        /// <param name="attributeType">ID des AttributTyps</param>
        /// <param name="minimumOccurences">Minimales Auftreten der Attribute</param>
        /// <param name="maximumOccurences">Maximales Auftreten der Attribute</param>
        public void GroupAttributesRow_Insert(Guid group, Guid attributeType, int minimumOccurences, int maximumOccurences)
        {
            this.groupAttributesTableAdapter.Insert(group, attributeType, minimumOccurences, maximumOccurences);
            this.groupAttributesTableAdapter.Fill(this.Dataset.GroupAttributes);
        }

        /// <summary>
        /// Speichert einen geänderten GroupAttribute-Datensatz
        /// </summary>
        /// <param name="r">Geänderter Datensatz mit Gruppen-Attributgruppen-Zuordnung</param>
        public void GroupAttributesRow_Update(CMDBDataSet.GroupAttributesRow r)
        {
            this.groupAttributesTableAdapter.Update(r);
            this.groupAttributesTableAdapter.Fill(this.Dataset.GroupAttributes);
        }

        /// <summary>
        /// Löscht einen existierenden GroupAttribute-Datensatz
        /// </summary>
        /// <param name="group">ID der Attributgruppe</param>
        /// <param name="attributeType">ID des AttributTyps</param>
        /// <param name="minimumOccurences">Minimales Auftreten der Attribute</param>
        /// <param name="maximumOccurences">Maximales Auftreten der Attribute</param>
        public void GroupAttributesRow_Delete(Guid group, Guid attributeType, int minimumOccurences, int maximumOccurences)
        {
            this.groupAttributesTableAdapter.Delete(group, attributeType, minimumOccurences, maximumOccurences);
            this.groupAttributesTableAdapter.Fill(this.Dataset.GroupAttributes);
        }


        #endregion

        #region ItemTypes

        /// <summary>
        /// Löscht einen existierenden ItemType-Datensatz
        /// </summary>
        /// <param name="typeId">GUID des ItemType</param>
        /// <param name="typeName">Bezeichnung des ItemType</param>
        public void ItemTypesRow_Delete(Guid typeId, string typeName)
        {
            this.itemTypesTableAdapter.Delete(typeId, typeName);
            this.itemTypesTableAdapter.Fill(this.Dataset.ItemTypes);
        }

        /// <summary>
        /// Speichert einen geänderten ItemType-Datensatz
        /// </summary>
        /// <param name="r">Geänderter Datensatz des ItemType</param>
        public void ItemTypesRow_Update(CMDBDataSet.ItemTypesRow r)
        {
            this.itemTypesTableAdapter.Update(r);
            this.itemTypesTableAdapter.Fill(this.Dataset.ItemTypes);
        }

        /// <summary>
        /// Fügt einen neuen ItemType-Datensatz hinzu
        /// </summary>
        /// <param name="typeId">GUID des ItemType</param>
        /// <param name="typeName">Bezeichnung des ItemType</param>
        public void ItemTypesRow_Insert(Guid typeId, string typeName, string backColor)
        {
            this.itemTypesTableAdapter.Insert(typeId, typeName, backColor);
            this.itemTypesTableAdapter.Fill(this.Dataset.ItemTypes);
        }

        /// <summary>
        /// Gibt alle Attributgruppen zurück, die einem Itemtype nicht zugeordnet sind
        /// </summary>
        /// <param name="itemtype">GUID des Itemtype</param>
        public CMDBDataSet.AttributeGroupsDataTable getUnassignedAttributeGroups(Guid itemtype)
        {
            return this.attributeGroupsTableAdapter.GetUnassignedToItem(itemtype);
        }

        /// <summary>
        /// Gibt alle Attributgruppen zurück, die einem ItemType zugeordnet sind
        /// </summary>
        /// <param name="itemtype">GUID des Itemtype</param>
        public CMDBDataSet.AttributeGroupsDataTable getAssignedAttributeGroups(Guid itemtype)
        {
            return this.attributeGroupsTableAdapter.GetAssignedToItem(itemtype);
        }

        #endregion

        #region ItemAttributeGroups

        /// <summary>
        /// Fügt eine neue Zuordnung einer Attributgruppe zu einem ItemType hinzu
        /// </summary>
        /// <param name="groupId">GUID der Attributgruppe</param>
        /// <param name="itemTypeId">GUID des ItemType</param>
        public void ItemAttributeGroups_Insert(Guid groupId, Guid itemTypeId)
        {
            this.itemAttributeGroupsTableAdapter.Insert(groupId, itemTypeId);
            this.itemAttributeGroupsTableAdapter.Fill(this.Dataset.ItemAttributeGroups);
        }

        /// <summary>
        /// Löscht eine bestehende Zuordnung einer Attributgruppe zu einem ItemType
        /// </summary>
        /// <param name="groupId">GUID der Attributgruppe</param>
        /// <param name="itemTypeId">GUID des ItemType</param>
        public void ItemAttributeGroups_Delete(Guid groupId, Guid itemTypeId)
        {
            this.itemAttributeGroupsTableAdapter.Delete(groupId, itemTypeId);
            this.itemAttributeGroupsTableAdapter.Fill(this.Dataset.ItemAttributeGroups);
        }

        #endregion

        #region ConnectionRules

        /// <summary>
        /// Erstellt einen neuen ConnectionRule-Datensatz
        /// </summary>
        /// <param name="ruleId">ID der neu zu erstellenden Regel</param>
        /// <param name="upperType">Oberer ItemType</param>
        /// <param name="connType">ConnectionType</param>
        /// <param name="lowerType">Unterer ItemType</param>
        /// <param name="minimumValue">Mindestanzahl der Verbindungen</param>
        /// <param name="maximumValue">Maximalanzahl der Verbindungen</param>
        public void ConnectionRulesRow_Insert(Guid ruleId, Guid upperType, Guid connType, Guid lowerType, int minimumValue, int maximumValue)
        {
            this.connectionRulesTableAdapter.Insert(ruleId, upperType, lowerType, connType, minimumValue, maximumValue);
            this.connectionRulesTableAdapter.Fill(this.Dataset.ConnectionRules);
        }

        /// <summary>
        /// Führt die Änderungen an einem ConnectionRule-Datensatz durch
        /// </summary>
        /// <param name="r">Der geänderte ConnectionRule-Datensatz</param>
        public void ConnectionRulesRow_Update(CMDBDataSet.ConnectionRulesRow r)
        {
            this.connectionRulesTableAdapter.Update(r);
            this.connectionRulesTableAdapter.Fill(this.Dataset.ConnectionRules);
        }

        /// <summary>
        /// Löscht einen ConnectionRules-Datensatz
        /// </summary>
        /// <param name="ruleId">ID der zu löschenden Regel</param>
        /// <param name="upperItemType">Typ des oberen Items</param>
        /// <param name="connType">Typ der Verbindung</param>
        /// <param name="lowerItemType">Typ des unteren Items</param>
        /// <param name="minimumConnections">Mindestanzahl von Connections</param>
        /// <param name="maximumConnections">Maximalanzahl von Connections</param>
        public void ConnectionRulesRow_Delete(Guid ruleId, Guid upperItemType, Guid connType, Guid lowerItemType, int minimumConnections, int maximumConnections)
        {
            this.connectionRulesTableAdapter.Delete(ruleId, upperItemType, lowerItemType, connType, minimumConnections, maximumConnections);
            this.connectionRulesTableAdapter.Fill(this.Dataset.ConnectionRules);
        }

        /// <summary>
        /// Gibt die Regeln zurück, die ausgehend vom Typ abwärts gerichtet sind
        /// </summary>
        /// <param name="itemType">Guid des ItemType</param>
        /// <returns>ConnectionRulesDataTable</returns>
        public CMDBDataSet.ConnectionRulesDataTable ConnectionRules_GetByItemUpperType(Guid itemType)
        {
            return this.connectionRulesTableAdapter.GetRulesForUpperType(itemType);
        }

        /// <summary>
        /// Gibt die Regeln zurück, die ausgehend vom Typ aufwärts gerichtet sind
        /// </summary>
        /// <param name="itemType">Guid des ItemType</param>
        /// <returns>ConnectionRulesDataTable</returns>
        public CMDBDataSet.ConnectionRulesDataTable ConnectionRules_GetByItemLowerType(Guid itemType)
        {
            return this.connectionRulesTableAdapter.GetRulesForLowerType(itemType);
        }

        #endregion

        #region ConfigurationItems

        /// <summary>
        /// Überladen: Sucht alle ConfigurationItems des angegebenen Typs, die im Namen oder einem Attributwert den gesuchten Text enthalten
        /// </summary>
        /// <param name="itemType">Item-Typ, der gesucht wird</param>
        /// <param name="textToSearch">Text, der gesucht wird</param>
        /// <returns>Tabelle mit ItemTypes</returns>
        public CMDBDataSet.ConfigurationItemsDataTable searchConfigurationItems(Guid itemType, string textToSearch)
        {
            return this.configurationItemsTableAdapter.GetItemsByItemTypeAndNameOrAttribute(itemType, textToSearch);
        }

        /// <summary>
        /// Überladen: Sucht alle ConfigurationItems, die im Namen oder einem Attributwert den gesuchten Text enthalten
        /// </summary>
        /// <param name="textToSearch">Text, der gesucht wird</param>
        /// <returns>Tabelle mit ItemTypes</returns>
        public CMDBDataSet.ConfigurationItemsDataTable searchConfigurationItems(string textToSearch)
        {
            return this.configurationItemsTableAdapter.GetItemsByNameOrAttribute(textToSearch);
        }

        /// <summary>
        /// Überladen: Sucht alle ConfigurationItems des angegebenen Typs
        /// </summary>
        /// <param name="itemType">Item-Typ, der gesucht wird</param>
        /// <returns>Tabelle mit ItemTypes</returns>
        public CMDBDataSet.ConfigurationItemsDataTable searchConfigurationItems(Guid itemType)
        {
            return this.configurationItemsTableAdapter.GetItemsByItemType(itemType);
        }

        /// <summary>
        /// Erzeugt einen neuen ConfigurationItems-Datensatz
        /// </summary>
        /// <param name="itemId">Guid des neuen Items</param>
        /// <param name="itemType">TypeId des neuen Items</param>
        /// <param name="itemName">Name des neuen Items</param>
        public void ConfigurationItem_Insert(Guid itemId, Guid itemType, string itemName, string changedByToken)
        {
            this.configurationItemsTableAdapter.Insert(itemId, itemType, itemName, changedByToken);
            this.configurationItemsTableAdapter.Fill(this.Dataset.ConfigurationItems);
            this.responsibilityTableAdapter.Fill(this.Dataset.Responsibility);
        }

        /// <summary>
        /// Ändert einen bestehenden ConfigurationItems-Datensatz
        /// Zuerst wird überprüft, ob der Datensatz nicht von jemand anderem schon geändert wurde; danach wird der alte Datensatz in die History-Tabelle kopiert,
        /// zusammen mit dem Namen dessen, die den Datensatz gerade ändert. Danach erst wird der Datensatz geändert.
        /// </summary>
        /// <param name="itemId">Die GUID des Configuration Items</param>
        /// <param name="itemType">Die GUID des ItemTypes</param>
        /// <param name="itemName">Der neue Name des Items</param>
        /// <param name="itemCreated">Der Zeitpunkt der Erstellung des Configuration Items (nur zur Kontrolle, kann nicht mehr geändert werden)</param>
        /// <param name="itemLastChange">Der Zeitpunkt der letzten Änderung des Configuration Items (nur zur Kontrolle, wird automatisch von der Stored Procedure geändert)</param>
        /// <param name="itemVersion">Die Datensatzversion des Configuration Items (nur zur Kontrolle, automatisch von der Stored Procedure geändert)</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Änderung durchführt (für die interne Protokollierung</param>
        public void ConfigurationItem_Update(Guid itemId, Guid itemType, string itemName, DateTime itemCreated, DateTime itemLastChange, int itemVersion, string changedByToken)
        {
            this.configurationItemsTableAdapter.Update(itemId, itemType, itemName, itemCreated, itemLastChange, itemVersion, changedByToken);
            this.configurationItemsTableAdapter.Fill(this.Dataset.ConfigurationItems);
        }

        /// <summary>
        /// Löscht einen bestehenden ConfigurationItems-Datensatz
        /// Zuerst wird überprüft, ob der Datensatz nicht von jemand anderem schon geändert wurde; danach wird der alte Datensatz in die History-Tabelle kopiert,
        /// zusammen mit dem Namen dessen, die den Datensatz gerade löscht. Danach erst wird der Datensatz gelöscht.
        /// </summary>
        /// <param name="itemId">Die GUID des Configuration Items</param>
        /// <param name="itemType">Die GUID des ItemTypes</param>
        /// <param name="itemName">Der Name des Items</param>
        /// <param name="itemCreated">Der Zeitpunkt der Erstellung des Configuration Items (nur zur Kontrolle, kann nicht mehr geändert werden)</param>
        /// <param name="itemLastChange">Der Zeitpunkt der letzten Änderung des Configuration Items (nur zur Kontrolle, wird automatisch von der Stored Procedure geändert)</param>
        /// <param name="itemVersion">Die Datensatzversion des Configuration Items (nur zur Kontrolle, automatisch von der Stored Procedure geändert)</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Löschung durchführt (für die interne Protokollierung)</param>
        public void ConfigurationItem_Delete(Guid itemId, Guid itemType, string itemName, DateTime itemCreated, DateTime itemLastChange, int itemVersion, string changedByToken)
        {
            this.configurationItemsTableAdapter.Delete(itemId, itemType, itemName, itemCreated, itemLastChange, itemVersion, changedByToken);
            this.configurationItemsTableAdapter.Fill(this.Dataset.ConfigurationItems);
            this.itemAttributesTableAdapter.Fill(this.Dataset.ItemAttributes);
            this.itemLinksTableAdapter.Fill(this.Dataset.ItemLinks);
            this.connectionsTableAdapter.Fill(this.Dataset.Connections);
            this.responsibilityTableAdapter.Fill(this.Dataset.Responsibility);
        }

        /// <summary>
        /// Gibt die Anzahl der ConfigurationItems zurück, die einen bestimmten Typ besitzen
        /// </summary>
        /// <param name="itemType">Guid des ItemType</param>
        /// <returns>Int32</returns>
        public int getConfigurationItemCountForType(Guid itemType)
        {
            return Convert.ToInt32(this.queriesTableAdapter.ConfigurationItems_GetCountForItemType(itemType));
        }

        /// <summary>
        /// Gibt alle Items zurück, die ausgehend von einem gegebenen Item über eine Regel verbunden sind.
        /// Anmerkung: Die Methode gibt abhängig von der Regel die Items oberhalb oder unterhalb des gegebenen Items zurück.
        /// </summary>
        /// <param name="itemId">Guid des Items, ab dem gesucht wird</param>
        /// <param name="ruleId">Guid der Regel</param>
        /// <returns>ConfigurationItemsDataTable</returns>
        public CMDBDataSet.ConfigurationItemsDataTable getNeighborConfigurationItemsForItemAndConnectionRule(Guid itemId, Guid ruleId)
        {
            return this.configurationItemsTableAdapter.GetItemsByItemAndConnectionRule(itemId, ruleId);
        }

        /// <summary>
        /// Gibt alle Items zurück, die ausgehend von einem gegebenen Item über eine Regel verbunden werden können.
        /// Anmerkung: Die Methode gibt abhängig von der Regel die Items oberhalb oder unterhalb des gegebenen Items zurück.
        /// </summary>
        /// <param name="itemId">Guid des Items, ab dem gesucht wird</param>
        /// <param name="ruleId">Guid der Regel</param>
        /// <returns>ConfigurationItemsDataTable</returns>
        public CMDBDataSet.ConfigurationItemsDataTable getAvailableConfigurationItemsForItemAndConnectionRule(Guid itemId, Guid ruleId)
        {
            return this.configurationItemsTableAdapter.GetAvailableItemsByItemAndConnectionRule(itemId, ruleId);
        }



        #endregion

        #region ItemAttributes

        /// <summary>
        /// Gibt alle Attribute zurück, die einem angegebenen Item zugeordnet sind
        /// </summary>
        /// <param name="itemId">Guid des Configuration Items</param>
        /// <returns>ItemAttributesDataTable</returns>
        public CMDBDataSet.ItemAttributesDataTable getAttributesForItem(Guid itemId)
        {
            return this.itemAttributesTableAdapter.GetAttributesByItem(itemId);
        }

        /// <summary>
        /// Gibt alle Attribute zurück, die zu einem bestimmten Item gehören und in einer bestimmten Gruppe zugeordnet sind
        /// </summary>
        /// <param name="itemId">Guid des Configuration Items</param>
        /// <param name="groupId">Guid der AttributGruppe</param>
        /// <returns>ItemAttributesDataTable</returns>
        public CMDBDataSet.ItemAttributesDataTable getAttributesForItemAndType(Guid itemId, Guid attributeType)
        {
            return this.itemAttributesTableAdapter.GetAttributesByItemAndType(itemId, attributeType);
        }

        /// <summary>
        /// Erstellt ein neues Attribut zu einem Item
        /// </summary>
        /// <param name="attributeId">Guid des Attributs</param>
        /// <param name="itemId">Guid des Configuration Items</param>
        /// <param name="attributeTypeId">Guid des Attributtyps</param>
        /// <param name="attributeValue">Wert des Attributs</param>
        public void ItemAttributes_Insert(Guid attributeId, Guid itemId, Guid attributeTypeId, string attributeValue)
        {
            this.itemAttributesTableAdapter.Insert(attributeId, itemId, attributeTypeId, attributeValue);
            this.itemAttributesTableAdapter.Fill(this.Dataset.ItemAttributes);
        }

        /// <summary>
        /// Aktualisiert ein vorhandenes Attribut zu einem Item
        /// </summary>
        /// <param name="attributeId">Guid des Attributs</param>
        /// <param name="attributeValue">Wert des Attributs</param>
        /// <param name="attributeLastChange">Datum der letzten Änderung am Attribu</param>
        /// <param name="attributeVersion">Version des Attributs</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Löschung durchführt (für die interne Protokollierung)</param>
        public void ItemAttributes_Update(Guid attributeId, string attributeValue, DateTime attributeLastChange, int attributeVersion, string changedByToken)
        {
            this.itemAttributesTableAdapter.Update(attributeValue, attributeId, attributeLastChange, attributeVersion, changedByToken);
            this.itemAttributesTableAdapter.Fill(this.Dataset.ItemAttributes);
        }

        /// <summary>
        /// Löscht ein vorhandenes Attribut zu einem Item
        /// </summary>
        /// <param name="attributeId">Guid des Attributs</param>
        /// <param name="itemId">Guid des Configuration Items</param>
        /// <param name="attributeTypeId">Guid des Attributtyps</param>
        /// <param name="attributeValue">Wert des Attributs</param>
        /// <param name="attributeCreated">Datum der Erstellung des Attributs</param>
        /// <param name="attributeLastChange">Datum der letzten Änderung am Attribu</param>
        /// <param name="attributeVersion">Version des Attributs</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Löschung durchführt (für die interne Protokollierung)</param>
        public void ItemAttributes_Delete(Guid attributeId, Guid itemId, Guid attributeTypeId, string attributeValue, DateTime attributeCreated, DateTime attributeLastChange, int attributeVersion, string changedByToken)
        {
            this.itemAttributesTableAdapter.Delete(attributeId, itemId, attributeTypeId, attributeValue, attributeCreated, attributeLastChange, attributeVersion, changedByToken);
            this.itemAttributesTableAdapter.Fill(this.Dataset.ItemAttributes);
        }

        /// <summary>
        /// Löscht vorhandene Attribute zu mehreren Items, die alle einem bestimmten Typ angehören
        /// </summary>
        /// <param name="attributeTypeId">Guid des Attributtyps</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Löschung durchführt (für die interne Protokollierung)</param>
        /// <param name="expectedNumberOfRows">Anzahl der Zeilen, die als Ergebnis erwartet wird</param>
        public void ItemAttributes_DeleteByType(Guid attributeTypeId, string changedByToken, int expectedNumberOfRows)
        {
            this.itemAttributesTableAdapter.Fill(this.Dataset.ItemAttributes);
            CMDBDataSet.ItemAttributesRow[] attrs = (CMDBDataSet.ItemAttributesRow[])this.Dataset.ItemAttributes.Select(string.Format("AttributeTypeId = '{0}'", attributeTypeId));
            if (attrs.Length != expectedNumberOfRows)
                throw new Exception("Die Anzahl der Attributwerte hat sich seit dem letzten Aufruf geändert. Bitte versuchen Sie es später erneut.");
            for (int i = 0; i < attrs.Length; i++)
            {
                CMDBDataSet.ItemAttributesRow attr = attrs[i];
                this.itemAttributesTableAdapter.Delete(attr.AttributeId, attr.ItemId, attr.AttributeTypeId, attr.AttributeValue, attr.AttributeCreated, attr.AttributeLastChange, attr.AttributeVersion,
                    changedByToken);
            }
            this.itemAttributesTableAdapter.Fill(this.Dataset.ItemAttributes);
        }

        /// <summary>
        /// Löscht vorhandene Attribute zu mehreren Items, die alle einem bestimmten Typ angehören
        /// </summary>
        /// <param name="groupId">Guid der Attributgruppe, die verwendet wird</param>
        /// <param name="itemTypeId">Guid des ItemType, der verwendet wird</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Löschung durchführt (für die interne Protokollierung)</param>
        public void ItemAttributes_DeleteByGroupAndItemType(Guid groupId, Guid itemTypeId, string changedByToken)
        {
            this.queriesTableAdapter.ItemAttributes_DeleteByAttributeGroupAndItemType(groupId, itemTypeId, changedByToken);
            this.itemAttributesTableAdapter.Fill(this.Dataset.ItemAttributes);
        }

        /// <summary>
        /// Gibt die Anzahl der verwendeten Attribute von einem bestimmten Typ zurück
        /// </summary>
        /// <param name="attributeTypeId">Guid des Attributtyps</param>
        /// <returns>Int32</returns>
        public int getItemAttributesCountForAttributeType(Guid attributeTypeId)
        {
            return Convert.ToInt32(this.queriesTableAdapter.ItemAttributes_GetCountForType(attributeTypeId));
        }

        /// <summary>
        /// Gibt die Anzahl der verwendeten Attribute zurück, deren Typ einer angegebenen Attributgruppe zugeordnet ist
        /// </summary>
        /// <param name="groupId">Guid der Attributgruppe</param>
        /// <returns>Int32</returns>
        public int getItemAttributesCountForAttributeGroup(Guid groupId)
        {
            return Convert.ToInt32(this.queriesTableAdapter.ItemAttributes_GetCountForAttributeGroup(groupId));
        }

        /// <summary>
        /// Gibt die Anzahl der verwendeten Attribute zurück, deren Typ einer angegebenen Attributgruppe zugeordnet ist
        /// </summary>
        /// <param name="groupId">Guid der Attributgruppe</param>
        /// <returns>Int32</returns>
        public int getItemAttributesCountForAttributeGroupAndItemType(Guid groupId, Guid itemTypeId)
        {
            return Convert.ToInt32(this.queriesTableAdapter.ItemAttributes_GetCountForAttributeGroupAndItemType(groupId, itemTypeId));
        }

        #endregion

        #region ItemLinks

        /// <summary>
        /// Erstellt einen neuen ItemLink-Datensatz
        /// </summary>
        /// <param name="LinkId">Guid des Link</param>
        /// <param name="itemId">Guid des zugehörigen Items</param>
        /// <param name="LinkURI">Zieladresse des Link</param>
        /// <param name="LinkDescription">Beschreibung des Link</param>
        public void ItemLinks_Insert(Guid LinkId, Guid itemId, string LinkURI, string LinkDescription)
        {
            this.itemLinksTableAdapter.Insert(LinkId, itemId, LinkURI, LinkDescription);
            this.itemLinksTableAdapter.Fill(this.Dataset.ItemLinks);
        }

        /// <summary>
        /// Ändert einen bestehenden Link
        /// </summary>
        /// <param name="LinkId">Guid des Link (kann nicht geändert werden</param>
        /// <param name="itemId">Guid des zugehörigen Items (kann nicht geändert werden)</param>
        /// <param name="LinkURI">Zieladresse des Link</param>
        /// <param name="LinkDescription">Beschreibung des Link</param>
        /// <param name="Original_LinkURI">Bisherige Zieladresse des Link</param>
        /// <param name="Original_LinkDescription">Bisherige Beschreibung des Link</param>
        public void ItemLinks_Update(Guid LinkId, Guid itemId, string LinkURI, string LinkDescription, string Original_LinkURI, string Original_LinkDescription)
        {
            this.itemLinksTableAdapter.Update(LinkURI, LinkDescription, LinkId, itemId, Original_LinkURI, Original_LinkDescription);
            this.itemLinksTableAdapter.Fill(this.Dataset.ItemLinks);
        }

        /// <summary>
        /// Löscht einen bestehenden ItemLink-Datensatz
        /// </summary>
        /// <param name="LinkId">Guid des Link</param>
        /// <param name="itemId">Guid des zugehörigen Items</param>
        /// <param name="LinkURI">Zieladresse des Link</param>
        /// <param name="LinkDescription">Beschreibung des Link</param>
        public void ItemLinks_Delete(Guid LinkId, Guid itemId, string LinkURI, string LinkDescription)
        {
            this.itemLinksTableAdapter.Delete(LinkId, itemId, LinkURI, LinkDescription);
            this.itemLinksTableAdapter.Fill(this.Dataset.ItemLinks);
        }

        /// <summary>
        /// Gibt alle Links für ein ConfigurationItem zurück
        /// </summary>
        /// <param name="itemId">Guid des Items, dessen Links angezeigt werden</param>
        /// <returns>ItemLinksDataTable</returns>
        public CMDBDataSet.ItemLinksDataTable getItemLinksForItem(Guid itemId)
        {
            return this.itemLinksTableAdapter.GetItemLinksForItem(itemId);
        }

        #endregion

        #region Connections

        /// <summary>
        /// Gibt die Anzahl der Connections zu einem bestimmten ConnectionType zurück
        /// </summary>
        /// <param name="connectionType">Guid des ConnectionType</param>
        /// <returns>Int32</returns>
        public int getConnectionsCountForConnectionType(Guid connectionType)
        {
            return Convert.ToInt32(this.queriesTableAdapter.Connections_GetCountForConnectionType(connectionType));
        }

        /// <summary>
        /// Gibt die Anzahl der Verbindungen zurück, die einer angegebenen Regel entsprechen
        /// </summary>
        /// <param name="ruleId">ID der Regel, für die die Auswertung erfolgt</param>
        /// <returns>Int-Wert mit der Anzahl</returns>
        public int getConnectionCountForRule(Guid ruleId)
        {
            return Convert.ToInt32(this.queriesTableAdapter.Connections_GetCountForRule(ruleId));
        }

        /// <summary>
        /// Gibt alle Regeln zurück, die für ein bestimmtes Configuration Item einer angegebenen Regel entsprechen
        /// </summary>
        /// <param name="itemId">Guid des Configuration Items, für das gesucht wird</param>
        /// <param name="ruleId">Guid der Regel</param>
        /// <returns>ConnectionsDataTable</returns>
        public CMDBDataSet.ConnectionsDataTable getConnectionsForItemAndRule(Guid itemId, Guid ruleId)
        {
            return this.connectionsTableAdapter.GetConnectionsForItemAndRule(itemId, ruleId);
        }

        /// <summary>
        /// Erstellt einen neuen Connections-Datensatz
        /// </summary>
        /// <param name="connId">Guid des Datensatzes</param>
        /// <param name="connType">Guid des ConnectionType</param>
        /// <param name="connUpperItem">Guid des oberen Configuration Item</param>
        /// <param name="connLowerItem">Guid des unteren Configuration Item</param>
        public void Connection_Insert(Guid connId, Guid connType, Guid connUpperItem, Guid connLowerItem)
        {
            this.connectionsTableAdapter.Insert(connId, connType, connUpperItem, connLowerItem);
            this.connectionsTableAdapter.Fill(this.Dataset.Connections);
        }

        /// <summary>
        /// Ändert einen vorhandenen Datensatz
        /// </summary>
        /// <param name="connId">Guid des Datensatzes (kann nicht geändert werden</param>
        /// <param name="connType">Guid des ConnectionType</param>
        /// <param name="connUpperItem">Guid des oberen Configuration Item</param>
        /// <param name="connLowerItem">Guid des unteren Configuration Item</param>
        /// <param name="connLastChange">Zeitpunkt der letzten Änderung des Datensatzes (zur Kontrolle)</param>
        /// <param name="connVersion">Version des Datensatzes (zur Kontrolle)</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Änderung durchführt (für die interne Protokollierung)</param>
        public void Connection_Update(Guid connId, Guid connType, Guid connUpperItem, Guid connLowerItem, DateTime connLastChange, int connVersion, string changedByToken)
        {
            this.connectionsTableAdapter.Update(connType, connUpperItem, connLowerItem, connId, connLastChange, connVersion, changedByToken);
            this.connectionsTableAdapter.Fill(this.Dataset.Connections);
        }

        /// <summary>
        /// Löscht einen vorhandenen Connections-Datensatz
        /// </summary>
        /// <param name="connId">Guid des Datensatzes</param>
        /// <param name="connType">Guid des Verbindungstyps</param>
        /// <param name="connUpperItem">Guid des oberen Configuration Items</param>
        /// <param name="connLowerItem">Guid des unteren Configuration Items</param>
        /// <param name="connCreated">Zeitpunkt, wann der Datensatz erstellt wurde</param>
        /// <param name="connLastChange">Zeitpunkt der letzten Änderung des Datensatzes</param>
        /// <param name="connVersion">Version des Datensatzes</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Löschung durchführt (für die interne Protokollierung)</param>
        public void Connection_Delete(Guid connId, Guid connType, Guid connUpperItem, Guid connLowerItem, DateTime connCreated, DateTime connLastChange, int connVersion, string changedByToken)
        {
            this.connectionsTableAdapter.Delete(connId, connType, connUpperItem, connLowerItem, connCreated, connLastChange, connVersion, changedByToken);
            this.connectionsTableAdapter.Fill(this.Dataset.Connections);
        }

        public CMDBDataSet.ConnectionsDataTable getConnectionsToUpperForItem(Guid itemId)
        {
            return this.connectionsTableAdapter.GetUpperItemsByItemId(itemId);
        }

        public CMDBDataSet.ConnectionsDataTable getConnectionsToLowerForItem(Guid itemId)
        {
            return this.connectionsTableAdapter.GetLowerItemsByItemId(itemId);
        }

        #endregion

        #region Responsibility

        /// <summary>
        /// Erzeugt einen neuen Datensatz in der Tabelle der Verantwortlichkeiten für Configuration Items
        /// </summary>
        /// <param name="itemId">Guid des Configuration Items</param>
        /// <param name="UserToken">Benutzername</param>
        public void TakeResponsibility(Guid itemId, string UserToken)
        {
            this.responsibilityTableAdapter.Insert(itemId, UserToken);
            this.responsibilityTableAdapter.Fill(this.Dataset.Responsibility);
        }

        /// <summary>
        /// Löscht einen Datensatz in der Tabelle der Verantwortlichkeiten für Configuration Items
        /// </summary>
        /// <param name="itemId"></param>
        /// <param name="UserToken"></param>
        public void AbandonResponsibility(Guid itemId, string UserToken)
        {
            this.responsibilityTableAdapter.Delete(itemId, UserToken);
            this.responsibilityTableAdapter.Fill(this.Dataset.Responsibility);
        }

        #endregion
    }
}
