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

namespace RZManager.HardwareWindows.Blades
{
    /// <summary>
    /// Interaction logic for EnclosureTypesWindow.xaml
    /// </summary>
    public partial class EnclosureTypesWindow : Window
    {
        private DataHub hub = DataHub.GetInstance();

        private bool dataHasChanged = false;

        private bool initializing = true;

        private System.Collections.ObjectModel.ObservableCollection<EnclosureType> EnclosureTypes = new System.Collections.ObjectModel.ObservableCollection<EnclosureType>();

        public EnclosureTypesWindow()
        {
            InitializeComponent();

            foreach (EnclosureType et in hub.MetaData.EnclosureTypes)
            {
                if (et.Name.Equals("Default"))
                    continue;
                EnclosureTypes.Add(et);
            }

            lstTypes.ItemsSource = EnclosureTypes;

            if (lstTypes.Items.Count > 0)
            {
                lstTypes.SelectedIndex = 0;
            }

            dataHasChanged = false;
            initializing = false;
        }
        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            hub.EnclosureTypesWindow = null;
        }

        private void lstTypes_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            btnSave.IsEnabled = lstTypes.SelectedIndex > -1;
            if (initializing || lstTypes.SelectedValue == null)
                return;
            if (dataHasChanged)
                MessageBox.Show("Die geänderten Daten wurden durch den Wechsel verworfen. Wenn das nicht beabsichtigt war, bitte erst speichern und dann den neuen Typ auswählen!", "Information", MessageBoxButton.OK, MessageBoxImage.Information);
            EnclosureType encType = lstTypes.SelectedItem as EnclosureType;
            lblName.Text = string.Format("{0} ({1} HE)", encType.Name, encType.HeightUnits);
            valApplianceHorizontal.Value = encType.ApplianceCountHorizontal;
            valApplianceVertical.Value = encType.ApplianceCountVertical;
            valServerHorizontal.Value = encType.ServerCountHorizontal;
            valServerVertical.Value = encType.ServerCountVertical;
            valInterconnectHorizontal.Value = encType.InterconnectCountHorizontal;
            valInterconnectVertical.Value = encType.InterconnectCountVertical;
            //valInterFrameLinkHorizontal.Value = encType.InterFrameLinkCountHorizontal;
            //valInterFrameLinkVertical.Value = encType.InterFrameLinkCountVertical;

            dataHasChanged = false;
        }

        private void btnSave_Click(object sender, RoutedEventArgs e)
        {
            EnclosureType encType = lstTypes.SelectedItem as EnclosureType;
            if (valApplianceHorizontal.Value * valApplianceVertical.Value == 0)
            {
                valApplianceVertical.Value = 0;
                valApplianceHorizontal.Value = 0;
            }
            /*if (valInterFrameLinkHorizontal.Value * valInterFrameLinkVertical.Value == 0)
            {
                valInterFrameLinkVertical.Value = 0;
                valInterFrameLinkHorizontal.Value = 0;
            }*/
            if (valServerHorizontal.Value * valServerVertical.Value < 4)
            {
                MessageBox.Show("Ein Blade Enclosure muss mindestens über 4 Einschübe für Blades verfügen.", "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }
            encType.ApplianceCountHorizontal = valApplianceHorizontal.Value.Value;
            encType.ApplianceCountVertical = valApplianceVertical.Value.Value;
            encType.ServerCountHorizontal = valServerHorizontal.Value.Value;
            encType.ServerCountVertical = valServerVertical.Value.Value;
            encType.InterconnectCountHorizontal = valInterconnectHorizontal.Value.Value;
            encType.InterconnectCountVertical = valInterconnectVertical.Value.Value;
            //encType.InterFrameLinkCountHorizontal = valInterFrameLinkHorizontal.Value.Value;
            //encType.InterFrameLinkCountVertical = valInterFrameLinkVertical.Value.Value;
            hub.MetaData.SaveEnclosureTypeTemplate(encType);

        }

        private void btnClose_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void val_ValueChanged(object sender, RoutedPropertyChangedEventArgs<object> e)
        {
            dataHasChanged = true;
        }
    }
}
