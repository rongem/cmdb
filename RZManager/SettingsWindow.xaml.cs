using RZManager.BusinessLogic;
using RZManager.Objects;
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

namespace RZManager
{
    /// <summary>
    /// Interaction logic for SettingsWindow.xaml
    /// </summary>
    public partial class SettingsWindow : Window
    {
        private Properties.Settings s = Properties.Settings.Default;
        private DataHub hub = DataHub.GetInstance();
        public SettingsWindow()
        {
            InitializeComponent();

            slHeight.Value = s.MinimumHeight;
            lstFiles.ItemsSource = GetGlobalFiles();
            DisplayNames();
        }

        /// <summary>
        /// Stellt die Typ-Bezeichnungen als TreeView dar
        /// </summary>
        private void DisplayNames()
        {
            tvNames.Items.Clear();
            tvNames.Items.Add(CreateTreeViewItemCategory("Attribut-Typen", Settings.Config.AttributeTypeNames));
            tvNames.Items.Add(CreateTreeViewItemCategory("Attributgruppen", Settings.Config.AttributeGroupNames));
            tvNames.Items.Add(CreateTreeViewItemCategory("Item-Typen", Settings.Config.ConfigurationItemTypeNames));
            tvNames.Items.Add(CreateTreeViewItemCategory("Verbindungs-Typen", Settings.Config.ConnectionTypeNames));
        }

        /// <summary>
        /// Erzeugt eine Überschrift und fügt alle Mitglieder der Kategorie hinzu
        /// </summary>
        /// <param name="categoryHeader">Bezeichnung der Überschrift</param>
        /// <param name="content">Inhaltsobjekt, das ausgelesen wird</param>
        /// <returns></returns>
        private TreeViewItem CreateTreeViewItemCategory(string categoryHeader, object content)
        {
            TreeViewItem tvi = CreateTreeViewItem(categoryHeader);
            foreach (System.Reflection.PropertyInfo pi in content.GetType().GetProperties())
            {
                if (pi.PropertyType == typeof(Settings.ConnectionTypes.ConnectionType))
                {
                    Settings.ConnectionTypes.ConnectionType t = pi.GetValue(content) as Settings.ConnectionTypes.ConnectionType;
                    tvi.Items.Add(CreateTreeViewItem(string.Format("{0} = {1} / {2}", pi.Name, t.TopDownName, t.BottomUpName)));
                }
                else
                    tvi.Items.Add(CreateTreeViewItem(string.Format("{0} = {1}", pi.Name, pi.GetValue(content))));
            }
            return tvi;
        }

        /// <summary>
        /// Erzeugt ein TreeViewItem mit einer gegebenen Bezeichnung
        /// </summary>
        /// <param name="header">Bezeichnung</param>
        /// <returns></returns>
        private TreeViewItem CreateTreeViewItem(string header)
        {
            return new TreeViewItem()
            {
                Header = header,
            };
        }

        /// <summary>
        /// Liest die Einstellungen (Settings) aus und gibt alle zurück, die auf File enden und intern benötigt werden, auf Konfigurationsdateien zuzugreifen
        /// </summary>
        /// <returns></returns>
        private IEnumerable<System.Configuration.SettingsProperty> GetGlobalFiles()
        {
            return GetGlobalProperties("File");
        }

        /// <summary>
        /// Liest die Einstellungen (Settings) aus und gibt alle zurück, die auf Name oder Value enden und intern benötigt werden, um die Item-Typen korrekt zuzuordnen
        /// </summary>
        /// <returns></returns>
        private IEnumerable<System.Configuration.SettingsProperty> GetGlobalProperties(string ending)
        {
            List<string> propertyNames = new List<string>();
            foreach (System.Configuration.SettingsProperty property in s.Properties)
            {
                if (property.Name.EndsWith(ending, StringComparison.CurrentCultureIgnoreCase))
                    propertyNames.Add(property.Name);
            }
            propertyNames.Sort();
            foreach (string name in propertyNames)
            {
                yield return Properties.Settings.Default.Properties[name];
            }
        }

        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void OkButton_Click(object sender, RoutedEventArgs e)
        {
            SettingsManager.ChangeSettings((int)slHeight.Value);
            this.Close();
        }

        /// <summary>
        /// Prüft, ob eine Textbox nur leeren Text enthält
        /// </summary>
        /// <param name="tb">TextBox</param>
        /// <returns>true, wenn die Textbox leer ist</returns>
        private bool AssertEmptyTextBox(TextBox tb)
        {
            tb.Text = tb.Text.Trim();
            if (string.IsNullOrEmpty(tb.Text))
            {
                System.Diagnostics.Debug.WriteLine(tb.Name);
                tb.Focus();
                return true;
            }
            return false;
        }
    }
}
