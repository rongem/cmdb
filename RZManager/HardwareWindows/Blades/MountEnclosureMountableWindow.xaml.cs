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

namespace RZManager.HardwareWindows.Blades
{
    /// <summary>
    /// Interaction logic for MountEnclosureMountableWindow.xaml
    /// </summary>
    public partial class MountEnclosureMountableWindow : Window
    {
        public MountEnclosureMountableWindow(IEnumerable<Asset> items, string typeName)
        {
            InitializeComponent();
            lblType.Text = string.Format("{0} auswählen:", typeName);
            Title = typeName;

            lstItems.ItemsSource = items;
            lstItems.SelectedIndex = 0;
        }

        public Asset SelectedItem { get { return lstItems.SelectedValue as Asset; } }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
            this.Close();
        }
    }
}
