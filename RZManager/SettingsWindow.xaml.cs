using RZManager.BusinessLogic;
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
            txtassystGuiPath.Text = s.assystWebGuiPath;
            if (hub.DefaultDepartment != null)
            {
                lstDepartment.ItemsSource = new assystConnector.Objects.Department[] { hub.DefaultDepartment };
                lstDepartment.SelectedIndex = 0;
            }
            lstShippingNoteRelType.ItemsSource = hub.RelationTypes;
            lstShippingNoteRelType.SelectedValue = s.ShippingNoteRelationType;
            lstItemRelType.ItemsSource = hub.RelationTypes;
            lstItemRelType.SelectedValue = s.MountingRelationType;
            lstprovRelType.ItemsSource = hub.RelationTypes;
            lstprovRelType.SelectedValue = s.ProvisioningRelationType;
            lstNames.ItemsSource = GetGlobalNames();
            lstFiles.ItemsSource = GetGlobalFiles();
            lstRooms.ItemsSource = hub.Rooms;
            lblRoom.Text = hub.DefaultStoreRoom.Name;
            lblBuilding.Text = hub.DefaultStoreRoom.BuildingName;
        }

        /// <summary>
        /// Liest die Einstellungen (Settings) aus und gibt alle zurück, die auf Name enden und intern benötigt werden, um die Item-Typen korrekt zuzuordnen
        /// </summary>
        /// <returns></returns>
        private IEnumerable<System.Configuration.SettingsProperty> GetGlobalNames()
        {
            return GetGlobalProperties("Name");
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
            if (AssertEmptyTextBox(txtassystGuiPath)) return;
            if (lstDepartment.SelectedValue == null || !(lstDepartment.SelectedValue is int)) return;
            if (lstShippingNoteRelType.SelectedValue == null) return;
            if (lstItemRelType.SelectedValue == null) return;
            if (lstprovRelType.SelectedValue == null) return;
            SettingsManager.ChangeSettings((int)slHeight.Value, txtassystGuiPath.Text, (int)lstDepartment.SelectedValue);
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

        private void lstDepartment_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Return || e.Key == Key.Enter)
            {
                RefreshDepartmentList(lstDepartment.Text);
                e.Handled = true;
            }
        }

        /// <summary>
        /// Sucht nach Abteilungen mit dem Anfang des Namens und zeigt diese an. Wird nur eine Abteilung gefunden, wird diese ausgewählt
        /// </summary>
        /// <param name="part">Namensbestandteil</param>
        private void RefreshDepartmentList(string part)
        {
            if (string.IsNullOrWhiteSpace(part))
                return;
            lstDepartment.ItemsSource = null;
            lstDepartment.ItemsSource = hub.GetDepartsmentsByNameStartsWith(part);
            if (lstDepartment.Items.Count == 1)
                lstDepartment.SelectedIndex = 0;
            else if (lstDepartment.Items.Count > 1)
                lstDepartment.IsDropDownOpen = true;
        }

        private void AutoCompleteList_GotFocus(object sender, RoutedEventArgs e)
        {
            btnOk.IsDefault = false;
        }

        private void AutoCompleteList_LostFocus(object sender, RoutedEventArgs e)
        {
            btnOk.IsDefault = true;
        }
    }
}
