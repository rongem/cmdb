using RZManager.BusinessLogic;
using RZManager.Objects;
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
    /// Interaction logic for ReplaceDocumentInServiceContractsWindow.xaml
    /// </summary>
    public partial class ReplaceDocumentInServiceContractsWindow : Window
    {
        private ObservableCollection<ServiceContract> ServiceContracts = new ObservableCollection<ServiceContract>();

        private DataHub hub = DataHub.GetInstance();

        public ReplaceDocumentInServiceContractsWindow()
        {
            InitializeComponent();
            lvServiceContracts.ItemsSource = ServiceContracts;

            LoadContracts();
        }

        /// <summary>
        /// Lädt die Wartungsverträge und zeigt sie an
        /// </summary>
        private void LoadContracts()
        {
            ServiceContracts.Clear();
            rectStatus.Fill = Brushes.Yellow;
            lblStatus.Text = "Lade Daten";
            SetButtonIsEnabled(false);
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                foreach (ServiceContract serviceContract in hub.GetServiceContractsMarkedBy(Properties.Settings.Default.ServiceContractMark))
                {
                    Dispatcher.BeginInvoke(new Action(() => ServiceContracts.Add(serviceContract)));
                }
                ReactivateUserInterface();
            };
            worker.RunWorkerAsync();
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
            SetButtonIsEnabled(false);
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

        /// <summary>
        /// Setzt die Zugreifbarkeit der Buttons auf den angegebenen Wert
        /// </summary>
        /// <param name="value">Wert für IsEnabled</param>
        private void SetButtonIsEnabled(bool value)
        {
            btnUpload.IsEnabled = value;
            btnClose.IsEnabled = value;
        }

        /// <summary>
        /// Setzt die Benutzeroberfläche auf Bereitschaft
        /// </summary>
        private void ReactivateUserInterface()
        {
            Dispatcher.BeginInvoke(new Action(() => rectStatus.Fill = Brushes.Green));
            Dispatcher.BeginInvoke(new Action(() => lblStatus.Text = "Bereit"));
            Dispatcher.BeginInvoke(new Action(() => SetButtonIsEnabled(true)));
        }

        private void btnUpload_Click(object sender, RoutedEventArgs e)
        {
            Microsoft.Win32.OpenFileDialog dlg = new Microsoft.Win32.OpenFileDialog()
            {
                AddExtension = true,
                CheckFileExists = true,
                CheckPathExists = true,
                DefaultExt = "pdf",
                Filter = "PDF-Dateien|*.pdf",
                Multiselect = false,
                ValidateNames = true,
            };
            if (dlg.ShowDialog() == true)
            {
                if (!System.IO.File.Exists(dlg.FileName))
                {
                    MessageBox.Show("Die Datei existiert nicht.", "Fehler beim Zugriff", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }
                FileAttachment attachment = new FileAttachment();
                try
                {
                    attachment.Content = System.IO.File.ReadAllBytes(dlg.FileName);
                    attachment.Name = "DCC-Wartungsvertrag.pdf";
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "Fehler beim Dateizugriff", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }
                rectStatus.Fill = Brushes.Yellow;
                lblStatus.Text = "Lade Dateien hoch";
                SetButtonIsEnabled(false);
                System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
                worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
                {
                    ServiceContract[] contracts = ServiceContracts.ToArray();
                    foreach (ServiceContract serviceContract in contracts)
                    {
                        hub.DeleteAttachments(serviceContract);
                        string errorMessage;
                        int attachmentId;
                        if (!hub.CreateServiceContractAttachment(serviceContract, attachment, out errorMessage, out attachmentId))
                        {
                            if (MessageBox.Show(string.Format("{0}\r\n\r\nTrotzdem weitermachen?", errorMessage), "Fehler", MessageBoxButton.OKCancel, MessageBoxImage.Error) == MessageBoxResult.Cancel)
                                break;
                        }
                        Dispatcher.BeginInvoke(new Action(() => ServiceContracts.Remove(serviceContract)));
                    }
                    Dispatcher.BeginInvoke(new Action(() => LoadContracts()));
                };
                worker.RunWorkerAsync();
            }
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            if (btnClose.IsEnabled == false)
                e.Cancel = true;
        }
    }
}
