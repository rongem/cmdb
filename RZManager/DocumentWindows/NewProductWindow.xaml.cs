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

namespace RZManager.DocumentWindows
{
    /// <summary>
    /// Interaction logic for NewProductWindow.xaml
    /// </summary>
    public partial class NewProductWindow : Window
    {
        public NewProductWindow(string productClassName, IEnumerable<assystConnector.Objects.Supplier> manufacturers)
        {
            InitializeComponent();
            this.PreviewKeyDown += new KeyEventHandler(CloseOnEscape);

            txtPcName.Text = productClassName;
            lstManufacturer.ItemsSource = manufacturers;
            lstManufacturer.SelectedIndex = 0;
            txtProductName.Focus();
        }

        private void CloseOnEscape(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Escape)
                this.Close();
        }


        private void ButtonSave_Click(object sender, RoutedEventArgs e)
        {
            txtProductName.Text = txtProductName.Text.Trim();
            txtPartNo.Text = txtPartNo.Text.Trim().ToUpper();
            if (string.IsNullOrEmpty(txtProductName.Text))
            {
                MessageBox.Show("Es muss ein Name angegeben werden.");
                txtProductName.Focus();
                return;
            }
            if (lstManufacturer.SelectedValue == null)
            {
                MessageBox.Show("Es muss ein Hersteller angegeben werden.");
                lstManufacturer.Focus();
                lstManufacturer.IsDropDownOpen = true;
                return;
            }
            this.DialogResult = true;
        }

        /// <summary>
        /// Gibt den Namen des neu anzulegenden Produkts zurück
        /// </summary>
        public string ProductName { get { return txtProductName.Text; } }

        /// <summary>
        /// Gibt die Part-Nummer für den ShortCode des neu anzulegenden Produkts zurück
        /// </summary>
        public string PartNumber { get { return txtPartNo.Text.ToUpper(); } }

        /// <summary>
        /// Gibt an, ob es sich um ein ins Rack montierbares System handelt
        /// </summary>
        public bool IsRackMountable { get { return chkRackmountable.IsChecked.Value; } }

        /// <summary>
        /// Gibt die Anzahl der Höheneinheiten zurück
        /// </summary>
        public int HeightUnits { get { return valHeightUnits.Value.Value; } }

        /// <summary>
        /// Gibt die Id des gewählten Herstellers für das Produkt zurück
        /// </summary>
        public int ManufacturerId { get { return (int)lstManufacturer.SelectedValue; } }

        private void chkRackmountable_Checked(object sender, RoutedEventArgs e)
        {
            valHeightUnits.IsEnabled = chkRackmountable.IsChecked.Value;
        }
    }
}
