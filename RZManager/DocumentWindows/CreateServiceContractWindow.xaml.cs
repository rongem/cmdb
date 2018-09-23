using RZManager.BusinessLogic;
using RZManager.Objects;
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

namespace RZManager.DocumentWindows
{
    /// <summary>
    /// Interaction logic for CreateServiceContractWindow.xaml
    /// </summary>
    public partial class CreateServiceContractWindow : Window
    {
        private DataHub hub = DataHub.GetInstance();

        private FileAttachment attachment;

        public CreateServiceContractWindow()
        {
            InitializeComponent();

            dtStart.SelectedDate = DateTime.Today;

            lstSupplier.ItemsSource = hub.GetSuppliers();
        }

        private void btnSave_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            int itemId;
            if (Save(out errorMessage, out itemId))
            {
                if (itemId > 0) // Öffnen des assyst-Fensters mit dem neuen Objekt, um die Beziehungen manuell zu pflegen
                    System.Diagnostics.Process.Start(string.Format(hub.CmdbSystemBaseUrl + Properties.Settings.Default.assystWebGuiPath, itemId));
                Close();
            }
            else
            { 
                MessageBox.Show(errorMessage, "Fehler beim Anlegen", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }
        }

        private void btnSaveAndAddShipping_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            int itemId;
            if (Save(out errorMessage, out itemId))
            {
                FillServiceContractByShippingNoteWindow w = new FillServiceContractByShippingNoteWindow(itemId);
                w.ShowDialog();
                Close();
            }
            else
            {
                MessageBox.Show(errorMessage, "Fehler beim Anlegen", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }
        }

        /// <summary>
        /// Speichert den Wartungsvertrag und gibt den Erfolg oder eine Fehlermeldung zurück
        /// </summary>
        /// <param name="errorMessage">Fehlermeldung</param>
        /// <param name="ItemId">Id des neuen Items</param>
        /// <returns></returns>
        private bool Save(out string errorMessage, out int ItemId)
        {
            errorMessage = string.Empty;
            ItemId = -1;
            txtName.Text = txtName.Text.Trim();
            txtSAID.Text = txtSAID.Text.Trim();
            txtReaction.Text = txtReaction.Text.Trim();
            txtHotline.Text = txtHotline.Text.Trim();
            txtSupport.Text = txtSupport.Text.Trim();

            if (lstSupplier.SelectedIndex < 0)
            {
                errorMessage = "Sie müssen einen Vertragspartner auswählen.";
                txtName.Focus();
                return false;
            }

            if (string.IsNullOrEmpty(txtName.Text))
            {
                errorMessage = "Sie müssen dem Vertrag einen Namen geben.";
                txtName.Focus();
                return false;
            }

            if (dtEnd.SelectedDate <= dtStart.SelectedDate.Value.AddMonths(1))
            {
                errorMessage = "Das Anfangsdatum muss mindestens einen Monat vor dem Ablaufdatum des Vertrags liegen.";
                dtStart.Focus();
                return false;
            }

            ServiceContract mc = new ServiceContract()
            {
                Name = txtName.Text,
                BeginningDate = dtStart.SelectedDate.Value,
                ExpiryDate = dtEnd.SelectedDate.Value,
                Status = AssetStatus.InProduction,
                SupplierName = (int)lstSupplier.SelectedValue,
                SupplierReference = chkDCC.IsChecked.Value ? "DCC" : string.Empty,
                Remarks = string.Format("Hotline: {0}\r\nReaktionszeiten: {1}\r\nSupportzeiten: {2}\r\nVertrags-ID: {3}\r\n", txtHotline.Text, txtReaction.Text, txtSupport.Text, txtSAID.Text),
            };

            int itemId;
            if (!hub.CreateServiceContract(mc, attachment, out errorMessage, out itemId))
            {
                errorMessage = "Fehler beim Anlegen:\r\n" + errorMessage;
                return false;
            }
            return true;
        }

        private void dtStart_SelectedDateChanged(object sender, SelectionChangedEventArgs e)
        {
            dtEnd.SelectedDate = dtStart.SelectedDate.Value.AddYears(5).AddDays(-1);
        }

        private void btnUploadOrViewAttachment_Click(object sender, RoutedEventArgs e)
        {
            if (attachment != null && !string.IsNullOrEmpty(attachment.Name)) // Ansehen
            {
                string outputFile = System.IO.Path.Combine(System.IO.Path.GetTempPath(), attachment.Name);
                if ((System.IO.File.Exists(outputFile)))
                {
                    try
                    {
                        System.IO.File.Delete(outputFile);
                    }
                    catch (UnauthorizedAccessException)
                    {
                        MessageBox.Show("Die Datei existiert, Sie haben nicht die erforderlichen Rechte, um sie zu überschreiben", "Fehler beim Dateizugriff", MessageBoxButton.OK, MessageBoxImage.Error);
                        return;
                    }
                    catch (System.IO.IOException)
                    {
                        MessageBox.Show("Die Datei existiert und ist in einem anderen Programm bereits geöffnet.", "Fehler beim Dateizugriff", MessageBoxButton.OK, MessageBoxImage.Error);
                        return;
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show(ex.Message, "Fehler beim Dateizugriff", MessageBoxButton.OK, MessageBoxImage.Error);
                        return;
                    }
                }
                System.IO.File.WriteAllBytes(outputFile, attachment.Content);
                System.Diagnostics.Process.Start(outputFile);
            }
            else // Hochladen
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
                    if (attachment == null)
                        attachment = new FileAttachment();
                    try
                    {
                        attachment.Content = System.IO.File.ReadAllBytes(dlg.FileName);
                        attachment.Name = "Wartungsvertrag.pdf";
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show(ex.Message, "Fehler beim Dateizugriff", MessageBoxButton.OK, MessageBoxImage.Error);
                        return;
                    }
                    btnUploadOrViewAttachment.Content = string.Format("Datei {0} ansehen", attachment.Name);
                }
            }
        }
    }
}
