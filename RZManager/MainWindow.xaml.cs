using RZManager.BusinessLogic;
using RZManager.HardwareWindows.Blades;
using RZManager.HardwareWindows.Racks;
using RZManager.Objects.Assets;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Resources;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;

namespace RZManager
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            try
            {
                hub = DataHub.GetInstance();
                Title = string.Format("RZManager: {0}", hub.CmdbSystemBaseUrl);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message + "\r\nDie Anwendung muss beendet werden", "Kritischer Fehler", MessageBoxButton.OK, MessageBoxImage.Stop);
                this.Close();
                Application.Current.Shutdown();
                return;
            }

            LoadData();

        }

        /// <summary>
        /// Setzt die Hintergrundfarbe für eine beliebige Anzahl von Shapes auf den angegebenen Wert
        /// </summary>
        /// <param name="brush">Farbwert</param>
        /// <param name="shapes">Shapes, die bearbeitet werden sollen</param>
        private void SetBackgroundColor(Brush brush, params Shape[] shapes )
        {
            foreach (Shape shape in shapes)
            {
                shape.Fill = brush;
            }
        }

        /// <summary>
        /// Synchronisiert alle Daten neu aus der assyst-Datenbank
        /// </summary>
        private void LoadData()
        {
            spChoose.Visibility = Visibility.Collapsed;
            spWait.Visibility = Visibility.Visible;

            SetBackgroundColor(Brushes.Red, rectRack, rectPDUs, rectSanSwitch, rectStorage, rectBackup, rectRackserver, rectBladeEnclosure, rectBladeAppliance, rectBladeInterconnect, rectBladeserver, rectHwApp, rectEsxHosts, rectConnToRack, rectBladeConn, rectProviConn);

            SetMenuIsEnabled(false);
            
            BackgroundWorker worker = new BackgroundWorker();
            worker.RunWorkerCompleted += Hub_RunWorkerCompleted;

            hub.NextPhaseStarted += Hub_FillNextStep;
            hub.FillStepCompleted += Hub_FillStepCompleted;
            hub.FillStepStarted += Hub_FillStepStarted;
            hub.InitializationCompleted += Hub_InitializationCompleted;

            worker.DoWork += delegate (object s, DoWorkEventArgs args)
            {
                hub.Fill();
            };

            worker.RunWorkerAsync();
        }

        private void Hub_InitializationCompleted(object sender, EventArgs e)
        {
            Dispatcher.BeginInvoke(new Action(() => SetMenuIsEnabled(true)));
        }

        private void SetMenuIsEnabled(bool value)
        {
            mnuRefreshData.IsEnabled = value;
            mnuEnclosureTypes.IsEnabled = value;
            mnuSettings.IsEnabled = value;
        }

        private void Hub_FillStepCompleted(string t)
        {
            Rectangle rect = GetRectangleForType(t);
            if (rect != null)
                Dispatcher.BeginInvoke(new Action(() => SetBackgroundColor(Brushes.Green, rect)));
        }

        private void Hub_FillStepStarted(string t)
        {
            Rectangle rect = GetRectangleForType(t);
            if (rect != null)
                Dispatcher.BeginInvoke(new Action(() => SetBackgroundColor(Brushes.Yellow, rect)));
        }

        /// <summary>
        /// Sucht zum angegebenen Typen das korrekte Statuselement heraus
        /// </summary>
        /// <param name="t">Typ, nach dem gesucht wird</param>
        /// <returns></returns>
        private Rectangle GetRectangleForType(string t)
        {
            Rectangle rect;
            switch (t)
            {
                case "Rack":
                    rect = rectRack;
                    break;
                case "PDU":
                    rect = rectPDUs;
                    break;
                case "SanSwitch":
                    rect = rectSanSwitch;
                    break;
                case "StorageSystem":
                    rect = rectStorage;
                    break;
                case "BackupSystem":
                    rect = rectBackup;
                    break;
                case "RackServer":
                    rect = rectRackserver;
                    break;
                case "BladeEnclosure":
                    rect = rectBladeEnclosure;
                    break;
                case "BladeAppliance":
                    rect = rectBladeAppliance;
                    break;
                case "BladeInterconnect":
                    rect = rectBladeInterconnect;
                    break;
                case "BladeServer":
                    rect = rectBladeserver;
                    break;
                case "HardwareAppliance":
                    rect = rectHwApp;
                    break;
                case "ProvisionedSystem":
                    rect = rectEsxHosts;
                    break;
                case "Connection":
                    rect = rectConnToRack;
                    break;
                case "ConnectionsToEnclosures":
                    rect = rectBladeConn;
                    break;
                case "ConnectionsToServer":
                    rect = rectProviConn;
                    break;
                default:
                    rect = null;
                    break;
            }

            return rect;
        }

        private void Hub_FillNextStep(int step, string message)
        {
            Dispatcher.BeginInvoke(new Action(() => lblStep.Text = message));
        }

        private void Hub_StepComplete(Rectangle rect)
        {
            Dispatcher.BeginInvoke(new Action(() => rect.Fill = Brushes.Green));
        }

        private void Hub_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            FillContents();
            spChoose.Visibility = Visibility.Visible;
            spWait.Visibility = Visibility.Collapsed;
            mnuRefreshData.IsEnabled = true;
            if (hub.EnclosureTypeMissing)
            {
                MessageBox.Show("Es sind nicht alle Enclosure-Typen mit Abmessungswerten hinterlegt. Bitte ergänzen Sie die Informationen.", "Fehlende Vorgaben", MessageBoxButton.OK, MessageBoxImage.Warning);
                mnuEnclosureTypes_Click(sender, null);
            }
        }

        private DataHub hub;

        private void FillContents()
        {
            lstRoom.ItemsSource = null;
            lstRoom.Items.Clear();
            lstRoom.ItemsSource = hub.Rooms;
            lstRoom.SelectedIndex = 0;

            lstEnclosure.ItemsSource = null;
            lstEnclosure.Items.Clear();
            lstEnclosure.ItemsSource = hub.GetMountedEnclosures();
            lstEnclosure.SelectedIndex = 0;
        }

        private void lstRoom_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            lstRack.ItemsSource = null;
            lstRack.Items.Clear();
            if (lstRoom.SelectedValue == null)
                return;
            lstRack.ItemsSource = hub.GetRacksInRoom((Guid)lstRoom.SelectedValue);
            if (lstRack.Items.Count > 0)
                lstRack.SelectedIndex = 0;
        }

        private void lstRack_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            btnOpen.IsEnabled = lstRack.SelectedValue != null;
        }

        private void HelpAbout_Click(object sender, RoutedEventArgs e)
        {
            new RZManagerAboutBox().ShowDialog();
        }

        private void SettingsItem_Click(object sender, RoutedEventArgs e)
        {
            new SettingsWindow().ShowDialog();
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            if (hub == null)
                return;
            if (hub.RackWindows.Count() > 0 || hub.EnclosureWindows.Count() > 0 || hub.EnclosureTypesWindow != null || hub.ShipmentWindow != null)
            {
                if (MessageBox.Show("Sind Sie sicher, dass Sie dieses Fenster inklusive zusätzlich geöffneten Fenster (Racks, Enclosure, Lieferungen etc.) schließen wollen?", "Schließen der Fenster bestätigen", 
                    MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.Yes)
                {
                    RackWindow[] rackWindows = hub.RackWindows.Values.ToArray();
                    for (int i = rackWindows.Count(); i > 0; i--)
                    {
                        rackWindows[i - 1].Close();
                    }
                    EnclosureWindow[] encWindows = hub.EnclosureWindows.Values.ToArray();
                    for (int i = encWindows.Count(); i > 0; i--)
                    {
                        encWindows[i - 1].Close();
                    }
                    if (hub.EnclosureTypesWindow != null)
                        hub.EnclosureTypesWindow.Close();
                }
                else
                {
                    e.Cancel = true;
                }
            }
        }

        private void RefreshData_Click(object sender, RoutedEventArgs e)
        {
            LoadData();
        }

        private void btnOpenRackWindow_Click(object sender, RoutedEventArgs e)
        {
            Guid rackId = (Guid)lstRack.SelectedValue;
            OpenOrFocusRackWindow(rackId);
        }

        /// <summary>
        /// Falls ein Fenster zum Rack existiert, wird dieses in den Vorderungrund geholt, ansonsten wird ein neues Fenster geöffnet.
        /// </summary>
        /// <param name="rackId">Guid des Racks</param>
        /// <returns></returns>
        private RackWindow OpenOrFocusRackWindow(Guid rackId)
        {
            RackWindow rack;
            if (hub.RackWindows.Keys.Contains(rackId))
            {
                rack = hub.RackWindows[rackId];
                rack.Focus();
            }
            else
            {
                rack = new RackWindow(rackId);
                hub.RackWindows.Add(rackId, rack);
                rack.Show();
            }
            return rack;
        }

        /// <summary>
        /// Prüft, ob ein Fenster zur Eingabe der Enclosure-Typen bereits geöffnet ist und fokussiert auf dieses, oder öffnet es neu
        /// </summary>
        private void OpenOrFocusEnclosureTypesWindow()
        {
            if (hub.EnclosureTypesWindow == null)
            {
                hub.EnclosureTypesWindow = new EnclosureTypesWindow();
                hub.EnclosureTypesWindow.Show();
            }
            else
            {
                hub.EnclosureTypesWindow.Focus();
            }

        }

        private void btnOpenRacksWithEnclosures_Click(object sender, RoutedEventArgs e)
        {
            foreach (Rack rack in hub.GetRacksInRoom((Guid)lstRoom.SelectedValue))
            {
                if (hub.GetEnclosuresInRack(rack.id).Count() > 0)
                    OpenOrFocusRackWindow(rack.id);
            }
        }

        private void workerGif_MediaEnded(object sender, RoutedEventArgs e)
        {
            workerVid.Position = TimeSpan.MinValue;
            workerVid.Play();
        }

        private void btnOpenRackForEnclosure_Click(object sender, RoutedEventArgs e)
        {
            OpenOrFocusRackWindow(((BladeEnclosure)lstEnclosure.SelectedItem).ConnectionToRack.SecondItem.id).HighlightElement((BladeEnclosure)lstEnclosure.SelectedItem);
        }

        private void rbServerType_Checked(object sender, RoutedEventArgs e)
        {
            if (lblServerType == null || sender == null)
                return;
            lblServerType.Text = ((sender as RadioButton).Content.ToString());
            if (lblServerType.Text.Equals("Alle"))
                lblServerType.Text = "Name";
            RefreshServerList(lblServerType.Text);
            lstServerName_SelectionChanged(null, null);
        }

        /// <summary>
        /// Auto-Complete-ähnliche Funktion. Beim Drücken von Enter werden die Items herausgesucht, die die Eingabe im Text enthalten
        /// </summary>
        /// <param name="text">Suchtext</param>
        private void RefreshServerList(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return;
            lstServerName.ItemsSource = null;
            lstServerName.ItemsSource = text.Equals("Name") ? hub.GetProvisionedSystems(lstServerName.Text) : hub.GetProvisionedSystems(lstServerName.Text, text);
            if (lstServerName.Items.Count > 0)
                lstServerName.IsDropDownOpen = true;
        }

        private void lstServerName_KeyUp(object sender, System.Windows.Input.KeyEventArgs e)
        {
            if (lstServerName.SelectedIndex >= 0)
                return;
            if (e.Key == System.Windows.Input.Key.Return || e.Key == System.Windows.Input.Key.Enter)
            {
                RefreshServerList(lblServerType.Text);
                lstServerName_SelectionChanged(sender, null);
                e.Handled = true;
            }
        }

        private void lstServerName_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            btnOpenRackForServer.IsEnabled = lstServerName.SelectedIndex >= 0;
        }

        private void btnOpenRackForServer_Click(object sender, RoutedEventArgs e)
        {
            if (lstServerName.SelectedItem == null)
                return;
            Rack r = hub.GetRackForProvisionedSystem((ProvisionedSystem)lstServerName.SelectedItem);
            if (r == null)
            {
                MessageBox.Show("Die Server-Hardware ist in kein Rack eingebaut.", "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }
            OpenOrFocusRackWindow(r.id).HighlightElement(hub.GetHardware((ProvisionedSystem)lstServerName.SelectedItem));
        }

        private void lstSerialContent_KeyUp(object sender, System.Windows.Input.KeyEventArgs e)
        {
            if (lstSerialContent.SelectedIndex >= 0)
                return;
            if (e.Key == System.Windows.Input.Key.Return || e.Key == System.Windows.Input.Key.Enter)
            {
                RefreshSerialList();
                lstSerialContent_SelectionChanged(sender, null);
                e.Handled = true;
            }
        }

        /// <summary>
        /// Holt alle Assets, die einen Teil der Seriennummer enthalten
        /// </summary>
        private void RefreshSerialList()
        {
            lstSerialContent.ItemsSource = null;
            lstSerialContent.ItemsSource = hub.GetAssetForSerialPart(lstSerialContent.Text);
            if (lstSerialContent.Items.Count > 0)
                lstSerialContent.IsDropDownOpen = true;
        }

        private void lstSerialContent_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            btnOpenRackForSerial.IsEnabled = lstSerialContent.SelectedIndex >= 0;
        }

        private void btnOpenRackForSerial_Click(object sender, RoutedEventArgs e)
        {
            if (lstSerialContent.SelectedItem == null)
                return;
            Rack r = hub.GetRackForAsset((Asset)lstSerialContent.SelectedItem);
            if (r == null)
            {
                MessageBox.Show("Dieses Asset ist in kein Rack eingebaut.", "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }
            OpenOrFocusRackWindow(r.id).HighlightElement((Asset)lstSerialContent.SelectedItem);
        }

        private void mnuEnclosureTypes_Click(object sender, RoutedEventArgs e)
        {
            OpenOrFocusEnclosureTypesWindow();
        }

        private void ManageSystems_Click(object sender, RoutedEventArgs e)
        {
            SystemsWindow w = new SystemsWindow(false);
            w.ShowDialog();
        }
    }
}
