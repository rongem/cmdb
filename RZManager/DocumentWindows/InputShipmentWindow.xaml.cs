using RZManager.BusinessLogic;
using RZManager.Objects.Assets;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace RZManager.DocumentWindows
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class InputShipmentWindow : Window
    {
        private DataHub hub = DataHub.GetInstance();

        private System.Collections.ObjectModel.ObservableCollection<Asset> items = new System.Collections.ObjectModel.ObservableCollection<Asset>();

        private bool mustNotClose = false;

        private ShippingNote shippingNote = null;

        public InputShipmentWindow()
        {
            InitializeComponent();

            //FillListBoxes();
            hub.DataHasChanged += DataHasChanged;

            lstItems.ItemsSource = items;

            dpShipmentDate.SelectedDate = DateTime.Today;
            dpShipmentDate.DisplayDateEnd = DateTime.Today;
            this.PreviewKeyDown += new KeyEventHandler(CloseOnEscape);

            DisplayStackPanel(spShippingNote);

            txtShipmentNumber.Focus();
        }

        private void CloseOnEscape(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Escape)
                this.Close();
        }

        private void DataHasChanged(object sender, EventArgs e)
        {
            //Dispatcher.BeginInvoke(new Action(() => FillListBoxes()));
        }

        private void DisplayStackPanel(StackPanel panel)
        {
            foreach (StackPanel p in new StackPanel[] { spShippingContent, spShippingNote, spShippingNoteFileUpload })
            {
                p.Visibility = (p == panel) ? Visibility.Visible : Visibility.Collapsed;
            }
            spButtons.Visibility = spShippingContent.Visibility;
            lstItems.Visibility = spShippingContent.Visibility;
        }

        private void ButtonAddItem_Click(object sender, RoutedEventArgs e)
        {
            txtName.Text = txtName.Text.Trim();
            txtSerial.Text = txtSerial.Text.Trim().ToUpper();
            txtShipmentNumber.Text = txtShipmentNumber.Text.Trim();
            txtRemark.Text = txtRemark.Text.Trim();
            txtError.Text = string.Empty;
            if (chkAddSerial.IsChecked == false && string.IsNullOrEmpty(txtName.Text))
            {
                txtError.Text = "Es wurde kein Name für das neue Item angegeben.";
                txtName.Focus();
                return;
            }
            if (string.IsNullOrEmpty(txtSerial.Text))
            {
                txtError.Text = "Die Seriennummer muss angegeben werden.";
                txtSerial.Focus();
                return;
            }
            if (items.SingleOrDefault(i => i.Serialnumber.Equals(txtSerial.Text)) != null)
            {
                txtError.Text = "Die Seriennummer wurde bereits eingegeben.";
                txtSerial.SelectAll();
                txtSerial.Focus();
                return;
            }

            // Nach dem ersten erfolgreichen Item die Veränderung der globalen Parameter verhindern
            txtShipmentNumber.IsEnabled = false;
            lstSupplier.IsEnabled = false;
            dpShipmentDate.IsEnabled = false;

            string itemName = txtName.Text;
            if (chkAddSerial.IsChecked == true)
                itemName += " " + txtSerial.Text;

            if (items.SingleOrDefault(i => i.Name.Equals(itemName, StringComparison.CurrentCultureIgnoreCase)) != null)
            {
                txtError.Text = "Der Name wurde bereits eingegeben.";
                txtName.SelectAll();
                txtName.Focus();
                return;
            }

            DateTime t = dpShipmentDate.SelectedDate.HasValue ? dpShipmentDate.SelectedDate.Value : DateTime.Today;

            /*Item item = new Item()
            {
                name = itemName,
                shortCode = itemName.ToUpper(),
                productId = (int)lstItemProduct.SelectedValue,
                serialNumber = txtSerial.Text,
                supplierId = (int)lstSupplier.SelectedValue,
                supplierRef = txtShipmentNumber.Text,
                acquiredDate = hub.GetDateZuluString(t),
                expiryDate = hub.GetDateZuluString(t.AddYears(5).AddDays(-1)),
                remarks = txtRemark.Text,
            };
            items.Add(item);*/
            txtSerial.Focus();
        }

        private void ButtonCancel_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void ButtonDeleteItem_Click(object sender, RoutedEventArgs e)
        {
            string serial = (sender as Button).Tag.ToString();
            items.Remove(items.Single(i => i.Serialnumber.Equals(serial)));
        }

        private void ButtonSave_Click(object sender, RoutedEventArgs e)
        {
            if (items.Count == 0)
            {
                MessageBox.Show("Sie müssen mindestens ein Gerät auf dem Lieferschein erfassen.", "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }
            if (MessageBox.Show("Möchten Sie die erfassten Items jetzt nach assyst übertragen? Die Übertragung dauert mehrere Minuten, und das Fenster schließt sich am Ende der Übertragung automatisch.",
                "Übertragung starten", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.No)
                return;

            btnAddItem.IsEnabled = false;
            spButtons.Visibility = Visibility.Collapsed;
            spShippingContent.Visibility = Visibility.Collapsed;
            pgSave.Visibility = Visibility.Visible;
            pgSave.Maximum = items.Count;

            txtError.Text = "Lege die Items an, bitte warten, bis das Fenster schließt.";

            mustNotClose = true;

            string shipmentNumber = txtShipmentNumber.Text;
            DateTime shipmentDate = dpShipmentDate.SelectedDate.Value;

            hub.ShipmentItemCreated += Hub_ShipmentItemCreated;

            BackgroundWorker worker = new BackgroundWorker();

            bool error = false;

            worker.DoWork += delegate (object s, DoWorkEventArgs args)
            {
                string errorMessage;
                if (!hub.CreateShipment(items.ToArray(), shippingNote, out errorMessage, ShowWorkingProgress))
                {
                    MessageBox.Show(string.Concat("Es konnten nicht alle Items angelegt werden. Bitte prüfen Sie die Liste der Fehlermeldungen:\r\n", errorMessage),
                        "Fehler beim Anlegen", MessageBoxButton.OK, MessageBoxImage.Error);
                    error = true;
                }
                mustNotClose = false;
                Dispatcher.BeginInvoke(new Action(() => hub.ShipmentItemCreated -= Hub_ShipmentItemCreated));
                if (error)
                    Dispatcher.BeginInvoke(new Action(() => RestoreVisibility()));
                else
                    Dispatcher.BeginInvoke(new Action(() => this.Close()));
            };

            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Stellt im Fehlerfall die Sichtbarkeit der Eingabemaske wieder her
        /// </summary>
        private void RestoreVisibility()
        {
            btnAddItem.IsEnabled = true;
            spButtons.Visibility = Visibility.Visible;
            spShippingContent.Visibility = Visibility.Visible;
            pgSave.Visibility = Visibility.Collapsed;
        }

        /// <summary>
        /// Löscht ein bereits erfolgreich angelegtes Item aus der Liste
        /// </summary>
        /// <param name="item">Item, das gelöscht werden soll</param>
        private void Hub_ShipmentItemCreated(Asset item)
        {
            Dispatcher.BeginInvoke(new Action(() => items.Remove(item)));
        }

        /// <summary>
        /// Zeigt den Fortschrittsbalken an
        /// </summary>
        /// <param name="step"></param>
        private void ShowWorkingProgress(int step)
        {
            Dispatcher.BeginInvoke(new Action(() => pgSave.Value = step)); ;
        }

        private void ButtonAddProduct_Click(object sender, RoutedEventArgs e)
        {
            NewProductWindow w = new NewProductWindow(lstItemProductClass.Text, suppliers);
            if (w.ShowDialog() == true)
            {
                Product p = hub.CreateProduct((int)lstItemProductClass.SelectedValue, w.ManufacturerId, w.ProductName, w.IsRackMountable ? w.HeightUnits : 0, w.PartNumber);
                lstItemProductClass_SelectionChanged(sender, null);
            }
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            if (mustNotClose)
            {
                e.Cancel = true;
                return;
            }
            hub.ShipmentWindow = null;
        }

        private void btnShippingNoteSearch_Click(object sender, RoutedEventArgs e)
        {
            string shipmentNumber = txtShipmentNumber.Text.Trim();
            if (string.IsNullOrEmpty(shipmentNumber))
            {
                MessageBox.Show("Die Lieferscheinnummer muss eingegeben werden.");
                txtShipmentNumber.Focus();
                return;
            }
            DateTime shipmentDate = dpShipmentDate.SelectedDate.Value;

            shippingNote = hub.GetShippingNote(shipmentDate, shipmentNumber);

            if (shippingNote.id == 0)
            {
                lstSupplier.IsEnabled = true;
                btnUploadOrViewAttachment.Content = "Datei hochladen...";
                lblShippingNoteExisting.Text = "Der Lieferschein wurde nicht gefunden.";
            }
            else
            {
                lstSupplier.IsEnabled = false;
                lstSupplier.SelectedValue = shippingNote.Supplier;
                if (string.IsNullOrEmpty(shippingNote.AttachmentFileName))
                    btnUploadOrViewAttachment.Content = "Datei hochladen...";
                else
                    btnUploadOrViewAttachment.Content = string.Format("Datei {0} ansehen", shippingNote.AttachmentFileName);
                lblShippingNoteExisting.Text = string.Format("Lieferschein {0} gefunden.", shippingNote.Name);
            }

            DisplayStackPanel(spShippingNoteFileUpload);
        }

        private void btnShippingContent_Click(object sender, RoutedEventArgs e)
        {
            if (shippingNote.id == 0) // Noch nicht angelegt
            {
                shippingNote.Supplier = (int)lstSupplier.SelectedValue;
                if (!hub.CreateShippingNote(shippingNote))
                {
                    MessageBox.Show("Fehler beim Anlegen des Lieferscheins", "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }
            }
            DisplayStackPanel(spShippingContent);
        }

        private void btnBackToShippingNote_Click(object sender, RoutedEventArgs e)
        {
            DisplayStackPanel(spShippingNote);
        }

        private void btnUploadOrViewAttachment_Click(object sender, RoutedEventArgs e)
        {
            if (shippingNote != null && !string.IsNullOrEmpty(shippingNote.AttachmentFileName)) // Ansehen
            {
                string outputFile = System.IO.Path.Combine(System.IO.Path.GetTempPath(), shippingNote.AttachmentFileName);
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
                System.IO.File.WriteAllBytes(outputFile, shippingNote.AttachmentContent);
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
                    if (shippingNote == null)
                        shippingNote = new Objects.Assets.ShippingNote();
                    try
                    {
                        shippingNote.AttachmentContent = System.IO.File.ReadAllBytes(dlg.FileName);
                        shippingNote.AttachmentFileName = shippingNote.Name + ".pdf";
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show(ex.Message, "Fehler beim Dateizugriff", MessageBoxButton.OK, MessageBoxImage.Error);
                        return;
                    }
                    btnUploadOrViewAttachment.Content = string.Format("Datei {0} ansehen", shippingNote.AttachmentFileName);
                }
            }
        }
    }
}
