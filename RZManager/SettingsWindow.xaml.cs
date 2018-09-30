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
            lstFiles.ItemsSource = GetGlobalFiles();
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
