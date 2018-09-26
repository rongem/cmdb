using RZManager.BusinessLogic;
using RZManager.Objects.Assets;
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

namespace RZManager.HardwareWindows.Racks
{
    /// <summary>
    /// Interaction logic for SelectAnyItemWindow.xaml
    /// </summary>
    public partial class SelectAnyItemWindow : Window
    {
        private DataHub hub = DataHub.GetInstance();

        private GenericRackMountable item;

        public SelectAnyItemWindow()
        {
            InitializeComponent();

            lstGenericClass.ItemsSource = hub.GetGenericClasses();
        }

        /// <summary>
        /// Liefert die gewählte ItemID zurück.
        /// </summary>
        public GenericRackMountable SelectedItem { get { return item; } }

        /// <summary>
        /// Liefert das gewählte Produkt zurück
        /// </summary>
        public Product SelectedProduct { get { return product; } }

        private void lstGenericClass_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            lstProductClass.ItemsSource = null;
            if (lstGenericClass.SelectedIndex < 0)
                return;
            genericClass = lstGenericClass.SelectedItem as GenericClass;
            lstProductClass.ItemsSource = hub.GetProductClasses(genericClass.id);
        }

        private void lstProductClass_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            lstProduct.ItemsSource = null;
            if (lstProductClass.SelectedIndex < 0)
                return;
            productClass = lstProductClass.SelectedItem as ProductClass;
            lstProduct.ItemsSource = hub.GetProducts(productClass.id);
        }

        private void lstProduct_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            lstItem.ItemsSource = null;
            if (lstProduct.SelectedIndex < 0)
                return;
            product = lstProduct.SelectedItem as Product;
            lstItem.ItemsSource = hub.GetItems(productClass, product);
        }

        private void lstItem_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            btnNext.IsEnabled = lstItem.SelectedIndex >= 0;
            if (lstItem.SelectedIndex < 0)
                return;
            item = lstItem.SelectedItem as GenericRackMountable;
        }

        private void btnNext_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
            this.Close();
        }
    }
}
