using CmdbClient;
using CmdbClient.CmsService;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace CmdbGui
{
    /// <summary>
    /// Interaction logic for ExportImportWindow.xaml
    /// </summary>
    public partial class ExportImportWindow : Window
    {
        private MetaData md = new MetaData();
        private DataWrapper dWrapper = new DataWrapper();

        private ObservableCollection<ConnectionType> connectionTypesForItemType = new ObservableCollection<ConnectionType>();

        private List<string[]> lines;
        private const string regexCsvSeparator = "[\t;,|](?=(?:[^'\"]*'[^'\"]*')*[^'\"]*$)";
        private int importTab = -1;

        public ExportImportWindow()
        {
            InitializeComponent();

            // Importansicht herstellen
            spImportItemsSelectColums.Visibility = Visibility.Collapsed;
            spImportItemsResult.Visibility = Visibility.Collapsed;
            spImportConnectionsSelectColums.Visibility = Visibility.Collapsed;
            spImportConnectionsResult.Visibility = Visibility.Collapsed;
            spImportLinksSelectColums.Visibility = Visibility.Collapsed;
            spImportLinksResult.Visibility = Visibility.Collapsed;
            spImportResponsibilityResult.Visibility = Visibility.Collapsed;
            lstExportConnType.SelectionMode = SelectionMode.Extended;
            pgItemsCompleted.Visibility = Visibility.Collapsed;

            lstImportItemType.ItemsSource = md.ItemTypes;
            lstExportConnType.ItemsSource = md.ConnectionTypes;
            lstImportUpperItemType.ItemsSource = md.ItemTypes;
            lstImportLinkItemType.ItemsSource = md.ItemTypes;
            lstImportResponsibilityItemType.ItemsSource = md.ItemTypes;
            lstImportConnectionType.ItemsSource = connectionTypesForItemType;

            md.FillAll();

            SetStartButtonForList(lstImportItemType, btnStartImportItems);
            SetStartButtonForList(lstImportUpperItemType, btnStartImportConnections);
            SetStartButtonForList(lstImportLinkItemType, btnStartImportLinks);
            SetStartButtonForList(lstImportResponsibilityItemType, btnImportResponsiblity);
        }

        private void SetStartButtonForList(ComboBox list, Button button)
        {
            try
            {
                list.SelectedIndex = 0;
                button.IsEnabled = true;
            }
            catch (Exception)
            {
                button.IsEnabled = false;
            }
        }

        private void btnStartExport_Click(object sender, RoutedEventArgs e)
        {
            if (lstExportConnType.SelectedItems.Count == 0)
                return;
            List<Guid> connTypes = new List<Guid>(lstExportConnType.SelectedItems.Count);
            for (int i = 0; i < lstExportConnType.SelectedItems.Count; i++)
            {
                connTypes.Add(((ConnectionType)lstExportConnType.SelectedItems[i]).ConnTypeId);
            }
            //GraphMLhelper h = new GraphMLhelper();
            //System.Xml.XmlDocument doc = h.GraphMLExportMeta(connTypes);
            //doc.Save(@"c:\tmp\tmp.graphml");
        }
        #region ImportItems

        private void btnStartImportItems_Click(object sender, RoutedEventArgs e)
        {
            if (ReadFile(chkImportConnectionsHasHeadline.IsChecked) == false)
                return;
            grImportItems.RowDefinitions.Clear();
            grImportItems.RowDefinitions.Add(new RowDefinition());

            WpfHelper.placeGridContent(grImportItems, WpfHelper.createTextBlock("Spalte", new Thickness(5)), 0, 0);
            WpfHelper.placeGridContent(grImportItems, WpfHelper.createTextBlock("Bedeutung", new Thickness(5)), 0, 2);

            string[] captions = new string[this.lines[0].Length];
            System.Data.DataTable t = new System.Data.DataTable();
            t.Columns.Add("TargetId");
            t.Columns.Add("TargetName");
            t.Rows.Add("-ignore-", "(Ignorieren)");
            t.Rows.Add("-name-", "Item-Name");

            IEnumerable<AttributeType> allowedAttributeTypes = dWrapper.GetAttributeTypesForItemType((Guid)lstImportItemType.SelectedValue);

            foreach (AttributeType attr in allowedAttributeTypes)
            {
                t.Rows.Add(attr.TypeId, attr.TypeName);
            }

            for (int i = 0; i < this.lines[0].Length; i++)
            {
                captions[i] = (chkImportItemsHasHeadline.IsChecked == true ? this.lines[0][i] : string.Format("Spalte {0}", i)).Trim();
                if (captions[i] == string.Empty)
                    captions[i] = string.Format("Spalte {0}", i);
                grImportItems.RowDefinitions.Add(new RowDefinition());
                WpfHelper.placeGridContent(grImportItems, WpfHelper.createTextBlock(captions[i], new Thickness(5)), i + 1, 0);
                ComboBox cb = new ComboBox()
                {
                    Name = string.Format("cbColumn{0}", i),
                    DisplayMemberPath = "[TargetName]",
                    SelectedValuePath = "[TargetId]",
                    ItemsSource = t.Rows,
                    SelectedIndex = 0,
                    Margin = new Thickness(5)
                };
                // Namen oder Attributtyp suchen
                if (captions[i].Equals("name", StringComparison.CurrentCultureIgnoreCase) || captions[i].Equals("itemname", StringComparison.CurrentCultureIgnoreCase) ||
                    captions[i].Equals("item-name", StringComparison.CurrentCultureIgnoreCase) || captions[i].Equals("configuration item", StringComparison.CurrentCultureIgnoreCase))
                    cb.SelectedValue = "-name-";
                else
                {
                    AttributeType type = allowedAttributeTypes.SingleOrDefault(a => a.TypeName.Equals(captions[i], StringComparison.CurrentCultureIgnoreCase));
                    if (type != null)
                    {
                        cb.SelectedValue = type.TypeId;
                    }
                }
                WpfHelper.placeGridContent(grImportItems, cb, i + 1, 3);
            }
            spImportItemsStart.Visibility = Visibility.Collapsed;
            spImportItemsSelectColums.Visibility = Visibility.Visible;
        }

        private void btnImportItems_Click(object sender, RoutedEventArgs e)
        {
            int nameColumn = -1; // Item-Name bereits gesetzt?
            int startvalue = (chkImportItemsHasHeadline.IsChecked == true ? 1 : 0);
            string[] targets = new string[this.lines[0].Length];
            string policy = ((ComboBoxItem)lstImportedItemAlreadyExistent.SelectedItem).Tag.ToString();
            int ctr = 0;
            Guid itemTypeId = Guid.Parse(lstImportItemType.SelectedValue.ToString());
            foreach (ComboBox cb in WpfHelper.GetChildrenOfType<ComboBox>(grImportItems))
            {
                if (cb.SelectedValue.Equals("-name-"))
                {
                    if (nameColumn == -1)
                    {
                        nameColumn = int.Parse(cb.Name.Remove(0, 8));
                        targets[ctr++] = "-ignore-";
                    }
                    else
                    {
                        MessageBox.Show("Sie können den Namen nur einmal verwenden");
                        return;
                    }
                }
                else
                    targets[ctr++] = cb.SelectedValue.ToString();
            }
            if (nameColumn == -1) // keine Spalte für den Item-Namen gefunden
            {
                MessageBox.Show("Sie müssen eine Spalte für den Namen des Items angeben");
                return;
            }

            spImportItemsSelectColums.Visibility = System.Windows.Visibility.Collapsed;
            spImportItemsResult.Visibility = System.Windows.Visibility.Visible;
            btnCancelImportItems.IsEnabled = false;
            pgItemsCompleted.Visibility = Visibility.Visible;

            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker(); // Arbeit wird in einen extra Thread ausgelagert, um die Darstellung des Fensters zu aktualisieren.
            worker.WorkerReportsProgress = true;
            worker.RunWorkerCompleted += ItemWorker_RunWorkerCompleted;
            worker.ProgressChanged += ItemWorker_ProgressChanged;
            worker.DoWork += delegate (object s, System.ComponentModel.DoWorkEventArgs args)
            {

                string userName = System.Security.Principal.WindowsIdentity.GetCurrent().Name; // Aktueller Benutzername
                List<string> names = new List<string>();



                for (int i = startvalue; i < this.lines.Count; i++)
                {
                    // Prozentzahl für den Fortschritt ermitteln
                    int perc = Convert.ToInt32(100 * i / lines.Count);
                    // Neue Zeile schreiben
                    worker.ReportProgress(perc, string.Format("-------------\r\nBearbeite Zeile {0}", i));
                    string itemName = lines[i][nameColumn].Trim();
                    if (itemName.Equals(string.Empty)) // Item-Name muss gesetzt und ein-eindeutig sein.
                    {
                        worker.ReportProgress(perc, "Der Name des Items darf nicht leer bleiben. Zeile wird ignoriert.");
                        continue;
                    }
                    else if (names.Contains(itemName.ToLower()))
                    {
                        worker.ReportProgress(perc, "Duplikat gefunden");
                        continue;
                    }
                    names.Add(itemName.ToLower());

                    Guid itemId = Guid.NewGuid();
                    ConfigurationItem existingItem = dWrapper.GetConfigurationItemByTypeIdAndName(itemTypeId, itemName); // Überprüfen, ob es bereits ein Objekt dieses Typs mit diesem Namen gibt.
                    if (existingItem != null)
                    {
                        worker.ReportProgress(perc, string.Format("Item mit der ID {0} gefunden", existingItem.ItemId));
                        switch (policy) // Vorhandene Objekte wahlweise ignorieren oder aktualisieren
                        {
                            case "ignore":
                                worker.ReportProgress(perc, "Zeile wird ignoriert");
                                continue;
                            case "update":
                                itemId = existingItem.ItemId;
                                break;
                            default:
                                worker.ReportProgress(perc, "Fatal Error");
                                return;
                        }
                    }
                    else
                    {
                        LogLine(worker, perc, string.Format("Neues Item mit der ID {0} wurde angelegt.", itemId),
                            dWrapper.CreateConfigurationItem(new ConfigurationItem() { ItemId = itemId, ItemName = lines[i][nameColumn], ItemType = itemTypeId }));
                    }
                    // Attribute anlegen
                    for (int j = 0; j < lines[i].Length; j++)
                    {
                        if (j >= lines[0].Length)
                        {
                            worker.ReportProgress(perc, "Zu wenige Spalten in dieser Zeile.");
                            break;
                        }
                        if (targets[j].Equals("-ignore-"))
                            continue;
                        string attval = lines[i][j].Trim();
                        if (string.IsNullOrEmpty(attval)) // Leere Spalten nicht abarbeiten (keine Löschung bislang über Import)
                        {
                            worker.ReportProgress(perc, string.Format("Spalte {0} enthielt keinen Wert und wird ignoriert", j));
                            continue;
                        }
                        ItemAttribute attr = existingItem == null ? null : dWrapper.GetAttributeForConfigurationItemByAttributeType(itemId, Guid.Parse(targets[j])); // Gibt es das Attribut schon?
                        if (existingItem == null || attr == null) // Attribut neu anlegen
                        {
                            if (!attval.Equals("{-delete-}", StringComparison.CurrentCulture))
                            {
                                try
                                {
                                    ItemAttribute a = new ItemAttribute() { AttributeId = Guid.NewGuid(), ItemId = itemId, AttributeTypeId = Guid.Parse(targets[j]), AttributeValue = attval };
                                    LogLine(worker, perc, string.Format("Attribute mit der ID {0} wurde neu angelegt.", a.AttributeId), dWrapper.CreateItemAttribute(a));
                                }
                                catch (Exception ex)
                                {
                                    worker.ReportProgress(perc, ex.Message);
                                }
                            }
                        }
                        else // Attribut aktualisieren, falls ein anderer Wert enthalten ist, oder löschen.
                        {
                            string OldValue = attr.AttributeValue, AttId = attr.AttributeId.ToString();
                            if (attval.Equals("{-delete-}", StringComparison.CurrentCulture))
                            {
                                try
                                {
                                    OperationResult or = dWrapper.DeleteItemAttribute(attr);
                                    if (or.Success)
                                        worker.ReportProgress(perc, string.Format("Attribut {0} mit Wert {1} wurde gelöscht.", AttId, OldValue));
                                    else
                                        worker.ReportProgress(perc, or.Message);
                                }
                                catch (Exception ex)
                                {
                                    worker.ReportProgress(perc, ex.Message);
                                }
                            }
                            else if (!attval.Equals(attr.AttributeValue, StringComparison.CurrentCulture))
                            {
                                attr.AttributeValue = attval;
                                LogLine(worker, perc, string.Format("Attribut {0} wurde von {1} zu {2} aktualisiert.", AttId, OldValue, attval), dWrapper.UpdateItemAttribute(attr));
                            }
                        }
                    }
                }
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Schreibt eine Zeile für einen Worker
        /// </summary>
        /// <param name="worker">Der Worker, für den geschrieben werden soll</param>
        /// <param name="perc">Prozentsatz, der bereits erledigt ist</param>
        /// <param name="SuccessMessage">Nachricht, die geschrieben werden soll, falls die Operation erfolgreich war</param>
        /// <param name="or">OperationResult, das den Erfolg und bei Misserfolg auch die Alternative Nachricht enthält</param>
        private static void LogLine(BackgroundWorker worker, int perc, string SuccessMessage, OperationResult or)
        {
            if (or.Success)
                worker.ReportProgress(perc, SuccessMessage);
            else
                worker.ReportProgress(perc, or.Message);
        }

        private void ItemWorker_ProgressChanged(object sender, System.ComponentModel.ProgressChangedEventArgs e)
        {
            pgItemsCompleted.Value = e.ProgressPercentage; // Fortschrittsbalken aktualisieren und Text anhängen.
            if (e.UserState != null)
                txtImportItemsResult.Text += e.UserState.ToString() + "\r\n";
        }

        private void ItemWorker_RunWorkerCompleted(object sender, System.ComponentModel.RunWorkerCompletedEventArgs e)
        {
            btnCancelImportItems.IsEnabled = true; // Beenden-Knopf aktivieren
            pgItemsCompleted.Visibility = Visibility.Collapsed;
        }

        private void btnCancelImportItems_Click(object sender, RoutedEventArgs e)
        {
            this.lines = null;
            spImportItemsStart.Visibility = System.Windows.Visibility.Visible;
            spImportItemsSelectColums.Visibility = System.Windows.Visibility.Collapsed;
            spImportItemsResult.Visibility = System.Windows.Visibility.Collapsed;
            txtImportItemsResult.Text = string.Empty;
            grImportItems.Children.Clear();
            grImportItems.RowDefinitions.Clear();
        }

        #endregion

        #region ImportConnections
        private void lstImportUpperItemType_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (lstImportUpperItemType.SelectedValue == null)
                return;
            connectionTypesForItemType.Clear();
            foreach (ConnectionType ct in dWrapper.GetAllowedDownwardConnnectionTypesForItemType((Guid)lstImportUpperItemType.SelectedValue))
            {
                connectionTypesForItemType.Add(ct);
            }
            if (connectionTypesForItemType.Count() == 0)
            {
                lstImportConnectionType.IsEnabled = false;
            }
            else
            {
                lstImportConnectionType.IsEnabled = true;
                lstImportConnectionType.SelectedIndex = 0;
            }
            lstImportConnectionType_SelectionChanged(sender, e);
        }

        private void lstImportConnectionType_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            lstImportLowerItemType.ItemsSource = null;
            if (lstImportConnectionType.IsEnabled && lstImportConnectionType.SelectedIndex >= 0)
            {
                IEnumerable<ItemType> types = dWrapper.GetLowerItemTypeForUpperItemTypeAndConnectionType((Guid)lstImportUpperItemType.SelectedValue, (Guid)lstImportConnectionType.SelectedValue);
                if (types.Count() == 0)
                {
                    lstImportLowerItemType.Items.Clear();
                    lstImportLowerItemType.IsEnabled = false;
                }
                else
                {
                    lstImportLowerItemType.IsEnabled = true;
                    lstImportLowerItemType.ItemsSource = types;
                    lstImportLowerItemType.SelectedIndex = 0;
                }
            }
            else
            {
                lstImportLowerItemType.Items.Clear();
                lstImportLowerItemType.IsEnabled = false;
            }
            btnStartImportConnections.IsEnabled = lstImportLowerItemType.IsEnabled;
        }

        private class ColumnType
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }

        private void btnStartImportConnections_Click(object sender, RoutedEventArgs e)
        {
            if (ReadFile(chkImportConnectionsHasHeadline.IsChecked) == false)
                return;

            string[] captions = new string[this.lines[0].Length];


            List<ColumnType> t = new List<ColumnType>();

            for (int i = 0; i < this.lines[0].Length; i++)
            {
                captions[i] = (chkImportConnectionsHasHeadline.IsChecked == true ? this.lines[0][i] : string.Format("Spalte {0}", i)).Trim();
                if (captions[i] == string.Empty)
                    captions[i] = string.Format("Spalte {0}", i);
                t.Add(new ColumnType() { Id = i, Name = captions[i] });
            }
            WpfHelper.fillIdNameComboBox(lstImportConnectionsLowerColumn, t);
            WpfHelper.fillIdNameComboBox(lstImportConnectionsUpperColumn, t);
            txtLowerItemType.Text = lstImportLowerItemType.Text;
            txtUpperItemType.Text = lstImportUpperItemType.Text;
            spImportConnectionsStart.Visibility = System.Windows.Visibility.Collapsed;
            spImportConnectionsSelectColums.Visibility = System.Windows.Visibility.Visible;
        }

        private bool ReadFile(bool? fileHasHeadLine)
        {
            this.lines = new List<string[]>();
            Microsoft.Win32.OpenFileDialog dlg = new Microsoft.Win32.OpenFileDialog();
            dlg.Filter = "CSV-Dateien|*.csv|Excel-Dateien|*.xlsx";
            dlg.CheckPathExists = true;
            dlg.Multiselect = false;
            dlg.CheckFileExists = true;
            if (dlg.ShowDialog() == true)
            {
                try
                {
                    string ext = System.IO.Path.GetExtension(dlg.FileName).Substring(1).ToLower();
                    switch (ext)
                    {
                        case "csv":
                            using (System.IO.StreamReader reader = new System.IO.StreamReader(dlg.OpenFile()))
                            {
                                while (reader.Peek() >= 0)
                                {
                                    string line = reader.ReadLine();
                                    this.lines.Add(System.Text.RegularExpressions.Regex.Split(line, regexCsvSeparator));
                                }
                                reader.Close();
                            }
                            break;
                        case "xlsx":
                            lines = CmdbHelpers.ExportHelper.ExcelHelper.GetLinesFromExcelDocument(dlg.OpenFile());
                            break;
                        default:
                            MessageBox.Show("Falscher Dateityp", "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                            return false;
                    }

                    if (this.lines.Count < (fileHasHeadLine == true ? 2 : 1))
                    {
                        MessageBox.Show("Die Datei enthält keine Datenzeilen", "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                        return false;
                    }

                    return true;
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                    return false;
                }
            }
            else
                return false;
        }

        private void btnImportConnections_Click(object sender, RoutedEventArgs e)
        {

            int upperNameColumn = Convert.ToInt32(lstImportConnectionsUpperColumn.SelectedValue),
                lowerNameColumn = Convert.ToInt32(lstImportConnectionsLowerColumn.SelectedValue); // Beide Item-Namen bereits gesetzt?
            int startvalue = (chkImportConnectionsHasHeadline.IsChecked == true ? 1 : 0);
            Guid upperItemType = (Guid)lstImportUpperItemType.SelectedValue,
                lowerItemType = (Guid)lstImportLowerItemType.SelectedValue,
                connType = (Guid)lstImportConnectionType.SelectedValue;

            if (upperNameColumn == -1 || lowerNameColumn == -1 || upperNameColumn == lowerNameColumn) // keine Spalte für den Item-Namen gefunden
            {
                MessageBox.Show("Sie müssen jeweils eine eigene Spalte für den Namen des oberen bzw. des unteren Items angeben.");
                return;
            }

            spImportConnectionsSelectColums.Visibility = System.Windows.Visibility.Collapsed;
            spImportConnectionsResult.Visibility = System.Windows.Visibility.Visible;
            btnCancelImportConnections.IsEnabled = false;
            pgItemsCompleted.Visibility = Visibility.Visible;

            ConnectionRule crr = dWrapper.GetConnectionRuleByContent(upperItemType, connType, lowerItemType);
            if (crr == null)
            {
                MessageBox.Show("Keine Verbindungsregel für die angegebene Konstellation gefunden");
                return;
            }

            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker(); // Arbeit wird in einen extra Thread ausgelagert, um die Darstellung des Fensters zu aktualisieren.
            worker.WorkerReportsProgress = true;
            worker.RunWorkerCompleted += ConnectionWorker_RunWorkerCompleted;
            worker.ProgressChanged += ConnectionWorker_ProgressChanged;
            worker.DoWork += delegate (object s, System.ComponentModel.DoWorkEventArgs args)
            {
                string userName = System.Security.Principal.WindowsIdentity.GetCurrent().Name; // Aktueller Benutzername

                for (int i = startvalue; i < this.lines.Count; i++)
                {
                    // Prozentzahl für den Fortschritt ermitteln
                    int perc = Convert.ToInt32(100 * i / lines.Count);
                    // Neue Zeile schreiben
                    worker.ReportProgress(perc, string.Format("-------------\r\nBearbeite Zeile {0}", i));

                    // Überprüfen, ob die Namen gesetzt sind und als Objekte auch existieren.
                    string upperItemName = lines[i][upperNameColumn].Trim(),
                        lowerItemName = lines[i][lowerNameColumn].Trim();
                    if (string.IsNullOrEmpty(upperItemName))
                    {
                        worker.ReportProgress(perc, "Der Name des oberen Items darf nicht leer bleiben. Zeile wird ignoriert.");
                        continue;
                    }
                    if (string.IsNullOrEmpty(lowerItemName))
                    {
                        worker.ReportProgress(perc, "Der Name des unteren Items darf nicht leer bleiben. Zeile wird ignoriert.");
                        continue;
                    }

                    ConfigurationItem upperItem = dWrapper.GetConfigurationItemByTypeIdAndName(upperItemType, upperItemName);
                    if (upperItem == null)
                    {
                        worker.ReportProgress(perc, string.Format("Kein oberes Item mit dem Namen {0} gefunden. Zeile wird ignoriert.", upperItemName));
                        continue;
                    }

                    ConfigurationItem lowerItem = dWrapper.GetConfigurationItemByTypeIdAndName(lowerItemType, lowerItemName);
                    if (lowerItem == null)
                    {
                        worker.ReportProgress(perc, string.Format("Kein unteres Item mit dem Namen {0} gefunden. Zeile wird ignoriert.", lowerItemName));
                        continue;
                    }

                    // Prüfen, ob Verbindung bereits existiert.
                    if (dWrapper.GetConnectionByContent(upperItem.ItemId, connType, lowerItem.ItemId) != null)
                    {
                        worker.ReportProgress(perc, "Diese Verbindung existiert bereits. Zeile wird ignoriert.");
                        continue;
                    }

                    Guid connId = Guid.NewGuid();
                    try
                    {
                        LogLine(worker, perc, string.Format("Neue Verbindung mit der ID {0} erzeugt.", connId), dWrapper.CreateConnection(
                            new Connection() { ConnId = connId, ConnType = connType, ConnUpperItem = upperItem.ItemId, ConnLowerItem = lowerItem.ItemId, RuleId = crr.RuleId }));
                    }
                    catch (Exception ex)
                    {
                        worker.ReportProgress(perc, ex.Message);
                    }
                }
            };
            worker.RunWorkerAsync();
        }

        private void ConnectionWorker_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {
            pgItemsCompleted.Value = e.ProgressPercentage; // Fortschrittsbalken aktualisieren und Text anhängen.
            if (e.UserState != null)
                txtImportConnectionsResult.Text += e.UserState.ToString() + "\r\n";
        }

        private void ConnectionWorker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            btnCancelImportConnections.IsEnabled = true;
            pgItemsCompleted.Visibility = Visibility.Collapsed;
        }

        private void btnCancelImportConnections_Click(object sender, RoutedEventArgs e)
        {
            spImportConnectionsStart.Visibility = Visibility.Visible;
            spImportConnectionsSelectColums.Visibility = Visibility.Collapsed;
            spImportConnectionsResult.Visibility = Visibility.Collapsed;
            txtImportConnectionsResult.Text = string.Empty;
            lstImportConnectionsLowerColumn.ItemsSource = null;
            lstImportConnectionsLowerColumn.Items.Clear();
            lstImportConnectionsUpperColumn.ItemsSource = null;
            lstImportConnectionsUpperColumn.Items.Clear();
        }
        #endregion

        private void tcImport_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (e.OriginalSource == tcImport)
            {
                if (importTab != -1 && pgItemsCompleted.Visibility == Visibility.Visible) // Tab-Wechsel zurückdrehen, falls gerade ein Import läuft
                {
                    e.Handled = true;
                    tcImport.SelectedIndex = importTab;
                }
                else
                    importTab = tcImport.SelectedIndex;

            }
        }

        #region ImportLinks

        private void btnStartImportLinks_Click(object sender, RoutedEventArgs e)
        {
            if (ReadFile(chkImportConnectionsHasHeadline.IsChecked) == false)
                return;

            string[] captions = new string[this.lines[0].Length];
            System.Data.DataTable t = new System.Data.DataTable();
            t.Columns.Add("Id");
            t.Columns.Add("Name");

            for (int i = 0; i < this.lines[0].Length; i++)
            {
                captions[i] = (chkImportConnectionsHasHeadline.IsChecked == true ? this.lines[0][i] : string.Format("Spalte {0}", i)).Trim();
                if (captions[i] == string.Empty)
                    captions[i] = string.Format("Spalte {0}", i);
                t.Rows.Add(i, captions[i]);
            }
            WpfHelper.fillIdNameComboBox(lstImportLinksItemNameColumn, t.Rows);
            WpfHelper.fillIdNameComboBox(lstImportLinksUriColumn, t.Rows);
            WpfHelper.fillIdNameComboBox(lstImportLinksDescColumn, t.Rows);

            spImportLinkssStart.Visibility = System.Windows.Visibility.Collapsed;
            spImportLinksSelectColums.Visibility = System.Windows.Visibility.Visible;
        }


        private void btnImportLinks_Click(object sender, RoutedEventArgs e)
        {
            int ItemColumn = Convert.ToInt32(lstImportLinksItemNameColumn.SelectedValue),
                UriColumn = Convert.ToInt32(lstImportLinksUriColumn.SelectedValue),
                DescColumn = Convert.ToInt32(lstImportLinksDescColumn.SelectedValue);
            int startvalue = (chkImportConnectionsHasHeadline.IsChecked == true ? 1 : 0);
            Guid itemType = (Guid)lstImportLinkItemType.SelectedValue;
            if (ItemColumn == DescColumn || ItemColumn == UriColumn)
            {
                MessageBox.Show("Der Name darf nicht als Link oder als Beschreibung verwendet werden. Bitte wählen Sie unterschiedliche Spalten aus.", "Fehler");
                return;
            }
            spImportLinksSelectColums.Visibility = System.Windows.Visibility.Collapsed;
            spImportLinksResult.Visibility = System.Windows.Visibility.Visible;
            btnCancelImportLinkss.IsEnabled = false;
            pgItemsCompleted.Visibility = Visibility.Visible;

            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker(); // Arbeit wird in einen extra Thread ausgelagert, um die Darstellung des Fensters zu aktualisieren.
            worker.WorkerReportsProgress = true;
            worker.RunWorkerCompleted += LinkWorker_RunWorkerCompleted;
            worker.ProgressChanged += LinkWorker_ProgressChanged;
            worker.DoWork += delegate (object s, System.ComponentModel.DoWorkEventArgs args)
            {
                string userName = System.Security.Principal.WindowsIdentity.GetCurrent().Name; // Aktueller Benutzername

                for (int i = startvalue; i < this.lines.Count; i++)
                {
                    // Prozentzahl für den Fortschritt ermitteln
                    int perc = Convert.ToInt32(100 * i / lines.Count);
                    // Neue Zeile schreiben
                    worker.ReportProgress(perc, string.Format("-------------\r\nBearbeite Zeile {0}", i));
                    string ItemName = lines[i][ItemColumn].Trim(),
                        UriValue = lines[i][UriColumn].Trim(),
                        Description = lines[i][DescColumn].Trim();
                    if (string.IsNullOrEmpty(ItemName))
                    {
                        worker.ReportProgress(perc, "Der Name des Items darf nicht leer bleiben. Zeile wird ignoriert.");
                        continue;
                    }
                    if (string.IsNullOrEmpty(UriValue))
                    {
                        worker.ReportProgress(perc, "Der Link darf nicht leer bleiben. Zeile wird ignoriert.");
                        continue;
                    }
                    if (!Uri.IsWellFormedUriString(UriValue, UriKind.Absolute))
                    {
                        worker.ReportProgress(perc, "Der Link entspricht nicht den Vorgaben für einen Hyperlink. Zeile wird ignoriert.");
                        continue;
                    }
                    if (string.IsNullOrEmpty(Description))
                    {
                        worker.ReportProgress(perc, "Die Beschreibung darf nicht leer bleiben. Stattdessen wurde die URI verwendet.");
                        Description = UriValue;
                    }

                    ConfigurationItem item = dWrapper.GetConfigurationItemByTypeIdAndName(itemType, ItemName);
                    if (item == null)
                    {
                        worker.ReportProgress(perc, string.Format("Kein Item mit dem Namen {0} gefunden. Zeile wird ignoriert.", ItemName));
                        continue;
                    }

                    foreach (ItemLink link in dWrapper.GetLinksForConfigurationItem(item.ItemId))
                    {
                        if (link.LinkURI.Equals(UriValue, StringComparison.CurrentCultureIgnoreCase))
                        {
                            worker.ReportProgress(perc, string.Format("Der Link {0} ist bereits im Item {1} enthalten. Die Zeile wird ignoriert.", UriValue, item.ItemName));
                            continue;
                        }
                    }
                    ItemLink il = new ItemLink() { LinkId = Guid.NewGuid(), ItemId = item.ItemId, LinkURI = UriValue, LinkDescription = Description };
                    LogLine(worker, perc, string.Format("Der Link wurde mit der ID {0} hinzugefügt.", il.LinkId), dWrapper.CreateLink(il));
                }

            };
            worker.RunWorkerAsync();

        }

        private void LinkWorker_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {
            pgItemsCompleted.Value = e.ProgressPercentage; // Fortschrittsbalken aktualisieren und Text anhängen.
            if (e.UserState != null)
                txtImportLinksResult.Text += e.UserState.ToString() + "\r\n";
        }

        private void LinkWorker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            btnCancelImportLinkss.IsEnabled = true;
            pgItemsCompleted.Visibility = Visibility.Collapsed;
        }

        private void btnCancelImportLinks_Click(object sender, RoutedEventArgs e)
        {
            spImportLinkssStart.Visibility = Visibility.Visible;
            spImportLinksSelectColums.Visibility = Visibility.Collapsed;
            spImportLinksResult.Visibility = Visibility.Collapsed;
            txtImportLinksResult.Text = string.Empty;
            lstImportLinksDescColumn.ItemsSource = null;
            lstImportLinksDescColumn.Items.Clear();
            lstImportLinksItemNameColumn.ItemsSource = null;
            lstImportLinksItemNameColumn.Items.Clear();
        }

        #endregion

        #region ImportResponsibility

        private void btnCancelImportResponsiblity_Click(object sender, RoutedEventArgs e)
        {
            spImportResponsibilitiesStart.Visibility = Visibility.Visible;
            spImportResponsibilityResult.Visibility = Visibility.Collapsed;
            txtImportResponsiblityResult.Text = string.Empty;
        }
        private void btnImportResponsiblity_Click(object sender, RoutedEventArgs e)
        {
            if (ReadFile(chkImportConnectionsHasHeadline.IsChecked) == false)
                return;
            int startvalue = (chkImportConnectionsHasHeadline.IsChecked == true ? 1 : 0);
            Guid itemType = (Guid)lstImportResponsibilityItemType.SelectedValue;

            spImportResponsibilitiesStart.Visibility = System.Windows.Visibility.Collapsed;
            spImportResponsibilityResult.Visibility = System.Windows.Visibility.Visible;
            btnCancelImportResponsiblity.IsEnabled = false;
            pgItemsCompleted.Visibility = Visibility.Visible;

            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker(); // Arbeit wird in einen extra Thread ausgelagert, um die Darstellung des Fensters zu aktualisieren.
            worker.WorkerReportsProgress = true;
            worker.RunWorkerCompleted += ResponsibilityWorker_RunWorkerCompleted;
            worker.ProgressChanged += ResponsibilityWorker_ProgressChanged;
            worker.DoWork += delegate (object s, System.ComponentModel.DoWorkEventArgs args)
            {
                for (int i = startvalue; i < this.lines.Count; i++)
                {
                        // Prozentzahl für den Fortschritt ermitteln
                        int perc = Convert.ToInt32(100 * i / lines.Count);
                        // Neue Zeile schreiben
                        worker.ReportProgress(perc, string.Format("-------------\r\nBearbeite Zeile {0}", i));
                    string ItemName = lines[i][0].Trim(),
                        UsernameToAdd = lines[i][1].Trim();
                    if (string.IsNullOrEmpty(ItemName))
                    {
                        worker.ReportProgress(perc, "Der Name des Items darf nicht leer bleiben. Zeile wird ignoriert.");
                        continue;
                    }
                    if (string.IsNullOrEmpty(UsernameToAdd))
                    {
                        worker.ReportProgress(perc, "Der Benutzername darf nicht leer bleiben. Zeile wird ignoriert.");
                        continue;
                    }

                    System.Security.Principal.NTAccount id = new System.Security.Principal.NTAccount(UsernameToAdd);
                    try
                    {
                        id.Translate(typeof(System.Security.Principal.SecurityIdentifier));
                    }
                    catch
                    {
                        worker.ReportProgress(perc, string.Format("Keinen Benutzer mit dem Namen {0} gefunden. Zeile wird ignoriert.", UsernameToAdd));
                        continue;
                    }

                    ConfigurationItem item = dWrapper.GetConfigurationItemByTypeIdAndName(itemType, ItemName);
                    if (item == null)
                    {
                        worker.ReportProgress(perc, string.Format("Kein Item mit dem Namen {0} gefunden. Zeile wird ignoriert.", ItemName));
                        continue;
                    }

                        /*CMDBDataSet.ResponsibilityRow rr = dWrapper..Responsibility_SelectOneResponsibleToken(item.ItemId, UsernameToAdd);

                        if (rr != null)
                        {
                            worker.ReportProgress(perc, string.Format("Die Verantwortung des Benutzers {0} für das Item {1} besteht bereits. Die Zeile wird ignoriert.", UsernameToAdd, item.ItemName));
                            continue;
                        }
                        Guid linkId = Guid.NewGuid();
                        da.TakeResponsibility(item.ItemId, UsernameToAdd);
                        worker.ReportProgress(perc, string.Format("Die Verantwortung für das Item {0} wurde hinzugefügt.", item.ItemName));*/
                }

            };
            worker.RunWorkerAsync();
        }

        private void ResponsibilityWorker_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {
            pgItemsCompleted.Value = e.ProgressPercentage; // Fortschrittsbalken aktualisieren und Text anhängen.
            if (e.UserState != null)
                txtImportResponsiblityResult.Text += e.UserState.ToString() + "\r\n";
        }

        private void ResponsibilityWorker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            btnCancelImportResponsiblity.IsEnabled = true;
            pgItemsCompleted.Visibility = Visibility.Collapsed;
        }

        #endregion
    }
}
