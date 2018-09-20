using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using RZManager.Objects;
using RZManager.Objects.Assets;
using RZManager.BusinessLogic;
using RZManager.HardwareWindows;
using RZManager.HardwareWindows.Blades;

namespace RZManager.HardwareWindows.Racks
{
    /// <summary>
    /// Interaction logic for RackWindow.xaml
    /// </summary>
    public partial class RackWindow : Window
    {
        public RackWindow(int rackId)
        {
            InitializeComponent();

            this.Top = 0;

            rack = hub.GetRack(rackId);

            hub.DataHasChanged += DataHasChanged;

            this.Title = rack.Name;

            FillRack();

            this.Height = System.Windows.Forms.Screen.PrimaryScreen.WorkingArea.Height;
            this.Width = 600;
        }

        private void DataHasChanged(object sender, EventArgs e)
        {
            Dispatcher.BeginInvoke(new Action(() => FillRack()));
        }

        private bool[] heightUnitIsFilled;

        private DataHub hub = DataHub.GetInstance();

        private Rack rack;

        private Button highlightedButton;

        /// <summary>
        /// Füllt ein Rack mit rackmontierbaren Geräten als Buttons
        /// </summary>
        public void FillRack()
        {
            heightUnitIsFilled = new bool[rack.MaxHeight + 1];

            CreateRackRows(rack.MaxHeight);

            // Zuerst die blockierten Höheneinheiten belegen, damit die eigentlichen Geräte 
            // als Fehler gemeldet werden, wenn sie auf blockierte Einheiten abgelegt werden sollen.
            foreach (BlockedUnit bu in hub.GetBlockedUnits(rack))
            {
                CreateBlockedUnitInRack(bu, rack.MaxHeight);
            }

            foreach (BladeEnclosure enc in hub.GetEnclosuresInRack(rack.id))
            {
                CreateEnclosure(enc, hub.GetBladeServersInEnclosure(enc.id), rack.MaxHeight);
            }

            foreach (RackServer rs in hub.GetRackServersInRack(rack.id))
            {
                CreateRackServer(rs, rack.MaxHeight);
            }

            foreach (PDU pdu in hub.GetPDUsInRack(rack.id))
            {
                CreateRackMountable(pdu, rack.MaxHeight);
            }

            foreach (SanSwitch ssw in hub.GetSanSwitchesInRack(rack.id))
            {
                CreateRackMountable(ssw, rack.MaxHeight);
            }

            foreach (StorageSystem ssw in hub.GetStorageSystemsInRack(rack.id))
            {
                CreateRackMountable(ssw, rack.MaxHeight);
            }

            foreach (BackupSystem ssw in hub.GetBackupSystemsInRack(rack.id))
            {
                CreateRackMountable(ssw, rack.MaxHeight);
            }

            foreach (HardwareAppliance hwap in hub.GetHardwareAppliancesInRack(rack.id))
            {
                CreateRackMountable(hwap, rack.MaxHeight);
            }

            foreach (GenericRackMountable grm in hub.GetGenericRackMountablesInRack(rack.id))
            {
                CreateRackMountable(grm, rack.MaxHeight);
            }

            for (int i = 1; i <= rack.MaxHeight; i++)
            {
                if (!heightUnitIsFilled[i])
                {
                    Button button = new Button()
                    {
                        VerticalContentAlignment = VerticalAlignment.Center,
                        Background = new LinearGradientBrush(Colors.White, Colors.LightGray, 90),
                        MinHeight = Properties.Settings.Default.MinimumHeight,
                        Content = "(leer)",
                        ContextMenu = CreateEmptyRackspaceContextMenu(i),
                    };
                    spMain.Children.Add(button);
                    Grid.SetColumn(button, 1);
                    Grid.SetRow(button, rack.MaxHeight - i);
                }
            }
        }

        /// <summary>
        /// Füllt die Höheneinheiten eines Racks
        /// </summary>
        /// <param name="maxHeight">Maximale Höheneinheit (Start ab 1)</param>
        private void CreateRackRows(int maxHeight)
        {
            spMain.Children.Clear();
            spMain.RowDefinitions.Clear();

            for (int i = 1; i < maxHeight + 1; i++)
            {
                spMain.RowDefinitions.Add(new RowDefinition() { MinHeight = Properties.Settings.Default.MinimumHeight, });
                Border b = new Border();
                TextBlock tb = new TextBlock() { Text = string.Format("{0:00}", i) };
                b.Child = tb;
                spMain.Children.Add(b);
                Grid.SetColumn(b, 0);
                Grid.SetRow(b, maxHeight - i);
            }
        }

        /// <summary>
        /// Prüft, ob eine Höheneinheit bereits gefüllt wurde, und füllt sie
        /// </summary>
        /// <param name="heightUnit">Höheneinheit, die überprüft werden soll</param>
        /// <param name="rm">Das Rack-montierbare System, das eingebaut wird</param>
        private void FillRackRow(int heightUnit, RackMountable rm)
        {
            if (heightUnit == 0)
                MessageBox.Show(string.Format("Die Höheneinheit 0 darf nicht belegt werden: {1}", heightUnit, rm.Name));
            if (heightUnitIsFilled[heightUnit])
                MessageBox.Show(string.Format("Die Höheneinheit {0} soll doppelt belegt werden: {1}", heightUnit, rm.Name));
            heightUnitIsFilled[heightUnit] = true;
        }

        /// <summary>
        /// Prüft, ob ein Bereich von Höheneinheiten bereits gefüllt wurde, und füllt sie
        /// </summary>
        /// <param name="rm">Das Rack-montierbare System, das eingebaut wird</param>
        private void FillRackRows(RackMountable rm)
        {
            for (int i = rm.ConnectionToRack.MinSlot; i <= rm.ConnectionToRack.MaxSlot; i++)
            {
                FillRackRow(i, rm);
            }
        }

        /// <summary>
        /// Gibt die untere Grenze des freien Bereichs ab der aktuellen Position zurück
        /// </summary>
        /// <param name="position">Aktuelle Position</param>
        /// <returns></returns>
        private int GetLowerFreeSpaceBoundaryFromPosition(int position)
        {
            for (int i = position; i > 1; i--)
            {
                if (heightUnitIsFilled[i])
                    return i + 1;
            }
            return 1;
        }

        /// <summary>
        /// Gibt die obere Grenze des freien Bereichs ab der aktuellen Position zurück
        /// </summary>
        /// <param name="position">Aktuelle Position</param>
        /// <returns></returns>
        private int GetUpperFreeSpaceBoundaryFromPosition(int position)
        {
            for (int i = position; i < rack.MaxHeight; i++)
            {
                if (heightUnitIsFilled[i])
                    return i - 1;
            }
            return rack.MaxHeight;
        }

        #region CreateButtonsforContent

        /// <summary>
        /// Erzeugt die Rackserver und prüft, ob der Platz schon belegt ist
        /// </summary>
        /// <param name="serv">Rack-Server</param>
        /// <param name="maxHeight">Maximale Höheneinheit (Start ab 1)</param>
        /// <returns></returns>
        private Button CreateRackServer(RackServer serv, int maxHeight)
        {
            Button button = CreateRackMountable(serv, maxHeight);
            button.Content = hub.GetFullServerName(serv);
            return button;
        }

        private Button CreateBlockedUnitInRack(BlockedUnit bu, int maxHeight)
        {
            FillRackRow(bu.Unit, null);
            Button button = new Button()
            {
                VerticalAlignment = VerticalAlignment.Center,
                Background = (Brush)new BrushConverter().ConvertFromString(bu.ForegroundColor),
                MinHeight = Properties.Settings.Default.MinimumHeight,
                Content = string.Format("Belegt: {0}", bu.Reason),
                ContextMenu = CreateBlockedUnitContextMenu(bu),
                Tag = bu,
            };
            spMain.Children.Add(button);
            Grid.SetColumn(button, 1);
            Grid.SetRow(button, maxHeight - bu.Unit);
            return button;
        }

        /// <summary>
        /// Erzeugt ein in ein Rack einbaubares Item
        /// </summary>
        /// <param name="rm">Item, das ins Rack eingebaut wird</param>
        /// <param name="maxHeight">Maximale Höheneinheit (Start ab 1)</param>
        private Button CreateRackMountable(RackMountable rm, int maxHeight)
        {
            FillRackRows(rm);
            Button button = new Button()
            {
                VerticalContentAlignment = VerticalAlignment.Center,
                Background = StatusConverter.GetBrushForStatus(rm.Status),
                MinHeight = Properties.Settings.Default.MinimumHeight * (1 + rm.ConnectionToRack.MaxSlot - rm.ConnectionToRack.MinSlot),
                Content = rm.TypeName + ": " + rm.Name,
                ContextMenu = CreateRackMountableContextMenu(rm),
                Tag = rm,
                ToolTip = rm.ProductName,
            };
            spMain.Children.Add(button);
            Grid.SetColumn(button, 1);
            Grid.SetRow(button, maxHeight - rm.ConnectionToRack.MaxSlot);
            Grid.SetRowSpan(button, 1 + rm.ConnectionToRack.MaxSlot - rm.ConnectionToRack.MinSlot);
            return button;
        }

        #endregion

        #region CreateEnclosureButtons

        /// <summary>
        /// Erzeugt ein Enclosure
        /// </summary>
        /// <param name="enc">Enclosure</param>
        /// <param name="bladeservers">Im Enclosure enthaltene Bladeserver</param>
        /// <param name="maxHeight">Maximale Höheneinheiten im Rack</param>
        /// <returns></returns>
        private void CreateEnclosure(BladeEnclosure enc, IEnumerable<BladeServer> bladeservers, int maxHeight)
        {
            Border b = new Border()
            {
                Background = StatusConverter.GetBrushForStatus(enc.Status),
                ToolTip = enc.ProductName,
            };
            FillRackRows(enc);
            Grid gr = CreateEnclosureGrid(enc);

            for (int j = 0; j < enc.EnclosureType.ServerCountVertical; j++)
            {
                for (int k = 0; k < enc.EnclosureType.ServerCountHorizontal; k++)
                {
                    int slot = j * enc.EnclosureType.ServerCountHorizontal + k + 1;
                    Button button = CreateBladeServers(enc, bladeservers, slot);
                    gr.Children.Add(button);
                    Grid.SetRow(button, j);
                    Grid.SetColumn(button, k + 1);
                }
            }
            b.Child = gr;
            spMain.Children.Add(b);
            Grid.SetColumn(b, 1);
            Grid.SetRow(b, maxHeight - enc.ConnectionToRack.MaxSlot);
            Grid.SetRowSpan(b, 1 + enc.ConnectionToRack.MaxSlot - enc.ConnectionToRack.MinSlot);
        }

        /// <summary>
        /// Erzeugt das Basis-Grid für ein Enclosure
        /// </summary>
        /// <param name="enc">Enclosure</param>
        /// <returns></returns>
        private Grid CreateEnclosureGrid(BladeEnclosure enc)
        {
            Grid gr = new Grid();
            gr.Margin = new Thickness(5);
            for (int j = 0; j < enc.EnclosureType.ServerCountVertical; j++)
            {
                gr.RowDefinitions.Add(new RowDefinition());
            }
            for (int j = 0; j < enc.EnclosureType.ServerCountHorizontal + 1; j++)
            {
                gr.ColumnDefinitions.Add(new ColumnDefinition());
            }
            gr.MinHeight = Properties.Settings.Default.MinimumHeight * (1 + enc.ConnectionToRack.MaxSlot - enc.ConnectionToRack.MinSlot);

            Button button = new Button()
            {
                VerticalContentAlignment = VerticalAlignment.Center,
                Background = Brushes.White,
                Margin = new Thickness(0, 5, 10, 5),
                ContextMenu = CreateBladeCenterContextMenu(enc),
                Content = new TextBlock()
                {
                    Text = enc.Name,
                    Style = Resources["RotatedText"] as Style,
                },
                Tag = enc,
            };
            gr.Children.Add(button);
            Grid.SetRow(button, 0);
            Grid.SetRowSpan(button, enc.EnclosureType.ServerCountVertical);
            Grid.SetColumn(button, 0);
            return gr;
        }

        /// <summary>
        /// Erzeugt einen Bladeserver oder eine Leerstelle im BladeCenter
        /// </summary>
        /// <param name="bladeservers">Liste der Bladeserve</param>
        /// <param name="slot">Slot, für den gesucht wird</param>
        /// <returns></returns>
        private Button CreateBladeServers(BladeEnclosure enc, IEnumerable<BladeServer> bladeservers, int slot)
        {
            Button button = new Button() { BorderThickness = new Thickness(2) };
            TextBlock tb = new TextBlock();
            if (enc.EnclosureType.ServerCountHorizontal > enc.EnclosureType.ServerCountVertical)
                tb.Style = Resources["RotatedText"] as Style;

            BladeServer blade = bladeservers.SingleOrDefault(s => s.Slot == slot);
            if (blade != null)
            {
                tb.Text = string.Format("Slot {0:00}\r\n{1}", slot, hub.GetFullServerName(blade));
                button.Background = StatusConverter.GetBrushForStatus(blade.Status);
                button.ContextMenu = CreateBladeServerContextMenu(blade);
                button.ToolTip = tb.Text + "\r\n" + blade.ProductName;
                button.Tag = blade;
            }
            else
            {
                BlockedUnit bu = hub.GetBlockedUnits(enc).SingleOrDefault(u => u.Unit == slot);
                if (bu != null)
                {
                    tb.Text = string.Format("Slot {0:00}\r\nBelegt: {1}", slot, bu.Reason);
                    button.Background = (Brush)new BrushConverter().ConvertFromString(bu.ForegroundColor);
                    button.ContextMenu = CreateBlockedUnitContextMenu(bu);
                }
                else
                {
                    tb.Text = string.Format("Slot {0:00}\r\n(leer)", slot);
                    button.Background = new LinearGradientBrush(Colors.White, Colors.LightGray, 90);
                    button.ContextMenu = CreateEmptyBladeSlotContextMenu(enc, slot);
                }
            }
            button.Content = tb;
            button.VerticalContentAlignment = VerticalAlignment.Stretch;
            button.HorizontalContentAlignment = HorizontalAlignment.Stretch;
            return button;
        }

        #endregion

        #region CreateContextMenus

        /// <summary>
        /// Erzeugt ein Kontextmenü für einen Rack-Server
        /// </summary>
        /// <param name="server">Rack-Server</param>
        /// <returns></returns>
        private ContextMenu CreateRackServerContextMenu(RackServer server)
        {
            ContextMenu menu = CreateRackMountableContextMenu(server);
            //menu.Items.Add(CreateUnmountItem(server));
            return menu;
        }

        /// <summary>
        /// Erzeugt ein Kontextmenü für einen Blade-Server
        /// </summary>
        /// <param name="blade">Blade-Server</param>
        /// <returns></returns>
        private ContextMenu CreateBladeServerContextMenu(BladeServer blade)
        {
            ContextMenu menu = new ContextMenu();
            menu.Items.Add(CreateViewItem(blade));
            switch (blade.Status)
            {
                case AssetStatus.Free:
                    if (blade.ConnectionToServer == null)
                    {
                        MenuItem productmenu = new MenuItem() { Header = "In Betrieb nehmen" };
                        menu.Items.Add(productmenu);
                        productmenu.Items.Add(CreateMenuItem("Server anlegen", SetServerSystemToProduction_Click, blade));
                        if (hub.GetUnmountedEsxHosts().Count() > 0)
                            productmenu.Items.Add(CreateMenuItem("ESX-Host verbinden", SetEsxHostSystemToProduction_Click, blade));
                        menu.Items.Add(CreateMenuItem("Reservieren", ReserveAsset_Click, blade));
                        menu.Items.Add(CreateMenuItem("Zur Aussonderung vorbereiten", PrepareAssetForScrap_Click, blade));
                        menu.Items.Add(CreateMenuItem("Ausbauen und ins Lager legen", UnmountAndStoreBladeServer_Click, blade));
                    }
                    else
                        menu.Items.Add(CreateMenuItem("Fehler korrigieren (In Betrieb nehmen)", SetAssetToProduction_Click, blade));
                    break;
                case AssetStatus.InProduction:
                    if (blade.ConnectionToServer == null)
                    {
                        menu.Items.Add(CreateMenuItem("Fehler korrigieren (In Betrieb nehmen)", SetAssetToProduction_Click, blade));
                    }
                    else
                        menu.Items.Add(CreateMenuItem("Freigeben", FreeAsset_Click, blade));
                    break;
                case AssetStatus.PendingScrap:
                    if (blade.ConnectionToServer != null)
                    {
                        menu.Items.Add(CreateMenuItem("Fehler korrigieren (In Betrieb nehmen)", SetAssetToProduction_Click, blade));
                    }
                    else
                        menu.Items.Add(CreateMenuItem("Inaktiv setzen", SetAssetPreparedForScrap_Click, blade));
                    break;
                case AssetStatus.SwitchedOff:
                    if (blade.ConnectionToServer != null)
                    {
                        menu.Items.Add(CreateMenuItem("Fehler korrigieren (In Betrieb nehmen)", SetAssetToProduction_Click, blade));
                    }
                    else
                        menu.Items.Add(CreateMenuItem("Aussondern", ScrapAsset_Click, blade));
                    break;
                case AssetStatus.Reserved:
                    if (blade.ConnectionToServer != null)
                    {
                        MenuItem productmenu = new MenuItem() { Header = "In Betrieb nehmen" };
                        menu.Items.Add(productmenu);
                        productmenu.Items.Add(CreateMenuItem("Server anlegen", SetServerSystemToProduction_Click, blade));
                        if (hub.GetUnmountedEsxHosts().Count() > 0)
                            productmenu.Items.Add(CreateMenuItem("ESX-Host verbinden", SetEsxHostSystemToProduction_Click, blade));
                        menu.Items.Add(CreateMenuItem("Freigeben", FreeAsset_Click, blade));
                    }
                    else
                        menu.Items.Add(CreateMenuItem("Fehler korrigieren (In Betrieb nehmen)", SetAssetToProduction_Click, blade));
                    break;
                case AssetStatus.Stored:
                    if (blade.ConnectionToServer != null)
                    {
                        menu.Items.Add(CreateMenuItem("Fehler korrigieren (In Betrieb nehmen)", SetAssetToProduction_Click, blade));
                    }
                    else
                    {
                        MenuItem submenu = new MenuItem() { Header = "Fehler korrigieren" };
                        menu.Items.Add(submenu);
                        submenu.Items.Add(CreateMenuItem("Ins Lager legen", UnmountAndStoreBladeServer_Click, blade));
                        submenu.Items.Add(CreateMenuItem("Status auf Frei ändern", FreeAsset_Click, blade));
                    }
                    break;
                case AssetStatus.Scrap:
                    menu.Items.Add(CreateMenuItem("Fehler korrigieren (ausbauen)", UnmountScrappedRackMountable_Click, blade));
                    break;
                default:
                    break;
            }
            return menu;
        }

        /// <summary>
        /// Erzeugt ein Kontextmenü für BladeCenter (Enclosures)
        /// </summary>
        /// <param name="enc">BladeCenter</param>
        /// <returns></returns>
        private ContextMenu CreateBladeCenterContextMenu(BladeEnclosure enc)
        {
            ContextMenu menu = CreateRackMountableContextMenu(enc);
            menu.Items.Add(CreateManageBladeEnclosureMenuItem(enc));
            return menu;
        }

        /// <summary>
        /// Erzeugt ein Kontextemenü, das ein eigenes Fenster für die Verwaltung eines Blade Enclosures öffnet
        /// </summary>
        /// <param name="enc"></param>
        /// <returns></returns>
        private MenuItem CreateManageBladeEnclosureMenuItem(BladeEnclosure enc)
        {
            return CreateMenuItem("Enclosure verwalten...", OpenOrFocusEnclosureWindow_Click, enc.id);
        }

        /// <summary>
        /// Erzeugt ein Kontextmenü für ein beliegibes, in ein Rack einbaubares System
        /// </summary>
        /// <param name="rm">Das System, für das das Menü erzeugt wird</param>
        /// <returns></returns>
        private ContextMenu CreateRackMountableContextMenu(RackMountable rm)
        {
            ContextMenu menu = new ContextMenu();
            menu.Items.Add(CreateViewItem(rm));
            switch (rm.Status)
            {
                case AssetStatus.Free:
                    if (rm is IProvisioningSystem)
                    {
                        if ((rm as IProvisioningSystem).ConnectionToServer == null)
                        {
                            MenuItem productmenu = new MenuItem() { Header = "In Betrieb nehmen" };
                            menu.Items.Add(productmenu);
                            productmenu.Items.Add(CreateMenuItem("Server anlegen", SetServerSystemToProduction_Click, rm));
                            if (hub.GetUnmountedEsxHosts().Count() > 0)
                                productmenu.Items.Add(CreateMenuItem("ESX-Host verbinden", SetEsxHostSystemToProduction_Click, rm));
                            menu.Items.Add(CreateMenuItem("Reservieren", ReserveAsset_Click, rm));
                            menu.Items.Add(CreateMenuItem("Ausbauen und ins Lager legen", UnmountAndStoreRackMountable_Click, rm));
                            menu.Items.Add(CreateMenuItem("Zur Aussonderung vorbereiten", PrepareAssetForScrap_Click, rm));
                        }
                        else
                            menu.Items.Add(CreateMenuItem("Fehler korrigieren (In Betrieb nehmen)", SetAssetToProduction_Click, rm));
                    }
                    else
                    {
                        menu.Items.Add(CreateMenuItem("In Betrieb nehmen", SetAssetToProduction_Click, rm));
                        menu.Items.Add(CreateMenuItem("Reservieren", ReserveAsset_Click, rm));
                        menu.Items.Add(CreateMenuItem("Ausbauen und ins Lager legen", UnmountAndStoreRackMountable_Click, rm));
                        menu.Items.Add(CreateMenuItem("Zur Aussonderung vorbereiten", PrepareAssetForScrap_Click, rm));
                    }
                    break;
                case AssetStatus.InProduction:
                    if (rm is IProvisioningSystem)
                    {
                        if ((rm as IProvisioningSystem).ConnectionToServer == null)
                            menu.Items.Add(CreateMenuItem("Fehler korrigieren (Freigeben)", FreeAsset_Click, rm));
                        else
                            menu.Items.Add(CreateMenuItem("Freigeben", FreeAsset_Click, rm));
                    }
                    else if (!(rm is BladeEnclosure) || hub.GetBladeServersInEnclosure(rm.id).Count() == 0)
                        menu.Items.Add(CreateMenuItem("Freigeben", FreeAsset_Click, rm));
                    break;
                case AssetStatus.PendingScrap:
                    if (rm is IProvisioningSystem && (rm as IProvisioningSystem).ConnectionToServer != null)
                        menu.Items.Add(CreateMenuItem("Fehler korrigieren (In Betrieb nehmen)", SetAssetToProduction_Click, rm));
                    else
                        menu.Items.Add(CreateMenuItem("Inaktiv setzen", SetAssetPreparedForScrap_Click, rm));
                    break;
                case AssetStatus.SwitchedOff:
                    if (rm is IProvisioningSystem && (rm as IProvisioningSystem).ConnectionToServer != null)
                        menu.Items.Add(CreateMenuItem("Fehler korrigieren (In Betrieb nehmen)", SetAssetToProduction_Click, rm));
                    else
                        menu.Items.Add(CreateMenuItem("Aussondern", ScrapAsset_Click, rm));
                    break;
                case AssetStatus.Reserved:
                    if (rm is IProvisioningSystem && (rm as IProvisioningSystem).ConnectionToServer != null)
                    {
                        MenuItem productmenu = new MenuItem() { Header = "In Betrieb nehmen" };
                        menu.Items.Add(productmenu);
                        productmenu.Items.Add(CreateMenuItem("Server anlegen", SetServerSystemToProduction_Click, rm));
                        if (hub.GetUnmountedEsxHosts().Count() > 0)
                            productmenu.Items.Add(CreateMenuItem("ESX-Host verbinden", SetEsxHostSystemToProduction_Click, rm));
                        menu.Items.Add(CreateMenuItem("Freigeben", FreeAsset_Click, rm));
                    }
                    else
                        menu.Items.Add(CreateMenuItem("In Betrieb nehmen", SetAssetToProduction_Click, rm));
                    break;
                case AssetStatus.Stored:
                    MenuItem submenu = new MenuItem() { Header = "Fehler korrigieren" };
                    menu.Items.Add(submenu);
                    submenu.Items.Add(CreateMenuItem("Ins Lager legen", UnmountAndStoreRackMountable_Click, rm));
                    submenu.Items.Add(CreateMenuItem("Status auf Frei ändern", FreeAsset_Click, rm));
                    break;
                case AssetStatus.Scrap:
                    menu.Items.Add(CreateMenuItem("Fehler korrigieren (ausbauen)", UnmountScrappedRackMountable_Click, rm));
                    break;
                default:
                    break;
            }
            return menu;
        }

        private ContextMenu CreateBlockedUnitContextMenu(BlockedUnit bu)
        {
            ContextMenu menu = new ContextMenu();
            menu.Items.Add(CreateRemoveBlockItem(bu));
            return menu;
        }

        /// <summary>
        /// Erzeugt ein Kontextmenü für einen leeren Rack-Platz
        /// </summary>
        /// <param name="heightUnit">Höheneinheit</param>
        /// <returns></returns>
        private ContextMenu CreateEmptyRackspaceContextMenu(int heightUnit)
        {
            ContextMenu menu = new ContextMenu();
            menu.Items.Add(CreateMountRackItem(heightUnit));
            menu.Items.Add(CreateBlockedUnitInRackItem(heightUnit));
            return menu;
        }

        /// <summary>
        /// Erzeugt einen Kontextmenüeintrag für einen freien Rackeinschub
        /// </summary>
        /// <param name="heightUnit">Höhenheinheit</param>
        /// <returns></returns>
        private MenuItem CreateBlockedUnitInRackItem(int heightUnit)
        {
            return CreateMenuItem("Belegung...", BlockRackUnit_Click, heightUnit);
        }

        /// <summary>
        /// Erzeugt ein Kontextmenü für einen leeren BladeCenter-Slot
        /// </summary>
        /// <param name="enc">BladeCenter</param>
        /// <param name="slot">Slotnummer</param>
        /// <returns></returns>
        private ContextMenu CreateEmptyBladeSlotContextMenu(BladeEnclosure enc, int slot)
        {
            ContextMenu menu = new ContextMenu();
            if (hub.UnmountedBladeServersCount > 0)
                menu.Items.Add(CreateMountBladeMenuItem(slot));
            menu.Items.Add(CreateBlockedUnitInEnclosureItem(enc, slot));
            menu.Tag = enc;
            return menu;
        }

        private MenuItem CreateBlockedUnitInEnclosureItem(BladeEnclosure enc, int slot)
        {
            return CreateMenuItem("Belegung...", BlockEnclosureSlot_Click, slot);
        }

        /// <summary>
        /// Erzeugt einen Menüpunkt
        /// </summary>
        /// <param name="text">Text, der angezeigt wird</param>
        /// <param name="clickMethod"></param>
        /// <returns></returns>
        private MenuItem CreateMenuItem(string text, RoutedEventHandler clickMethod)
        {
            return CreateMenuItem(text, clickMethod, null);
        }

        /// <summary>
        /// Erzeugt ein MenuItem
        /// </summary>
        /// <param name="headerText">Angezeigter Text</param>
        /// <param name="clickMethod">Rückruf-Methode für Click-Ereignis</param>
        /// <param name="tag">Objekt, das mit dem MenuItem verbunden wird</param>
        /// <returns></returns>
        private MenuItem CreateMenuItem(string headerText, RoutedEventHandler clickMethod, object tag)
        {
            MenuItem m = new MenuItem() { Header = headerText, Tag = tag };
            m.Click += clickMethod;
            return m;
        }

        private MenuItem CreateRemoveBlockItem(BlockedUnit bu)
        {
            return CreateMenuItem("Belegung freigeben", UnblockUnit_Click, bu);
        }

        private MenuItem CreateMountBladeMenuItem(int slot)
        {
            return CreateMenuItem("Blade Server einbauen", MountBladeServer_Click, slot);
        }

        private MenuItem CreateMountRackItem(int heightUnit)
        {
            MenuItem m = new MenuItem() { Header = "Einbauen" };
            if (hub.UnmountedEnclosuresCount > 0)
                m.Items.Add(CreateMenuItem("Blade Enclosure", MountBladeEnclosure_Click, heightUnit));
            if (hub.UnmountedRackServersCount > 0)
                m.Items.Add(CreateMenuItem("Rack Server", MountRackServer_Click, heightUnit));
            if (hub.UnmountedStorageSystemsCount > 0)
                m.Items.Add(CreateMenuItem("Storage-System", MountStorageSystem_Click, heightUnit));
            if (hub.UnmountedBackupSystemsCount > 0)
                m.Items.Add(CreateMenuItem("Backup-System", MountBackupSystem_Click, heightUnit));
            if (hub.UnmountedPDUsCount > 0)
                m.Items.Add(CreateMenuItem("PDU", MountPDU_Click, heightUnit));
            if (hub.UnmountedSanSwitchesCount > 0)
                m.Items.Add(CreateMenuItem("SAN-Switch", MountSanSwitch_Click, heightUnit));
            m.Items.Add(CreateMenuItem("Sonstiges Item", MountAnyItem_Click, heightUnit));
            if (m.Items.Count == 0)
                m.IsEnabled = false;
            return m;
        }

        /// <summary>
        /// Erzeugt ein Menüitem zur Ansicht in der CMDB bzw. in assyst
        /// </summary>
        /// <param name="asset">Item</param>
        /// <returns></returns>
        private MenuItem CreateViewItem(Asset asset)
        {
            return CreateMenuItem("Item in assyst anzeigen", ViewItem_Click, string.Format(hub.AssystSystemBaseUrl + Properties.Settings.Default.assystWebGuiPath, asset.id));
        }

        private void ViewItem_Click(object sender, RoutedEventArgs e)
        {
            string url = (e.Source as MenuItem).Tag.ToString();
            System.Diagnostics.Process.Start(url);
        }

        #endregion

        #region ChangeStatus

        private void ReserveAsset_Click(object sender, RoutedEventArgs e)
        {
            Asset asset = (Asset)(e.Source as MenuItem).Tag;
            InputTextWindow win = new InputTextWindow("Reservierung", "Bitte ggf. zusätzlichen Text (nach für) eingeben:");
            if (win.ShowDialog() == true)
            {
                string errorMessage;
                if (!hub.ReserveAsset(asset, win.InputText, out errorMessage))
                    MessageBox.Show(errorMessage, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);

            }
        }

        private void PrepareAssetForScrap_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            Asset rm = (e.Source as MenuItem).Tag as Asset;
            if (MessageBox.Show(string.Format("Sind Sie sicher, dass Sie das Gerät {0} für die Aussonderung vorbereiten möchten?", rm.Name), "Sicherheitsprüfung", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
            {
                if (!hub.PrepareAssetForScrap(rm, out errorMessage))
                    MessageBox.Show(errorMessage, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void SetEsxHostSystemToProduction_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            IProvisioningSystem iProvisioningSystem = (IProvisioningSystem)(e.Source as MenuItem).Tag;
            MountEnclosureMountableWindow w = new MountEnclosureMountableWindow(hub.GetUnmountedEsxHosts(), Properties.Settings.Default.ESXHostProductName);
            if (w.ShowDialog() == false)
                return;
            if (!hub.CreateConnectionToProvisionable(w.SelectedItem as ProvisionedSystem, iProvisioningSystem, out errorMessage))
            {
                MessageBox.Show(errorMessage, "Fehler beim Anlegen der Verbindung.\r\nDaher wird das Gerät auch nicht in Betrieb genommen.", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
            else
                SetAssetToProduction_Click(sender, e);
        }

        private void SetServerSystemToProduction_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            IProvisioningSystem iProvisioningSystem = (IProvisioningSystem)(e.Source as MenuItem).Tag;
            AddProvisionedSystemWindow w = new AddProvisionedSystemWindow(iProvisioningSystem);
            if (w.ShowDialog() == false)
                return;
            if (!hub.CreateConnectionToProvisionable(w.Server, iProvisioningSystem, out errorMessage))
            {
                MessageBox.Show(errorMessage, "Fehler beim Anlegen der Verbindung, Server wurde angelegt, aber nicht verbunden.\r\nDaher wird das Gerät auch nicht in Betrieb genommen.", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
            else
                SetAssetToProduction_Click(sender, e);
        }

        private void SetAssetToProduction_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            Asset asset = (Asset)(e.Source as MenuItem).Tag;
            if (!hub.SetAssetToProduction(asset, out errorMessage))
                MessageBox.Show(errorMessage, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
        }

        private void SetAssetPreparedForScrap_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            Asset rm = (e.Source as MenuItem).Tag as Asset;
            if (MessageBox.Show(string.Format("Sind Sie sicher, dass Sie das Gerät {0} als Inaktiv (für die Aussonderung vorbereitet) melden möchten?", rm.Name), "Sicherheitsprüfung", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
            {
                if (!hub.InactivateAssetForScrap(rm, out errorMessage))
                    MessageBox.Show(errorMessage, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void OpenOrFocusEnclosureWindow_Click(object sender, RoutedEventArgs e)
        {
            int encId = (int)(sender as MenuItem).Tag;
            EnclosureWindow encWindow;
            if (hub.EnclosureWindows.Keys.Contains(encId))
            {
                encWindow = hub.EnclosureWindows[encId];
                encWindow.Focus();
            }
            else
            {
                encWindow = new EnclosureWindow(encId);
                hub.EnclosureWindows.Add(encId, encWindow);
                encWindow.Show();
            }
        }

        private void FreeAsset_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            Asset asset = (e.Source as MenuItem).Tag as Asset;
            string text;
            if (asset is IProvisioningSystem && (asset as IProvisioningSystem).ConnectionToServer != null)
            {
                ProvisionedSystem server = (asset as IProvisioningSystem).ConnectionToServer.FirstItem as ProvisionedSystem;
                text = string.Format("Auf der Hardware läuft {0} {1}. Dies wird bei der Außerbetriebnahme des Geräts {2} gelöscht.\r\nSind Sie Sicher, dass Sie das wollen?", server.TypeName, server.Name, asset.Name);
            }
            else
                text = string.Format("Sind Sie sicher, dass Sie das Gerät {0} außer Betrieb nehmen und freimelden möchten?", asset.Name);
            if (MessageBox.Show(text, "Sicherheitsprüfung", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
            {
                if (!hub.FreeAsset(asset, out errorMessage))
                    MessageBox.Show(errorMessage, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void ScrapAsset_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            Asset a = (Asset)(e.Source as MenuItem).Tag;
            if (MessageBox.Show(string.Format("Sind Sie sicher, dass Sie das Gerät {0} endgültig aussondern möchten?", a.Name), "Sicherheitsprüfung", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
            {
                if (!hub.ScrapAsset(a, out errorMessage))
                    MessageBox.Show(errorMessage, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        #endregion

        #region MountItems

        private void MountBladeServer_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            int slot = (int)(e.Source as MenuItem).Tag;
            BladeEnclosure enc = ((e.Source as MenuItem).Parent as ContextMenu).Tag as BladeEnclosure;
            MountEnclosureMountableWindow w = new MountEnclosureMountableWindow(hub.GetUnmountedBladeServers(), Properties.Settings.Default.BladeServerHardwareProductClassName);
            if (w.ShowDialog() == true)
            {
                if (!hub.CreateConnectionToEnclosure(w.SelectedItem as BladeServer, enc, AssetStatus.Free, string.Format("Slot: {0}", slot), out errorMessage))
                {
                    MessageBox.Show(errorMessage, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }

        private void MountRackServer_Click(object sender, RoutedEventArgs e)
        {
            int heightUnit = (int)(e.Source as MenuItem).Tag;
            MountRackMountable(hub.GetUnmountedRackServers(), heightUnit, (e.Source as MenuItem).Header.ToString());
        }

        private void MountStorageSystem_Click(object sender, RoutedEventArgs e)
        {
            int heightUnit = (int)(e.Source as MenuItem).Tag;
            MountRackMountable(hub.GetUnmountedStorageSystems(), heightUnit, (e.Source as MenuItem).Header.ToString());
        }

        private void MountBackupSystem_Click(object sender, RoutedEventArgs e)
        {
            int heightUnit = (int)(e.Source as MenuItem).Tag;
            MountRackMountable(hub.GetUnmountedBackupSystems(), heightUnit, (e.Source as MenuItem).Header.ToString());
        }

        private void MountPDU_Click(object sender, RoutedEventArgs e)
        {
            int heightUnit = (int)(e.Source as MenuItem).Tag;
            MountRackMountable(hub.GetUnmountedPDUs(), heightUnit, (e.Source as MenuItem).Header.ToString());
        }

        private void MountSanSwitch_Click(object sender, RoutedEventArgs e)
        {
            int heightUnit = (int)(e.Source as MenuItem).Tag;
            MountRackMountable(hub.GetUnmountedSanSwitches(), heightUnit, (e.Source as MenuItem).Header.ToString());
        }

        private void MountBladeEnclosure_Click(object sender, RoutedEventArgs e)
        {
            int heightUnit = (int)(e.Source as MenuItem).Tag;
            MountRackMountable(hub.GetUnmountedEnclosures(), heightUnit, (e.Source as MenuItem).Header.ToString());
        }

        private void MountRackMountable(IEnumerable<RackMountable> rackMountables, int heightUnit, string title)
        {
            if (rackMountables == null || rackMountables.Count() == 0)
            {
                MessageBox.Show(string.Format("Es wurden keine CIs vom Typ {0} gefunden, die eingebaut werden können.", title), "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }
            MountRackMountableWindow win = new MountRackMountableWindow(rackMountables, hub.Products, rack, title, heightUnit, GetLowerFreeSpaceBoundaryFromPosition(heightUnit), GetUpperFreeSpaceBoundaryFromPosition(heightUnit));
            if (win.ShowDialog() == true)
            {
                string message;
                if (!hub.CreateConnectionToRack(win.SelectedItem, rack, win.CurrentHeightUnit, win.TotalHeightUnits, out message))
                    MessageBox.Show(message, "Fehler beim Anlegen der Verbindung", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void MountAnyItem_Click(object sender, RoutedEventArgs e)
        {
            int heightUnit = (int)(e.Source as MenuItem).Tag;
            SelectAnyItemWindow ws = new SelectAnyItemWindow();
            if (ws.ShowDialog() == true)
            {
                GenericRackMountable grm = ws.SelectedItem;
                if (!hub.Products.Contains(ws.SelectedProduct))
                    hub.Products.Add(ws.SelectedProduct);
                MountRackMountableWindow win = new MountRackMountableWindow(new RackMountable[] { grm }, new assystConnector.Objects.Product[] { ws.SelectedProduct }, rack, grm.TypeName, 
                    heightUnit, GetLowerFreeSpaceBoundaryFromPosition(heightUnit), GetUpperFreeSpaceBoundaryFromPosition(heightUnit));
                if (win.ShowDialog() == true)
                {
                    string message;
                    if (!hub.CreateConnectionToRack(win.SelectedItem, rack, win.CurrentHeightUnit, win.TotalHeightUnits, out message))
                        MessageBox.Show(message, "Fehler beim Anlegen der Verbindung", MessageBoxButton.OK, MessageBoxImage.Error);
                }

            }
        }

        #endregion

        #region UnmountItems

        /// <summary>
        /// Wird benötigt, wenn der Status nicht verändert werden soll, aber die Verbindung zum Rack gekappt. Nur bei ausgesonderten Items, die noch im Rack sind.
        /// </summary>
        private void UnmountScrappedRackMountable_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            RackMountable rm = (RackMountable)(e.Source as MenuItem).Tag;
            if (!hub.RemoveConnectionToRack(rm, rm.Status, out errorMessage))
                MessageBox.Show(errorMessage, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
        }

        private void UnmountAndStoreRackMountable_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            RackMountable rm = (RackMountable)(e.Source as MenuItem).Tag;
            if (MessageBox.Show(string.Format("Sind Sie sicher, dass Sie das Gerät {0} ausbauen möchten?", rm.Name), "Sicherheitsprüfung", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
            {
                if (!hub.RemoveConnectionToRack(rm, AssetStatus.Stored, out errorMessage))
                    MessageBox.Show(errorMessage, "Fehler beim Löschen der Verbindung", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void UnmountAndStoreBladeServer_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            BladeServer bs = (BladeServer)(e.Source as MenuItem).Tag;
            if (MessageBox.Show(string.Format("Sind Sie sicher, dass Sie den Blade Server {0} ausbauen möchten?", bs.Name), "Sicherheitsprüfung", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
            {
                if (!hub.RemoveConnectionToEnclosure(bs, AssetStatus.Stored, out errorMessage))
                    MessageBox.Show(errorMessage, "Fehler beim Löschen der Verbindung", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        #endregion

        #region BlockUnits

        private void BlockRackUnit_Click(object sender, RoutedEventArgs e)
        {
            int heightUnit = (int)(e.Source as MenuItem).Tag;
            BlockRackUnitWindow win = new BlockRackUnitWindow(rack, heightUnit, GetLowerFreeSpaceBoundaryFromPosition(heightUnit), GetUpperFreeSpaceBoundaryFromPosition(heightUnit));
            if (win.ShowDialog() == true)
            {
                hub.AddBlockedUnits(win.BlockedUnits);
            }
        }

        private void UnblockUnit_Click(object sender, RoutedEventArgs e)
        {
            hub.RemoveBlockedUnit((BlockedUnit)(e.Source as MenuItem).Tag);
        }

        private void BlockEnclosureSlot_Click(object sender, RoutedEventArgs e)
        {
            int slot = (int)(e.Source as MenuItem).Tag;
            BladeEnclosure enc = (BladeEnclosure)((e.Source as MenuItem).Parent as ContextMenu).Tag;
            BlockEnclosureSlotWindow win = new BlockEnclosureSlotWindow(enc, slot);
            if (win.ShowDialog() == true)
            {
                hub.AddBlockedUnit(win.BlockedSlot);
            }
        }

        #endregion

        /// <summary>
        /// Fügt einen roten Rahmen um ein Element
        /// </summary>
        /// <param name="asset">Item, das hervorgehoben werden soll</param>
        public void HighlightElement(Asset asset)
        {
            if (highlightedButton != null)
                highlightedButton.Style = Application.Current.TryFindResource(typeof(Button)) as Style;
            IEnumerable<Button> buttons = FindVisualChildren<Button>(this);
            highlightedButton = buttons.SingleOrDefault(b => b.Tag != null && b.Tag.Equals(asset));
            if (highlightedButton != null)
            {
                highlightedButton.Style = Resources["HighLightedButtonStyle"] as Style;
            }
        }

        /// <summary>
        /// Lambda-Funktion: Findet ein Kindelement eines angegebenen Typs
        /// </summary>
        /// <typeparam name="T">Typ, nach dem gesucht wird</typeparam>
        /// <param name="depObj">Objekt, in dessen Kindern gesucht wird</param>
        /// <returns></returns>
        public static IEnumerable<T> FindVisualChildren<T>(DependencyObject depObj) where T : DependencyObject
        {
            if (depObj != null)
            {
                for (int i = 0; i < VisualTreeHelper.GetChildrenCount(depObj); i++)
                {
                    DependencyObject child = VisualTreeHelper.GetChild(depObj, i);
                    if (child != null && child is T)
                        yield return (T)child;

                    foreach (T childOfChild in FindVisualChildren<T>(child))
                    {
                        yield return childOfChild;
                    }
                }
            }
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            DataHub.GetInstance().RackWindows.Remove(rack.id);
        }

    }
}
