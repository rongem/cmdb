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
    /// Interaction logic for DeactivateServiceContractWindow.xaml
    /// </summary>
    public partial class DeactivateServiceContractWindow : Window
    {
        private ObservableCollection<ServiceContract> ServiceContracts = new ObservableCollection<ServiceContract>();

        private DataHub hub = DataHub.GetInstance();

        public DeactivateServiceContractWindow()
        {
            InitializeComponent();
            lvServiceContracts.ItemsSource = ServiceContracts;

            btnReload_Click(btnReload, null);
        }

        /// <summary>
        /// Schaltet die Benutzeroberfläche auf Hintergrundarbeit
        /// </summary>
        /// <param name="status">Text für die Statuszeile</param>
        /// <param name="sc">Wartungsvertrags-Objekt, das bearbeitet werden soll</param>
        /// <param name="position">Position des Objekts in der ObservableCollection</param>
        private void PrepareObjectForTransaction(string status, out ServiceContract sc, out int position)
        {
            sc = lvServiceContracts.SelectedItem as ServiceContract;
            lvServiceContracts.IsEnabled = false;
            rectStatus.Fill = Brushes.Yellow;
            lblStatus.Text = status;
            btnReload.IsEnabled = false;
            position = ServiceContracts.IndexOf(sc);
            ServiceContracts.Remove(sc);
            //lvServiceContracts_SelectionChanged(null, null));
        }

        /// <summary>
        /// Schaltet die Benutzeroberfläche wieder auf Bedienbarkeit
        /// </summary>
        /// <param name="sc">Wartungsvertrag, der bearbeitet wurde</param>
        /// <param name="position">Position des Objekts in der ObservableCollection</param>
        private void RefreshObject(ServiceContract sc, int position)
        {
            Dispatcher.BeginInvoke(new Action(() => ServiceContracts.Insert(position, sc)));
            Dispatcher.BeginInvoke(new Action(() => lvServiceContracts.SelectedItem = sc));
            Dispatcher.BeginInvoke(new Action(() => lvServiceContracts.IsEnabled = true));
            ReactivateUserInterface();
        }

        private void btnDeleteAttachments_Click(object sender, RoutedEventArgs e)
        {
            ServiceContract sc;
            int position;
            PrepareObjectForTransaction("Lösche Anhänge", out sc, out position);
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                hub.DeleteAttachments(sc);
                RefreshObject(sc, position);
            };
            worker.RunWorkerAsync();
        }

        private void btnDeleteConnections_Click(object sender, RoutedEventArgs e)
        {
            ServiceContract sc;
            int position;
            PrepareObjectForTransaction("Lösche Verbindungen", out sc, out position);
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                hub.DeleteConnections(sc);
                RefreshObject(sc, position);
            };
            worker.RunWorkerAsync();
        }

        private void btnDeleteServiceContract_Click(object sender, RoutedEventArgs e)
        {
            ServiceContract sc;
            int position;
            PrepareObjectForTransaction("Deaktiviere Wartungsvertrag", out sc, out position);
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                hub.DeleteServiceContract(sc);
            };
            worker.RunWorkerAsync();
            lvServiceContracts.IsEnabled = true;
            ReactivateUserInterface();
        }

        private void btnReload_Click(object sender, RoutedEventArgs e)
        {
            ServiceContracts.Clear();
            lvServiceContracts_SelectionChanged(sender, null);
            rectStatus.Fill = Brushes.Yellow;
            lblStatus.Text = "Lade Daten";
            btnReload.IsEnabled = false;
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                foreach (ServiceContract serviceContract in hub.GetServiceContractsToDeactivate())
                {
                    Dispatcher.BeginInvoke(new Action(() => ServiceContracts.Add(serviceContract)));
                }
                ReactivateUserInterface();
            };
            worker.RunWorkerAsync();

        }

        /// <summary>
        /// Setzt die Benutzeroberfläche auf Bereitschaft
        /// </summary>
        private void ReactivateUserInterface()
        {
            Dispatcher.BeginInvoke(new Action(() => rectStatus.Fill = Brushes.Green));
            Dispatcher.BeginInvoke(new Action(() => lblStatus.Text = "Bereit"));
            Dispatcher.BeginInvoke(new Action(() => btnReload.IsEnabled = true));
        }

        private void lvServiceContracts_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            btnViewInAssyst.IsEnabled = false;
            btnDeleteAttachments.Visibility = Visibility.Collapsed;
            btnDeleteConnections.Visibility = Visibility.Collapsed;
            btnDeleteServiceContract.Visibility = Visibility.Collapsed;
            if (lvServiceContracts.SelectedIndex >= 0)
            {
                btnViewInAssyst.IsEnabled = true;
                ServiceContract sc = lvServiceContracts.SelectedItem as ServiceContract;
                btnDeleteAttachments.Visibility = sc.AttachmentCount > 0 ? Visibility.Visible : Visibility.Collapsed;
                btnDeleteConnections.Visibility = sc.ConnectionCount > 0 ? Visibility.Visible : Visibility.Collapsed;
                btnDeleteServiceContract.Visibility = sc.AttachmentCount + sc.ConnectionCount == 0 ? Visibility.Visible : Visibility.Collapsed;
            }
        }

        private void btnViewInAssyst_Click(object sender, RoutedEventArgs e)
        {
            System.Diagnostics.Process.Start(string.Format(hub.AssystSystemBaseUrl + Properties.Settings.Default.assystWebGuiPath, (lvServiceContracts.SelectedItem as ServiceContract).id));
        }
    }
}
