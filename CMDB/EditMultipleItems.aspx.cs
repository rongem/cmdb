using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class EditMultipleItems : System.Web.UI.Page
{
    private List<Guid> ids;

    protected void Page_Load(object sender, EventArgs e)
    {
        (Master as CMDB).IsButtonCreateVisible = true;
        if (!IsPostBack)
        {
            ids = Session["scope"] as List<Guid>;
            if (ids == null || ids.Count < 2)
            {
                Response.Redirect("~/Default.aspx", true);
                return;
            }
            Session.Remove("scope");
            ViewState.Add("ids", ids);
            foreach (Guid id in ids)
            {
                if (!SecurityHandler.UserIsResponsible(id, Request.LogonUserIdentity.Name))
                    SecurityHandler.TakeResponsibility(id, Request.LogonUserIdentity);
                ConfigurationItem r = DataHandler.GetConfigurationItem(id);
                lstItems.Items.Add(new ListItem(string.Format("{0}: {1}", r.TypeName, r.ItemName), string.Format("~/ShowItem.aspx?ID={0}", id)));
            }
        }
        else
        {
            ids = ViewState["ids"] as List<Guid>;
        }
        if (ids == null || ids.Count < 2)
        {
            Response.Redirect("~/Default.aspx", true);
            return;
        }
        if (!IsPostBack)
        {
            Guid itemType = DataHandler.GetConfigurationItem(ids[0]).ItemType;
            cblAttributes.Items.Clear();
            cblDeleteConnections.Items.Clear();
            cblAddConnections.Items.Clear();
            // Gemeinsame Attribute ermitteln
            foreach (AttributeType attType in MetaDataHandler.GetAllowedAttributeTypesForItemType(itemType))
            {
                cblAttributes.Items.Add(new ListItem(attType.TypeName, attType.TypeId.ToString()));
            }
            // Löschbare Verbindungen ermitteln, d. h. solche, die mit allen CIs verbunden sind.
            IEnumerable<Connection> connections = FindDeletableConnections();
            // Übriggebliebene Verbindungen zum Löschen anzeigen.
            foreach (Connection conn in connections)
            {
                cblDeleteConnections.Items.Add(new ListItem(GetConnectionText(conn.ConnType, conn.ConnLowerItem),
                    string.Format("{0}|{1}", conn.ConnType, conn.ConnLowerItem)));
            }
            // Hinzuzufügende Verbindungen anzeigen, d. h. solche CIs, die noch keine Verbindung mit irgendeinem der ausgewählten CIs haben.
            foreach (ConnectionRule crr in MetaDataHandler.GetConnectionRulesByUpperItemType(itemType))
            {
                cblAddConnections.Items.Add(new ListItem(string.Format("{0} {1}", MetaDataHandler.GetConnectionType(crr.ConnType).ConnTypeName,
                    MetaDataHandler.GetItemType(crr.ItemLowerType).TypeName), crr.RuleId.ToString()));
            }
            // Auswahl nur sichtbar machen, wenn mindestens eine Möglichkeit vorhanden ist.
            if (cblAttributes.Items.Count == 0)
                chkAttributes.Visible = false;
            if (cblAddConnections.Items.Count == 0)
                chkAddConnections.Visible = false;
            else
                cblAddConnections.SelectedIndex = 0;
            if (cblDeleteConnections.Items.Count == 0)
                chkDeleteConnections.Visible = false;
            chkAttributes_CheckedChanged(sender, e);
            chkAddConnections_CheckedChanged(sender, e);
            chkDeleteConnections_CheckedChanged(sender, e);
        }
    }

    /// <summary>
    /// Erzeugt eine Liste mit allen löschbaren Verbindungen
    /// </summary>
    private IEnumerable<Connection> FindDeletableConnections()
    {
        // Alle Lower CIs hinzufügen, die mit dem ersten Element verbunden sind
        IEnumerable<Connection> connections = DataHandler.GetConnectionsToLowerForItem(ids[0]);
        // Danach alle Items entfernen, die nicht mit jedem der zu editierenden CIs verbunden sind
        ConnToLowerComparer comp = new ConnToLowerComparer();
        for (int i = 1; i < ids.Count; i++)
        {
            IEnumerable<Connection> conn2 = DataHandler.GetConnectionsToLowerForItem(ids[i]);
            connections = connections.Intersect(conn2, comp).ToList();
            if (connections.Count() == 0) // wenn ohnehin nichts mehr vorhanden ist, kann man auch gleich beenden.
                break;
        }
        return connections;
    }

    /// <summary>
    /// Liefert die Bezeichnung einer Verbindung zurück
    /// </summary>
    /// <param name="connType">Guid des Verbindungstype</param>
    /// <param name="lowerItem">Guid des verbundenen CIs</param>
    private string GetConnectionText(Guid connType, Guid lowerItem)
    {
        ConfigurationItem r = DataHandler.GetConfigurationItem(lowerItem);
        return string.Format("{0} {1}: {2}", MetaDataHandler.GetConnectionType(connType).ConnTypeName, r.TypeName, r.ItemName);
    }

    protected void wzMultiEdit_NextButtonClick(object sender, WizardNavigationEventArgs e)
    {
        switch (e.CurrentStepIndex)
        {
            case 0: // Eingagsseite abgeschlossen
                if (chkDeleteConnections.Checked) // Zu löschende CIs überprüfen
                {
                    List<Guid> connTypes, lowerItems;
                    RetrieveSelectedConnectionsToDelete(out connTypes, out lowerItems);
                    if (connTypes.Count == 0)
                    {
                        lblError.Text = "Sie müssen mindestens eine gemeinsame Verbindung auswählen.";
                        e.Cancel = true;
                        return;
                    }
                    lstDeleteConnections.Items.Clear();
                    for (int i = 0; i < connTypes.Count; i++)
                    {
                        lstDeleteConnections.Items.Add(new ListItem(GetConnectionText(connTypes[i], lowerItems[i]), string.Empty));
                    }
                }
                if (chkAddConnections.Checked) // Hinzuzufügende CIs überprüfen
                {
                    ShowUnlinkedItems();
                    if (cblItemsToConnectTo.Items.Count == 0)
                    {
                        lblError.Text = "Es existieren keine Configuration Items zu diesem Verbindungstyp, die allen ausgewählten CIs zugeordnet werden könnten.";
                        e.Cancel = true;
                        return;
                    }
                }
                if (chkAttributes.Checked)
                {
                    List<ItemAttribute> attl = RetrieveEqualAttributes();
                    if (attl.Count == 0)
                    {
                        lblError.Text = "Sie müssen mindestens einen Attributtypen auswählen.";
                        e.Cancel = true;
                        return;
                    }
                    rpAttributes.DataSource = attl;
                    rpAttributes.DataBind();
                }
                else if (chkDeleteConnections.Checked)
                { wzMultiEdit.ActiveStepIndex = 2; }
                else if (chkAddConnections.Checked)
                { wzMultiEdit.ActiveStepIndex = 3; }
                else // Nichts ausgewählt
                {
                    lblError.Text = "Sie müssen mindestens eine Aktion auswählen.";
                    e.Cancel = true;
                    return;
                }
                break;
            case 1: // Attribute abgeschlossen
                ChangeAttributes();
                if (!chkDeleteConnections.Checked)
                {
                    if (chkAddConnections.Checked)
                        wzMultiEdit.ActiveStepIndex = 3;
                    else
                        wzMultiEdit.ActiveStepIndex = 4;
                }
                break;
            case 2: // Löschen von Verbindungen abgeschlossen
                DeleteConnections();
                if (chkAddConnections.Checked)
                    ShowUnlinkedItems(); // Bei gelöschten Verbindungen die Verbindungsliste neu berechnen
                else
                    wzMultiEdit.ActiveStepIndex = 4;
                break;
            case 3: // Hinzufügen von Verbindungen abgeschlossen
                List<Guid> lstItemsToconnectTo = new List<Guid>();
                for (int i = 0; i < cblItemsToConnectTo.Items.Count; i++)
                {
                    if (cblItemsToConnectTo.Items[i].Selected)
                        lstItemsToconnectTo.Add(Guid.Parse(cblItemsToConnectTo.Items[i].Value));
                }
                if (lstItemsToconnectTo.Count == 0) // nichts gewählt
                {
                    lblError.Text = "Sie müssen mindestens ein CI auswählen.";
                    e.Cancel = true;
                    return;
                }
                Guid ruleId = Guid.Parse(cblAddConnections.SelectedValue);
                Guid connType = MetaDataHandler.GetConnectionRule(ruleId).ConnType;
                for (int i = 0; i < ids.Count; i++)
                {
                    for (int j = 0; j < lstItemsToconnectTo.Count; j++)
                    {
                        LogResult(string.Format("Verbindung '{0}: {1}' {2} '{3}: {4}' wird angelegt.",
                            DataHandler.GetConfigurationItem(ids[i]).TypeName, DataHandler.GetConfigurationItem(ids[i]).ItemName,
                            MetaDataHandler.GetConnectionType(connType).ConnTypeName,
                            DataHandler.GetConfigurationItem(lstItemsToconnectTo[j]).TypeName, DataHandler.GetConfigurationItem(lstItemsToconnectTo[j]).ItemName));
                        try
                        {
                            DataHandler.CreateConnection(new Connection()
                            {
                                ConnId = Guid.NewGuid(),
                                ConnType = connType,
                                ConnUpperItem = ids[i],
                                ConnLowerItem = lstItemsToconnectTo[j],
                                RuleId = ruleId,
                                Description = txtConnDescription.Text.Trim(),
                            }, Request.LogonUserIdentity);
                        }
                        catch (Exception ex)
                        {
                            LogResult(string.Format("Fehler: {0}", ex.Message));
                        }
                    }
                }
                break;
        }
    }

    /// <summary>
    /// Zeigt alle CIs an, die noch nicht mit den ausgewählten verbunden sind.
    /// </summary>
    private void ShowUnlinkedItems()
    {
        Guid ruleId = Guid.Parse(cblAddConnections.SelectedValue);
        ConnectionRule crr = MetaDataHandler.GetConnectionRule(ruleId);
        lblRule.Text = string.Format("{0} - {1}:", MetaDataHandler.GetConnectionType(crr.ConnType).ConnTypeName,
            MetaDataHandler.GetItemType(crr.ItemLowerType).TypeName);
        List<Guid> l1 = GetConfigItemsListForItemAndConnectionRule(ids[0], ruleId);
        for (int i = 1; i < ids.Count; i++) // für jede ID die verfügbaren Items auslesen und die Schnittmenge behalten
        {
            List<Guid> l2 = GetConfigItemsListForItemAndConnectionRule(ids[i], ruleId);
            l1 = l1.Intersect(l2).ToList();
            if (l1.Count == 0) // Abbrechen, wenn keine Daten mehr vorhanden sind
                break;
        }
        cblItemsToConnectTo.Items.Clear();
        for (int i = 0; i < l1.Count; i++)
        {
            ConfigurationItem r = DataHandler.GetConfigurationItem(l1[i]);
            cblItemsToConnectTo.Items.Add(new ListItem(r.ItemName, r.ItemId.ToString()));
        }

    }

    /// <summary>
    /// Gibt eine Datatable als Liste zurück
    /// </summary>
    /// <param name="itemId">Guid des CI, von dem gesucht wird</param>
    /// <param name="ruleId">Guid der Regel, nach der gesucht wird</param>
    /// <returns>Liste aller CIs, die der Regel entsprechen und noch nicht verbunden sind</returns>
    private List<Guid> GetConfigItemsListForItemAndConnectionRule(Guid itemId, Guid ruleId)
    {
        IEnumerable<CmdbAPI.TransferObjects.ConfigurationItem> t1 = DataHandler.GetConfigurationItemsConnectableAsLowerItem(itemId, ruleId);
        List<Guid> l1 = new List<Guid>(t1.Count());
        l1.AddRange(t1.Select(a => a.ItemId));
        return l1;
    }

    /// <summary>
    /// Löscht die ausgewählten Verbindungen
    /// </summary>
    private void DeleteConnections()
    {
        List<Guid> connTypesToDelete, lowerItemsToDelete;
        RetrieveSelectedConnectionsToDelete(out connTypesToDelete, out lowerItemsToDelete);
        for (int i = 0; i < connTypesToDelete.Count; i++)
        {
            for (int j = 0; j < ids.Count; j++)
            {
                try // Datensatz finden und löschen
                {
                    Connection cr = DataHandler.GetConnectionByContent(ids[j], connTypesToDelete[i], lowerItemsToDelete[i]);
                    LogResult(string.Format("Verbindung '{0}: {1}' {2} '{3}: {4}' wird gelöscht.",
                        DataHandler.GetConfigurationItem(ids[j]).TypeName, DataHandler.GetConfigurationItem(ids[j]).ItemName,
                        MetaDataHandler.GetConnectionType(cr.ConnType).ConnTypeName,
                        DataHandler.GetConfigurationItem(cr.ConnLowerItem).TypeName, DataHandler.GetConfigurationItem(cr.ConnLowerItem).ItemName));
                    DataHandler.DeleteConnection(cr, Request.LogonUserIdentity);
                }
                catch (Exception ex)
                {
                    LogResult(string.Format("Fehler: {0}", ex.Message));
                    return;
                }
            }
        }
    }

    private void RetrieveSelectedConnectionsToDelete(out List<Guid> connTypes, out List<Guid> lowerItems)
    {
        connTypes = new List<Guid>();
        lowerItems = new List<Guid>();
        for (int i = 0; i < cblDeleteConnections.Items.Count; i++)
        {
            if (cblDeleteConnections.Items[i].Selected)
            {
                string[] guids = cblDeleteConnections.Items[i].Value.Split('|');
                connTypes.Add(Guid.Parse(guids[0]));
                lowerItems.Add(Guid.Parse(guids[1]));
            }
        }
    }

    /// <summary>
    /// Attributwerte verändern bzw. neue Attribute anlegen.
    /// </summary>
    private void ChangeAttributes()
    {
        for (int i = 0; i < rpAttributes.Items.Count; i++)
        {
            Guid attTypeId = Guid.Empty;
            string value = string.Empty;
            for (int j = 0; j < rpAttributes.Items[i].Controls.Count; j++)
            {
                Control c = rpAttributes.Items[i].Controls[j];
                if (c.GetType() == typeof(TextBox))
                {
                    value = ((TextBox)c).Text.Trim();
                }
                else if (c.GetType() == typeof(HiddenField))
                {
                    attTypeId = Guid.Parse(((HiddenField)c).Value);
                }
            }
            if (!string.IsNullOrEmpty(value)) // nur ändern, wenn ein Wert eingetragen ist
            {
                for (int k = 0; k < ids.Count; k++)
                {
                    ConfigurationItem cir = DataHandler.GetConfigurationItem(ids[k]);
                    string log = string.Format("'{0}: {1}', Attribut '{2}' ", cir.TypeName, cir.ItemName,
                            MetaDataHandler.GetAttributeType(attTypeId).TypeName);
                    try
                    {
                        ItemAttribute attr = DataHandler.GetAttributeForConfigurationItemByAttributeType(ids[k], attTypeId);
                        if (attr == null) // kein Attribut vorhanden, neu anlegen
                        {
                            attr = new ItemAttribute() { AttributeId = Guid.NewGuid(), ItemId = ids[k], AttributeTypeId = attTypeId, AttributeValue = value };
                            DataHandler.CreateAttribute(attr, Request.LogonUserIdentity);
                            log += string.Format("mit ID {0} und Wert '{1}' angelegt.", attr.AttributeId, value);
                        }
                        else
                        {
                            if (value.Equals(attr.AttributeValue, StringComparison.CurrentCulture))
                            {
                                log += "nicht geändert";
                            }
                            else
                            {
                                log += string.Format("geändert von '{0}' in '{1}'", attr.AttributeValue, value);
                                attr.AttributeValue = value;
                                DataHandler.UpdateAttribute(attr, Request.LogonUserIdentity);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        log += string.Format("wegen eines Fehlers nicht geändert:\r\n{0}", ex.Message);
                    }
                    LogResult(log);
                }
            }
        }
    }


    /// <summary>
    /// Erzeugt einen Log-Eintrag in der BulletedList
    /// </summary>
    /// <param name="log">Inhalt des Eintrags</param>
    private void LogResult(string log)
    {
        if (!log.Equals(string.Empty))
            lstResult.Items.Add(new ListItem(log, string.Empty));
    }

    /// <summary>
    /// Erzeugt eine Liste mit Attributen (ID, Typname, Wert). Sofern der Wert überall gleich ist, wird er angezeigt, ist er unterschiedlich, bleibt der Wert leer
    /// </summary>
    private List<ItemAttribute> RetrieveEqualAttributes()
    {
        List<ItemAttribute> attl = new List<ItemAttribute>();
        for (int i = 0; i < cblAttributes.Items.Count; i++)
        {
            string value = null;
            if (cblAttributes.Items[i].Selected)
            {
                Guid attId = Guid.Parse(cblAttributes.Items[i].Value);
                for (int j = 0; j < ids.Count; j++) // Überprüfen, ob die Attributwerte aller Items gleich sind. Sonst nichts anzeigen.
                {
                    ItemAttribute iar = DataHandler.GetAttributeForConfigurationItemByAttributeType(ids[j], attId);
                    if (iar != null)
                    {
                        if (j == 0)
                            value = iar.AttributeValue;
                        else if (!value.Equals(iar.AttributeValue, StringComparison.CurrentCulture))
                        {
                            value = string.Empty;
                            break;
                        }
                    }
                    else
                    {
                        value = string.Empty;
                        break;
                    }
                }
                attl.Add(new ItemAttribute()
                {
                    AttributeTypeId = attId,
                    AttributeTypeName = MetaDataHandler.GetAttributeType(attId).TypeName,
                    AttributeValue = value,
                });
            }
        }
        return attl;
    }
    protected void chkAttributes_CheckedChanged(object sender, EventArgs e)
    {
        cblAttributes.Visible = chkAttributes.Checked;
    }
    protected void chkAddConnections_CheckedChanged(object sender, EventArgs e)
    {
        cblAddConnections.Visible = chkAddConnections.Checked;
    }
    protected void chkDeleteConnections_CheckedChanged(object sender, EventArgs e)
    {
        cblDeleteConnections.Visible = chkDeleteConnections.Checked;
    }
}