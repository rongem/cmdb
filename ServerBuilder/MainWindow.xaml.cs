using CmdbClient;
using CmdbClient.CmsService;
using CmdbHelpers.ExportHelper;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;

namespace ServerBuilder
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private MetaData meta = new MetaData();

        private ObservableCollection<ConfigurationItem> serverHardware = new ObservableCollection<ConfigurationItem>();

        public MainWindow()
        {
            InitializeComponent();

            meta.FillAll();

            GetServerHardware();
            lstHardware.ItemsSource = serverHardware;

            if (lstHardware.Items.Count > 0)
                lstHardware.SelectedIndex = 0;
        }

        private void GetServerHardware()
        {
            serverHardware.Clear();

            Guid serverHardwareTypeId = meta.ItemTypeIds["Server-Hardware"];

            Search search = new Search() { ItemType = serverHardwareTypeId };

            using (DataWrapper w = new DataWrapper())
            {
                IEnumerable<ConnectionRule> rules = w.GetConnectionRulesByLowerItemType(serverHardwareTypeId);

                ConnectionRule serverToHardware = rules.Single(r => r.ItemUpperType == meta.ItemTypeIds["Server"] && r.ItemLowerType == serverHardwareTypeId);

                search.ConnectionsToUpper = new Search.SearchConnection[] { new Search.SearchConnection() { ConnectionType = serverToHardware.ConnType, Count = "0" } };

                search.Attributes = new Search.SearchAttribute[]
                {
                    new Search.SearchAttribute() { AttributeTypeId = meta.AttributeTypeIds["Status"], AttributeValue = "!Ausgesondert" },
                    new Search.SearchAttribute() { AttributeTypeId = meta.AttributeTypeIds["Status"], AttributeValue = "!Abgeschaltet" },
                    new Search.SearchAttribute() { AttributeTypeId = meta.AttributeTypeIds["Verwaltet von"], AttributeValue = string.Empty },
                };

                foreach (ConfigurationItem item in w.SearchConfigurationItems(search))
                {
                    serverHardware.Add(item);
                }

            }
        }

        private void btnOpen_Click(object sender, RoutedEventArgs e)
        {
            Microsoft.Win32.OpenFileDialog dlg = new Microsoft.Win32.OpenFileDialog() { Filter = "Word-Dokumente|*.docx", DefaultExt = "*.docx", CheckFileExists = true, CheckPathExists = true, Multiselect = false };
            if (dlg.ShowDialog() == true)
            {
                using (WordHelper helper = new WordHelper())
                {
                    helper.OpenDocument(dlg.FileName, true);
                    txtServername.Text = GetTextFromDocument("Servername", helper);
                    txtPurpose.Text = GetTextFromDocument("Aufgabe", helper);
                    txtOS.Text = GetTextFromDocument("Betriebssystem", helper);
                    if (string.IsNullOrWhiteSpace(txtOS.Text))
                        txtOS.Text = GetTextFromDocument("Betriebssystem2", helper);
                    txtCPUs.Text = GetTextFromDocument("CPU_Anzahl", helper);
                    txtRAM.Text = GetTextFromDocument("RAM", helper);
                    txtIP.Text = GetTextFromDocument("IP", helper);

                }
            }

        }

        private string GetTextFromDocument(string bookmarkLabel, WordHelper helper)
        {
            if (!helper.BookmarkNames.Contains(bookmarkLabel))
                return string.Empty;
            string ret = helper.GetBookmarkContent(bookmarkLabel);
            if (ret.StartsWith("Klicken Sie hier", StringComparison.CurrentCultureIgnoreCase) || ret.StartsWith("NEIN, wird vom", StringComparison.CurrentCultureIgnoreCase))
                return string.Empty;
            return ret.Replace("(Standard)", "").Trim(); ;
        }

        private void btnCreate_Click(object sender, RoutedEventArgs e)
        {

        }

        private void btnShowInBrowser_Click(object sender, RoutedEventArgs e)
        {
            string url = string.Format(SettingsManager.CmdbUrl,lstHardware.SelectedValue);
            System.Diagnostics.Process.Start(url);
        }
    }
}
