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

namespace RZManager.HardwareWindows.Blades
{
    /// <summary>
    /// Interaction logic for EnclosureWindow.xaml
    /// </summary>
    public partial class EnclosureWindow : Window
    {
        private DataHub hub = DataHub.GetInstance();

        private BladeEnclosure enclosure;

        public EnclosureWindow(int enclosureId)
        {
            InitializeComponent();
            enclosure = hub.GetEnclosure(enclosureId);
            Title = enclosure.Name;

            hub.DataHasChanged += DataHasChanged;

            BuildEnclosure();
        }

        private void DataHasChanged(object sender, EventArgs e)
        {
            Dispatcher.BeginInvoke(new Action(() => BuildEnclosure()));
        }

        private void BuildEnclosure()
        {
            // Ausblenden, was nicht benötigt wird, ansonsten füllen
            if (enclosure.EnclosureType.ApplianceCountHorizontal * enclosure.EnclosureType.ApplianceCountVertical == 0)
                tiAppliance.Visibility = Visibility.Collapsed;
            else
                FillGrid(grAppliance, enclosure.EnclosureType.ApplianceCountHorizontal, enclosure.EnclosureType.ApplianceCountVertical, hub.GetBladeAppliancesInEnclosure(enclosure.id), typeof(BladeAppliance));

            /*if (enclosure.EnclosureType.InterFrameLinkCountHorizontal * enclosure.EnclosureType.InterFrameLinkCountVertical == 0)
                tiFrameInterlink.Visibility = Visibility.Collapsed;
            else
                FillGrid(grFrameInterlink, enclosure.EnclosureType.InterFrameLinkCountHorizontal, enclosure.EnclosureType.InterFrameLinkCountVertical, null);*/

            FillGrid(grInterconnect, enclosure.EnclosureType.InterconnectCountHorizontal, enclosure.EnclosureType.InterconnectCountVertical, hub.GetBladeInterconnectsInEnclosure(enclosure.id), typeof(BladeInterconnect));

        }

        private void FillGrid(Grid grid, int columns, int rows, IEnumerable<EnclosureMountable> content, Type t)
        {
            grid.Children.Clear();
            grid.RowDefinitions.Clear();
            grid.ColumnDefinitions.Clear();

            for (int i = 0; i < columns; i++)
            {
                grid.ColumnDefinitions.Add(new ColumnDefinition());
            }
            for (int i = 0; i < rows; i++)
            {
                grid.RowDefinitions.Add(new RowDefinition());
            }

            UIElement[] buttons = new UIElement[rows * columns];
            for (int col = 0; col < columns; col++)
            {
                for (int row = 0; row < rows; row++)
                {
                    int slot = row * columns + col;
                    IEnumerable<EnclosureMountable> em = content.Where(c => c.Slot == slot + 1); // 1 aufaddieren weil die externe Zählung bei 1 beginnt, nicht bei 0
                    switch(em.Count())
                    {
                        case 0:
                            bool withContextMenu = false;
                            if (t == typeof(BladeAppliance))
                                withContextMenu = hub.UnmountedBladeAppliancesCount > 0;
                            else if (t == typeof(BladeInterconnect))
                                withContextMenu = hub.UnmountedBladeInterconnectsCount > 0;
                            buttons[slot] = CreateButtonForFreeSlot(t, grid, row, col, slot + 1, withContextMenu);
                            break;
                        case 1:
                            buttons[slot] = CreateButtonForEnclosureMountable(em.First(), grid, row, col);
                            break;
                        default:
                            MessageBox.Show(string.Format("Die folgenden Elemente sollen im gleichen Slot untergebracht werden: {0}. Bitte korrigieren!", string.Join(", ", em.Select(x => x.Name))), "Doppelbelegung", MessageBoxButton.OK, MessageBoxImage.Error);
                            StackPanel sp = new StackPanel() { Orientation = Orientation.Vertical };
                            foreach (EnclosureMountable e in em)
                            {
                                e.Status = AssetStatus.Unknown;
                                sp.Children.Add(CreateButton(e));
                            }
                            PlaceGridContent(grid, row, col, sp);
                            break;
                    }
                }
            }
        }

        /// <summary>
        /// Erzeugt einen Button für ein in ein Enclosre einbaubares Item
        /// </summary>
        /// <param name="em">Item, das ins Rack eingebaut wird</param>
        /// <param name="grid">Grid, in das eingebaut wird</param>
        /// <param name="row">Zeile der Tabelle</param>
        /// <param name="col">Spalte der Tabelle</param>
        private Button CreateButtonForEnclosureMountable(EnclosureMountable em,  Grid grid, int row, int col)
        {
            Button button = CreateButton(em);
            PlaceGridContent(grid, row, col, button);
            return button;
        }

        private static void PlaceGridContent(Grid grid, int row, int col, UIElement element)
        {
            grid.Children.Add(element);
            Grid.SetColumn(element, col);
            Grid.SetRow(element, row);
        }

        private Button CreateButton(EnclosureMountable em)
        {
            return new Button()
            {
                VerticalContentAlignment = VerticalAlignment.Center,
                Background = StatusConverter.GetBrushForStatus(em.Status),
                MinHeight = Properties.Settings.Default.MinimumHeight,
                Margin = new Thickness(10),
                Content = string.Format("Slot: {0}\r\n{1}\r\n{2}", em.Slot, em.TypeName, em.Name),
                ContextMenu = CreateEnclosureMountableContextMenu(em),
                Tag = em,
            };
        }

        /// <summary>
        /// Erzeugt einen Button für einen leeren Slot
        /// </summary>
        /// <param name="slotType">Typ, für den der freie Slot erzeugt werden soll</param>
        /// <param name="grid">Grid, in das eingebaut wird</param>
        /// <param name="row">Zeile der Tabelle</param>
        /// <param name="col">Spalte der Tabelle</param>
        /// <param name="targetSlot">Slot-Nummer für den späteren Einbau</param>
        /// <param name="withContextMenu">Gibt an, ob es noch freie Elemente des Typs gibt, für den der Einbau möglich ist. Falls nein, wird kein Kontextmenü angezeigt</param>
        private Button CreateButtonForFreeSlot(Type slotType, Grid grid, int row, int col, int targetSlot, bool withContextMenu)
        {
            Button button = new Button()
            {
                VerticalContentAlignment = VerticalAlignment.Center,
                MinHeight = Properties.Settings.Default.MinimumHeight,
                Margin = new Thickness(10),
                Content = string.Format("Slot: {0}\r\n(Leer)", targetSlot),
                ContextMenu = withContextMenu ? CreateFreeContextMenu(slotType, targetSlot) : CreateEmptyContextMenu(),
            };
            grid.Children.Add(button);
            Grid.SetColumn(button, col);
            Grid.SetRow(button, row);
            return button;
        }

        /// <summary>
        /// Erzeugt ein Kontextmenü für ein beliegibes, in ein Rack einbaubares System
        /// </summary>
        /// <param name="em">Das System, für das das Menü erzeugt wird</param>
        /// <returns></returns>
        private ContextMenu CreateEnclosureMountableContextMenu(EnclosureMountable em)
        {
            ContextMenu menu = new ContextMenu();
            menu.Items.Add(CreateViewItem(em));
            menu.Items.Add(CreateMenuItem("Ausbauen", RemoveEnclosureMountable_Click, em));
            return menu;
        }

        private void RemoveEnclosureMountable_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            EnclosureMountable em = (sender as MenuItem).Tag as EnclosureMountable;
            if (MessageBox.Show(string.Format("Sind Sie sicher, dass Sie das {0} {1} aus dem Enclosure {2} ausbauen wollen?", em.TypeName, em.Name, enclosure.Name), "Sicherheitsabfrage", MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.Yes)
            {
                if (!hub.RemoveConnectionToEnclosure(em, AssetStatus.Stored, out errorMessage))
                {
                    MessageBox.Show(errorMessage, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="t">Type</param>
        /// <param name="targetSlot">Slot-Nummer für den späteren Einbau</param>
        /// <returns></returns>
        private ContextMenu CreateFreeContextMenu(Type t, int targetSlot)
        {
            ContextMenu menu = new ContextMenu();
            menu.Items.Add(CreateMenuItem("Einbauen", MountEnclosureMountable_Click, t));
            menu.ToolTip = string.Format("Slot: {0}", targetSlot);
            return menu;
        }

        private ContextMenu CreateEmptyContextMenu()
        {
            ContextMenu menu = new ContextMenu();
            menu.Items.Add(new MenuItem() { Header = "Kein Item im Lager zum Einbau vorhanden", IsEnabled = false });
            return menu;
        }

        private void MountEnclosureMountable_Click(object sender, RoutedEventArgs e)
        {
            string errorMessage;
            Type t = (sender as MenuItem).Tag as Type;
            IEnumerable<EnclosureMountable> itemsToMount;
            string targetSlot = ((sender as MenuItem).Parent as ContextMenu).ToolTip.ToString();
            if (t == typeof(BladeAppliance))
                itemsToMount = hub.GetUnmountedBladeAppliances();
            else if (t == typeof(BladeInterconnect))
                itemsToMount = hub.GetUnmountedBladeInterconnects();
            else
                return;
            MountEnclosureMountableWindow w = new MountEnclosureMountableWindow(itemsToMount, t.Name);
            if (w.ShowDialog() == true)
            {
                if (!hub.CreateConnectionToEnclosure(w.SelectedItem as EnclosureMountable, enclosure, enclosure.Status, targetSlot, out errorMessage))
                {
                    MessageBox.Show(errorMessage, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }

        }

        /// <summary>
        /// Erzeugt ein Menüitem zur Ansicht in der CMDB bzw. in assyst
        /// </summary>
        /// <param name="asset">Item</param>
        /// <returns></returns>
        private MenuItem CreateViewItem(Asset asset)
        {
            return CreateMenuItem("Item in assyst anzeigen", ViewItem_Click, string.Format(hub.CmdbSystemBaseUrl + Properties.Settings.Default.assystWebGuiPath, asset.id));
        }

        private void ViewItem_Click(object sender, RoutedEventArgs e)
        {
            string url = (e.Source as MenuItem).Tag.ToString();
            System.Diagnostics.Process.Start(url);
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

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            hub.EnclosureWindows.Remove(enclosure.id);
        }
    }
}
