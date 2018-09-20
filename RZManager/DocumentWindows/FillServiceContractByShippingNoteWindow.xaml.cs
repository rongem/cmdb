using RZManager.BusinessLogic;
using RZManager.Objects.Assets;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
    /// Interaction logic for FillServiceContractByShippingNoteWindow.xaml
    /// </summary>
    public partial class FillServiceContractByShippingNoteWindow : Window
    {
        private ObservableCollection<ServiceContract> ServiceContracts = new ObservableCollection<ServiceContract>();

        private int serviceContractId = -1;

        private DataHub hub = DataHub.GetInstance();

        public FillServiceContractByShippingNoteWindow()
        {
            InitializeComponent();

            DateTime td = DateTime.Today;
            upShipmentDate.Maximum = td.Year;
            upShipmentDate.Minimum = td.AddMonths(-6).Year;
            upShipmentDate.Value = td.Year;

            lstServiceContract.ItemsSource = ServiceContracts;

            LoadContracts();
        }

        /// <summary>
        /// Konstruktor, setzt einen Wartungsvertrag unveränderbar
        /// </summary>
        /// <param name="contractId">Id des Wartungsvertrags</param>
        public FillServiceContractByShippingNoteWindow(int contractId) : this()
        {
            serviceContractId = contractId;
        }

        /// <summary>
        /// Lädt die Wartungsverträge und zeigt sie an
        /// </summary>
        private void LoadContracts()
        {
            ServiceContracts.Clear();
            rectStatus.Fill = Brushes.Yellow;
            lblStatus.Text = "Lade Daten";
            SetUiIsEnabled(false);
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                foreach (ServiceContract serviceContract in hub.GetServiceContracts())
                {
                    Dispatcher.BeginInvoke(new Action(() => ServiceContracts.Add(serviceContract)));
                }
                Dispatcher.BeginInvoke(new Action(() => ReactivateUserInterface()));
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Setzt die Zugreifbarkeit der Buttons auf den angegebenen Wert
        /// </summary>
        /// <param name="value">Wert für IsEnabled</param>
        private void SetUiIsEnabled(bool value)
        {
            lstServiceContract.IsEnabled = value;
            btnAddObjects.IsEnabled = value;
            btnClose.IsEnabled = value;
            lvShippingNotes.IsEnabled = value;
            upShipmentDate.IsEnabled = value;
        }

        /// <summary>
        /// Setzt die Benutzeroberfläche auf Bereitschaft
        /// </summary>
        private void ReactivateUserInterface()
        {
            if (ServiceContracts.Count > 0 && lstServiceContract.SelectedIndex < 0)
                lstServiceContract.SelectedIndex = 0;
            rectStatus.Fill = Brushes.Green;
            lblStatus.Text = "Bereit";
            SetUiIsEnabled(true);
            if (serviceContractId != -1)
            {
                lstServiceContract.IsEnabled = false;
                lstServiceContract.SelectedValue = serviceContractId;
            }
        }

        private void btnAddObjects_Click(object sender, RoutedEventArgs e)
        {
            ShippingNote[] shippingNotes = new ShippingNote[lvShippingNotes.SelectedItems.Count];
            ServiceContract serviceContract = lstServiceContract.SelectedItem as ServiceContract;
            lvShippingNotes.SelectedItems.CopyTo(shippingNotes, 0);
            string errorMessage;
            if (MessageBox.Show(string.Format("Diese Aktion kann lange dauern. Sind Sie sicher, dass Sie die mit den Lieferscheinen '{0}' gelieferten Objekte dem Wartungsvertrag zuordnen wollen?",
                string.Join("', '", shippingNotes.Select(s => s.Name))), "Frage", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
            {
                rectStatus.Fill = Brushes.Yellow;
                SetUiIsEnabled(false);
                System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
                worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
                {
                    foreach (ShippingNote shippingNote in shippingNotes)
                    {
                        Dispatcher.BeginInvoke(new Action(() => lvShippingNotes.SelectedItems.Remove(shippingNote)));
                        Dispatcher.BeginInvoke(new Action(() => lblStatus.Text = "Bearbeite Lieferschein " + shippingNote.Name));
                        if (!hub.ConnectShippingNoteObjectsToServiceContract(shippingNote, serviceContract, out errorMessage))
                        {
                            if (MessageBox.Show("Es ist ein Fehler aufgetreten:\r\n" + errorMessage + "\r\n\r\nSoll die Aktion fortgesetzt oder abgebrochen werden?", "Fehler", MessageBoxButton.OKCancel, MessageBoxImage.Error) == MessageBoxResult.Cancel)
                                break;
                        }
                    }
                    Dispatcher.BeginInvoke(new Action(() => ReactivateUserInterface()));
                };
                worker.RunWorkerAsync();
            }
        }

        private void upShipmentDate_ValueChanged(object sender, RoutedPropertyChangedEventArgs<object> e)
        {
            lvShippingNotes.ItemsSource = hub.GetShippingNotesForDate(upShipmentDate.Value.Value.ToString());
        }

        private void lvShippingNotes_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            btnAddObjects.IsEnabled = btnClose.IsEnabled && lvShippingNotes.SelectedItems.Count > 0;
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            if (btnClose.IsEnabled == false)
                e.Cancel = true;
        }
    }
}
