using CmdbClient;
using CmdbClient.CmsService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.ComponentModel;

namespace CmdbGui
{
    /// <summary>
    /// Interaction logic for AttributeToItemWindow.xaml
    /// </summary>
    public partial class AttributeToItemWindow : Window
    {
        private AttributeType attributeType;
        private MetaData meta = new MetaData();
        private List<ItemType> itemTypes = new List<ItemType>();
        private IEnumerable<ConfigurationItem> items;
        private IEnumerable<ItemAttribute> attributes;
        private IEnumerable<AttributeType> correspondingAttributeTypes;
        private Dictionary<string, List<Guid>> attributeValueItemsMapper = new Dictionary<string, List<Guid>>();


        /// <summary>
        /// Konstruktor
        /// </summary>
        /// <param name="attributeTypeToConvert">Attributtyp, für den die Konvertierung stattfinden soll</param>
        public AttributeToItemWindow(AttributeType attributeTypeToConvert)
        {
            InitializeComponent();

            pnlWorking.Visibility = Visibility.Collapsed;

            attributeType = attributeTypeToConvert;

            RetrieveInformation();
        }


        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            if (meta.ItemTypeIds.ContainsKey(attributeType.TypeName))
            {
                if (MessageBox.Show("Ein gleichnamiger Item-Typ ist bereits vorhanden. Sie müssen den Namen ändern. Wollen Sie fortsetzen?", "Problem erkannt", MessageBoxButton.YesNo, MessageBoxImage.Warning, MessageBoxResult.No) == MessageBoxResult.No)
                {
                    this.DialogResult = false;
                    this.Close();
                }
            }

        }
        private void RetrieveInformation()
        {
            meta.FillAll();
            using (DataWrapper w = new DataWrapper())
            {
                itemTypes.AddRange(w.GetItemTypesByAllowedAttributeType(attributeType.TypeId));
                items = w.GetConfigurationItemsByTypes(itemTypes.Select(t => t.TypeId));
                txtNumItems.Content = items.Count().ToString();
                attributes = w.GetAttributesForAttributeType(attributeType.TypeId);
                correspondingAttributeTypes = w.GetAttributeTypesForCorrespondingValuesOfType(attributeType.TypeId);
            }

            string[] vals = attributes.Select(a => a.AttributeValue).Distinct().ToArray();
            for (int i = 0; i < vals.Length; i++)
            {
                attributeValueItemsMapper.Add(vals[i], new List<Guid>());
            }

            txtTypeName.Text = attributeType.TypeName;
            txtNumAttributes.Content = attributes.Count().ToString();
            txtNumNewItems.Content = vals.Length.ToString();
            lstItemTypes.ItemsSource = itemTypes;
            lstConnectionType.ItemsSource = meta.ConnectionTypes;
            lstCorrespondingAttributeTypes.ItemsSource = correspondingAttributeTypes;
            lstDirection_SelectionChanged(null, null);
            pgItemsCompleted.Maximum = 20 + vals.Count();
        }

        private void lstDirection_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (lstConnectionType == null)
                return;
            switch (lstDirection.SelectedValue.ToString())
            {
                case "oberhalb":
                    lstConnectionType.DisplayMemberPath = "ConnTypeName";
                    break;
                case "unterhalb":
                    lstConnectionType.DisplayMemberPath = "ConnTypeReverseName";
                    break;
                default:
                    throw new Exception("Falscher Wert ausgewählt.");
            }
            if (lstConnectionType.SelectedIndex == -1)
                lstConnectionType.SelectedIndex = 0;
        }

        private void btnStart_Click(object sender, RoutedEventArgs e)
        {
            btnStart.IsEnabled = false;
            btnCancel.IsEnabled = false;
            btnClose.IsEnabled = false;
            gridStep1.Visibility = Visibility.Collapsed;
            pnlWorking.Visibility = Visibility.Visible;

            txtResult.Text = "Erzeuge Item-Typ.\r\n";
            ItemTypeEditor ed = new ItemTypeEditor(attributeType.TypeId, attributeType.TypeName, "Neuen Item-Typ benennen", "Bezeichnung des neuen Item-Typs:", "#FFFFFF");
            if (ed.ShowDialog() == false)
                return;
            ItemType itemType = new ItemType() { TypeId = Guid.NewGuid(), TypeName = ed.NameText, TypeBackColor = ed.Color };

            bool newTypeIsUpperRule = lstDirection.SelectedValue.ToString().Equals("oberhalb", StringComparison.CurrentCultureIgnoreCase);

            ConnectionType connType = (ConnectionType)lstConnectionType.SelectedItem;

            List<AttributeType> attributeTypesToTransfer = new List<AttributeType>(lstCorrespondingAttributeTypes.SelectedItems.Count);

            using (DataWrapper w = new DataWrapper())
            {
                OperationResult or = w.CreateItemType(itemType);

                if (!or.Success)
                {
                    txtResult.Text += or.Message;
                    return;
                }

                if (lstCorrespondingAttributeTypes.SelectedItems.Count > 0)
                {
                    txtResult.Text = "Erzeuge Zuordnungen der Attributgruppen zum ItemTyp.\r\n";
                    List<Guid> groupIds = new List<Guid>(lstCorrespondingAttributeTypes.SelectedItems.Count);
                    foreach (AttributeType at in lstCorrespondingAttributeTypes.SelectedItems)
                    {
                        attributeTypesToTransfer.Add(at);
                        GroupAttributeTypeMapping gatm = w.GetGroupAttributeTypeMappingByAttributeType(at.TypeId);
                        if (!groupIds.Contains(gatm.GroupId))
                            groupIds.Add(gatm.GroupId);
                    }
                    foreach (Guid groupId in groupIds)
                    {
                        ItemTypeAttributeGroupMapping itagm = new ItemTypeAttributeGroupMapping() { GroupId = groupId, ItemTypeId = itemType.TypeId };
                        or = w.CreateItemTypeAttributeGroupMapping(itagm);
                        if (!or.Success)
                        {
                            txtResult.Text += or.Message;
                            return;
                        }
                    }
                }
            }

            BackgroundWorker worker = new BackgroundWorker(); // Arbeit wird in einen extra Thread ausgelagert, um die Darstellung des Fensters zu aktualisieren.
            worker.WorkerReportsProgress = true;
            worker.RunWorkerCompleted += Worker_RunWorkerCompleted;
            worker.ProgressChanged += Worker_ProgressChanged;
            worker.DoWork += delegate (object s, DoWorkEventArgs args)
            {
                OperationResult or;
                using (DataWrapper w = new DataWrapper())
                {
                    int ctr = 2;
                    worker.ReportProgress(ctr, "\r\nErzeuge Regeln.");

                    ItemType upperType, lowerType;


                    foreach (ItemType myType in itemTypes)
                    {
                        ctr++;
                        upperType = newTypeIsUpperRule ? itemType : myType;
                        lowerType = newTypeIsUpperRule ? myType : itemType;

                        ConnectionRule cr = new ConnectionRule() { RuleId = Guid.NewGuid(), ConnType = connType.ConnTypeId, ItemUpperType = upperType.TypeId, ItemLowerType = lowerType.TypeId, MaxConnectionsToLower = 9999, MaxConnectionsToUpper = 9999 };
                         or = w.CreateConnectionRule(cr);
                        if (or.Success)
                        {
                            worker.ReportProgress(ctr);
                        }
                        else
                        {
                            worker.ReportProgress(ctr, or.Message);
                            return;
                        }
                    }

                    IEnumerable<ConnectionRule> rules = newTypeIsUpperRule ? w.GetConnectionRulesByUpperItemType(itemType.TypeId) : w.GetConnectionRulesByLowerItemType(itemType.TypeId);

                    worker.ReportProgress(ctr, "\r\nErzeuge Configuration Items.");
                    foreach (string val in attributes.Select(a => a.AttributeValue.ToLower()).Distinct())
                    {
                        ctr++;
                        ConfigurationItem ci = new ConfigurationItem() { ItemId = Guid.NewGuid(), ItemName = val, ItemType = itemType.TypeId };
                        or = w.CreateConfigurationItem(ci);
                        if (or.Success)
                        {
                            ci = w.GetConfigurationItem(ci.ItemId);
                            worker.ReportProgress(ctr, "Transferiere Attribute.");
                            // Überführt die mitzunehmenden Attribut von einem Configuration Item auf das neue CI
                            Guid tmpItem = attributes.First(a => a.AttributeValue.Equals(val, StringComparison.CurrentCultureIgnoreCase)).ItemId; // holt ein Item mit dem angegebenen Attributwert, um dessen Attribute zu transferieren
                            foreach (AttributeType at in attributeTypesToTransfer)
                            {
                                ItemAttribute ia = w.GetAttributeForConfigurationItemByAttributeType(tmpItem, at.TypeId);
                                ItemAttribute newIa = new ItemAttribute() { AttributeId = Guid.NewGuid(), AttributeTypeId = at.TypeId, AttributeValue = ia.AttributeValue, ItemId = ci.ItemId };
                                or = w.CreateItemAttribute(newIa);
                                if (!or.Success)
                                {
                                    worker.ReportProgress(ctr, or.Message);
                                    return;
                                }
                            }
                            worker.ReportProgress(ctr, ci.ItemName);
                            // Erzeugt die Verbindungen zu den neuen Configuration Items
                            worker.ReportProgress(ctr, "Erzeuge Verbindungen.");
                            foreach (ItemAttribute ia in attributes.Where(a => a.AttributeValue.Equals(val, StringComparison.CurrentCultureIgnoreCase)))
                            {
                                ConfigurationItem connectedCI = items.Single(i => i.ItemId.Equals(ia.ItemId));
                                ConnectionRule cr = rules.Single(r => r.ConnType.Equals(connType.ConnTypeId) && r.ItemLowerType.Equals(newTypeIsUpperRule ? connectedCI.ItemType : ci.ItemType) && r.ItemUpperType.Equals((newTypeIsUpperRule ? ci.ItemType : connectedCI.ItemType)));
                                Connection conn = new Connection() { ConnId = Guid.NewGuid(), ConnType = connType.ConnTypeId, ConnUpperItem = newTypeIsUpperRule ? ci.ItemId : ia.ItemId, ConnLowerItem = newTypeIsUpperRule ? ia.ItemId : ci.ItemId, RuleId = cr.RuleId };
                                or = w.CreateConnection(conn);
                                if (!or.Success)
                                {
                                    worker.ReportProgress(ctr, or.Message);
                                    return;
                                }
                            }

                        }
                        else
                            worker.ReportProgress(ctr, or.Message);
                    }
                    ctr++;
                    worker.ReportProgress(ctr++, "\r\nLösche AttributTyp-Attributgruppen-Zuordnung und Attributtypen.");
                    or = w.DeleteGroupAttributeTypeMapping(w.GetGroupAttributeTypeMappingByAttributeType(attributeType.TypeId));
                    if (!or.Success)
                        worker.ReportProgress(ctr, or.Message);
                    or = w.DeleteAttributeType(attributeType);
                    if (!or.Success)
                        worker.ReportProgress(ctr, or.Message);
                }
            };
            worker.RunWorkerAsync();
        }


        private void Worker_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {
            if (e.UserState != null && !string.IsNullOrWhiteSpace(e.UserState.ToString()))
                txtResult.Text += e.UserState.ToString() + "\r\n";
            pgItemsCompleted.Value = e.ProgressPercentage;
        }

        private void Worker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            pgItemsCompleted.Visibility = Visibility.Collapsed;
            btnClose.IsEnabled = true;
        }

        private void btnClose_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = true;
            this.Close();
        }
    }
}
