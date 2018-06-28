using CmdbAPI.ExportHelper;
using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbDataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace CmdbEditor
{
    /// <summary>
    /// Interaktionslogik für CmdbWindow.xaml
    /// </summary>
    public partial class CmdbWindow : Window
    {
        private CmdbDataAccessComponent da = CmdbDataAccessComponent.GetInstance();

        private CMDBDataSet.ConfigurationItemsDataTable searchResultsTable;

        private BitmapSource redX, yellowPlus, yellowDoublePlus, docOpen, editItem, excel, yworks;

        private bool userCanEdit;

        public CMDBDataSet.ConfigurationItemsDataTable SearchResultsTable
        {
            get { return searchResultsTable; }
            set
            {
                searchResultsTable = value;
                this.SearchResultsTableChanged(this, EventArgs.Empty);
            }
        }

        private CMDBDataSet.ConfigurationItemsRow itemRow;

        private int position = -1;
        private event EventHandler TablePositionChanging, TablePositionChanged, SearchResultsTableChanged;

        /// <summary>
        /// Konstruktur
        /// </summary>
        /// <param name="role">Rolle, in der der Benutzer arbeitet: Reader, Editor oder Administrator (hier irrelevant)</param>
        public CmdbWindow(UserRole role)
        {
            redX = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap(
                global::CmdbEditor.Properties.Resources.DeleteItem.GetHbitmap(), IntPtr.Zero, Int32Rect.Empty, BitmapSizeOptions.FromEmptyOptions());
            yellowPlus = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap(
                global::CmdbEditor.Properties.Resources.AddNewItem.GetHbitmap(), IntPtr.Zero, Int32Rect.Empty, BitmapSizeOptions.FromEmptyOptions());
            docOpen = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap(
                global::CmdbEditor.Properties.Resources.OpenDocument.GetHbitmap(), IntPtr.Zero, Int32Rect.Empty, BitmapSizeOptions.FromEmptyOptions());
            editItem = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap(
                global::CmdbEditor.Properties.Resources.EditItem.GetHbitmap(), IntPtr.Zero, Int32Rect.Empty, BitmapSizeOptions.FromEmptyOptions());
            excel = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap(
                global::CmdbEditor.Properties.Resources.excel.GetHbitmap(), IntPtr.Zero, Int32Rect.Empty, BitmapSizeOptions.FromEmptyOptions());
            yworks = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap(
                global::CmdbEditor.Properties.Resources.yworks.GetHbitmap(), IntPtr.Zero, Int32Rect.Empty, BitmapSizeOptions.FromEmptyOptions());
            yellowDoublePlus = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap(
                global::CmdbEditor.Properties.Resources.AddMultipleItems.GetHbitmap(), IntPtr.Zero, Int32Rect.Empty, BitmapSizeOptions.FromEmptyOptions());


            InitializeComponent();

            WpfHelper.fillIdNameComboBox(lstSearchItemType, da.Dataset.ItemTypes, "TypeId", "TypeName");
            WpfHelper.fillIdNameComboBox(lstNewItemType, da.Dataset.ItemTypes, "TypeId", "TypeName");

            this.TablePositionChanging += CmdbWindow_TablePositionChanging;
            this.TablePositionChanged += CmdbWindow_TablePositionChanged;
            this.SearchResultsTableChanged += CmdbWindow_SearchResultsTableChanged;
            this.SearchResultsTable = this.da.Dataset.ConfigurationItems;
            if (searchResultsTable.Rows.Count > 0)
                this.TablePosition = 0;

            spOperations.Visibility = System.Windows.Visibility.Collapsed;

            // Rollenbezogen die Editier-Registerkarten für den Reader ausblenden
            if (role == UserRole.Reader)
            {
                tiEdit.Visibility = System.Windows.Visibility.Collapsed;
                tiNew.Visibility = System.Windows.Visibility.Collapsed;
            }

        }

        void CmdbWindow_SearchResultsTableChanged(object sender, EventArgs e)
        {
            lblItemCount.Text = this.SearchResultsTable.Rows.Count.ToString();
            this.TablePosition = -1;
        }

        void CmdbWindow_TablePositionChanging(object sender, EventArgs e)
        {
            if (TablePosition > -1 && this.TablePosition < this.SearchResultsTable.Rows.Count) // Gültige Aktuelle Position ermitteln
            {
                //this.itemRow = (CMDBDataSet.ConfigurationItemsRow)this.SearchResultsTable.Rows[this.TablePosition];
                txtEditName.Text = txtEditName.Text.Trim();
                if (txtEditName.Text.Equals(this.itemRow.ItemName, StringComparison.CurrentCulture))
                    return; // Keine Änderung ==> Keine Aktion
                if (MessageBox.Show("Wollen Sie die Änderungen am ConfigurationItem vor dem Verlassen speichern?", "Datensatz wurde geändert", MessageBoxButton.YesNo,
                    MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.Yes)
                    btnSaveChangedItem_Click(sender, null);
            }
        }

        void CmdbWindow_TablePositionChanged(object sender, EventArgs e)
        {
            if (TablePosition > -1 && this.TablePosition < SearchResultsTable.Rows.Count) // Gültige Aktuelle Position ermitteln
            {
                this.itemRow = this.SearchResultsTable[this.TablePosition];
                txtEditName.Text = this.itemRow.ItemName;
                lblItemType.Text = this.itemRow.TypeName;
                //lblItemType.Background = (Brush)new BrushConverter().ConvertFromString(this.da.Dataset.ItemTypes.FindByTypeId(this.itemRow.ItemType).TypeBackColor);
                lblId.Text = this.itemRow.ItemId.ToString();
                lblItemCreated.Text = this.itemRow.ItemCreated.ToString();
                lblItemLastChange.Text = this.itemRow.ItemLastChange.ToString();
                lblItemVersion.Text = this.itemRow.ItemVersion.ToString();

                // Festlegen, ob Benutzer editieren kann
                this.userCanEdit = this.da.Dataset.Responsibility.FindByItemIdResponsibleToken(this.itemRow.ItemId, System.Security.Principal.WindowsIdentity.GetCurrent().Name) != null;
                if (System.Diagnostics.Debugger.IsAttached)
                    this.userCanEdit = true;

                txtEditName.IsEnabled = this.userCanEdit;
                btnTakeResponsibility.Visibility = this.userCanEdit ? System.Windows.Visibility.Collapsed : System.Windows.Visibility.Visible;
                this.showItemAttributes();
                this.showItemLinks();
                this.showItemDependencies();
                this.showResponsibilities();
            }
            txtItemPosition.Text = (this.TablePosition + 1).ToString();
        }

        /// <summary>
        /// Gibt die aktuelle Position in der Suchergebnis-Tabelle zurück oder legt diese fest
        /// </summary>
        private int TablePosition
        {
            get { return position; }
            set
            {
                if (value.Equals(-1)) // Tabelle wurde neu erstellt
                {
                    position = 0;
                    this.TablePositionChanged(this, EventArgs.Empty);
                    return;
                }
                if (value < 0 || value > SearchResultsTable.Rows.Count - 1)
                    throw new ArgumentOutOfRangeException("Die Position darf nicht kleiner als 1 und nicht größer sein als die Anzahl der Datensätze");
                // ACHTUNG: Die nach außen angegebene Position ist die interne Postion + 1!
                if (value.Equals(position))
                    return;
                this.TablePositionChanging(this, EventArgs.Empty);
                position = value;
                this.TablePositionChanged(this, EventArgs.Empty);
            }
        }

        /// <summary>
        /// Zeigt die Attribute in einer Liste zum Bearbeiten und Löschen an
        /// </summary>
        private void showItemAttributes()
        {
            spEditAttributes.Children.Clear();
            List<Guid> attributes = this.getAttributesForItem(this.itemRow.ItemId);
            CMDBDataSet.AttributeGroupsDataTable dt = this.da.getAssignedAttributeGroups(this.itemRow.ItemType);
            foreach (CMDBDataSet.AttributeGroupsRow agr in dt.Rows)
            {
                GroupBox gb = new GroupBox();
                gb.Header = agr.GroupName;
                gb.Margin = new Thickness(10, 10, 10, 10);
                gb.BorderThickness = new Thickness(2, 2, 2, 2);
                spEditAttributes.Children.Add(gb);
                Grid gr = this.createItemAttributeGrid();
                int row = 0;
                gb.Content = gr;
                foreach (CMDBDataSet.GroupAttributeTypeMappingsRow gar in this.da.Dataset.GroupAttributeTypeMappings.Where(gam => gam.GroupId.Equals(agr.GroupId)))
                {
                    CMDBDataSet.ItemAttributesRow attr = this.da.getItemAttributeForItemAndAttributeType(this.itemRow.ItemId, gar.AttributeTypeId);
                    row++;
                    gr.RowDefinitions.Add(new RowDefinition());
                    WpfHelper.setRowBackground(gr, row);
                    WpfHelper.placeGridContent(gr, WpfHelper.createTextBlock(this.da.Dataset.AttributeTypes.FindByAttributeTypeId(gar.AttributeTypeId).AttributeTypeName, new Thickness(0, 2, 10, 2)),
                        row, 0, System.Windows.HorizontalAlignment.Left, System.Windows.VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
                    if (attr != null) // Attribut vorhanden
                    {
                        UIElement showValue = this.userCanEdit ? (UIElement)WpfHelper.createButton(attr.AttributeValue, btnEditAttributeValue_Click, attr) :
                            (UIElement)WpfHelper.createTextBlock(attr.AttributeValue);
                        WpfHelper.placeGridContent(gr, showValue, row, 1, System.Windows.HorizontalAlignment.Left, System.Windows.VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
                        WpfHelper.placeGridContent(gr, WpfHelper.createImageButton(redX, btnDeleteAttribute_Click, "Attribut löschen", attr), row, 2);
                        attributes.RemoveAt(attributes.IndexOf(attr.AttributeId));
                    }
                    else
                    {
                        if (this.userCanEdit)
                            WpfHelper.placeGridContent(gr, WpfHelper.createImageButton(yellowPlus, btnCreateAttributeValue_Click, "Attribut hinzufügen", gar), row, 1,
                                System.Windows.HorizontalAlignment.Left, System.Windows.VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
                    }
                }
            }
            if (attributes.Count > 0) // Noch Attribute vorhanden, die keiner dem ItemType zugeordneten Gruppe angehören, was eigentlich nicht sein darf
            {
                GroupBox gb = new GroupBox();
                gb.Header = "Nicht erlaubte Attribute";
                gb.Margin = new Thickness(10, 10, 10, 10);
                gb.BorderBrush = Brushes.DarkRed;
                gb.BorderThickness = new Thickness(2, 2, 2, 2);
                spEditAttributes.Children.Add(gb);
                Grid gr = this.createItemAttributeGrid();
                int row = 0;
                gb.Content = gr;
                for (int i = 0; i < attributes.Count; i++)
                {
                    row++;
                    gr.RowDefinitions.Add(new RowDefinition());
                    WpfHelper.setRowBackground(gr, row);
                    CMDBDataSet.ItemAttributesRow attr = this.da.Dataset.ItemAttributes.FindByAttributeId(attributes[i]);
                    WpfHelper.placeGridContent(gr, WpfHelper.createTextBlock(attr.AttributeTypeName, new Thickness(0, 2, 10, 2)), row, 0,
                        System.Windows.HorizontalAlignment.Left, System.Windows.VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
                    WpfHelper.placeGridContent(gr, WpfHelper.createTextBlock(attr.AttributeValue, new Thickness(0, 2, 10, 2)), row, 1,
                        System.Windows.HorizontalAlignment.Left, System.Windows.VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
                    WpfHelper.placeGridContent(gr, WpfHelper.createImageButton(redX, btnDeleteAttribute_Click, "Attribut entfernen", attr), row, 2);

                }
            }
        }

        /// <summary>
        /// Erzeugt ein Grid für die Attribute
        /// </summary>
        /// <returns>Grid</returns>
        private Grid createItemAttributeGrid()
        {
            Grid gr = new Grid();
            ColumnDefinition cd = new ColumnDefinition();
            cd.Width = new GridLength(200);
            gr.ColumnDefinitions.Add(cd);
            cd = new ColumnDefinition();
            cd.Width = new GridLength(250);
            gr.ColumnDefinitions.Add(cd);
            cd = new ColumnDefinition();
            cd.Width = new GridLength(60);
            gr.ColumnDefinitions.Add(cd);
            gr.RowDefinitions.Add(new RowDefinition());
            WpfHelper.setRowBackground(gr, 0);
            WpfHelper.placeGridContent(gr, WpfHelper.createTextBlock("Attributtyp"), 0, 0, HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
            WpfHelper.placeGridContent(gr, WpfHelper.createTextBlock("Attributwert"), 0, 1, HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
            WpfHelper.placeGridContent(gr, WpfHelper.createTextBlock("Löschen"), 0, 2, HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
            return gr;
        }

        /// <summary>
        /// Gibt eine Liste mit Attributen zu einem Item zurück
        /// </summary>
        /// <param name="itemId">Guid des Items</param>
        /// <returns>Liste</returns>
        private List<Guid> getAttributesForItem(Guid itemId)
        {
            IEnumerable<CMDBDataSet.ItemAttributesRow> dt = this.da.getAttributesForItem(itemId);
            List<Guid> attributes = new List<Guid>(dt.Count());
            foreach (CMDBDataSet.ItemAttributesRow iar in dt)
            {
                attributes.Add(iar.AttributeId);
            }
            return attributes;
        }

        /// <summary>
        /// Zeigt alle Links zu einem Item an
        /// </summary>
        private void showItemLinks()
        {
            this.prepareItemLinksGrid();
            int row = 0;
            foreach (CMDBDataSet.ItemLinksRow ilr in this.da.Dataset.ItemLinks.Select(string.Format("ItemId = '{0}'", this.itemRow.ItemId)))
            {
                Brush backGround = Brushes.Transparent;
                if (ilr.LinkURI.StartsWith("file://", StringComparison.InvariantCultureIgnoreCase))
                {
                    if (!System.IO.File.Exists(ilr.LinkURI.Substring(5)) && !System.IO.File.Exists(ilr.LinkURI.Substring(7)))
                        backGround = Brushes.MistyRose;
                }
                row++;
                grItemLinks.RowDefinitions.Add(new RowDefinition());
                WpfHelper.setRowBackground(grItemLinks, row, backGround, Brushes.LightGray);
                WpfHelper.placeGridContent(grItemLinks, WpfHelper.createTextBlock(ilr.LinkURI), row, 0,
                    HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 8, 5, 8));
                WpfHelper.placeGridContent(grItemLinks, WpfHelper.createTextBlock(ilr.LinkDescription), row, 2,
                    HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 8, 5, 8));
                // Panel mit Befehlen
                if (this.userCanEdit)
                {
                    StackPanel sp = WpfHelper.createContentStackPanel(Orientation.Horizontal, new Thickness(2, 2, 2, 2));
                    sp.Children.Add(WpfHelper.createImageButton(docOpen, btnOpenItemLink_Click, "Link öffnen", ilr.LinkURI));
                    sp.Children.Add(WpfHelper.createImageButton(editItem, btnEditItemLink_Click, "Link bearbeiten", ilr));
                    sp.Children.Add(WpfHelper.createImageButton(redX, btnDeleteItemLink_Click, "Link entfernen", ilr));
                    WpfHelper.placeGridContent(grItemLinks, sp, row, 4, HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
                }
            }
            row++;
            grItemLinks.RowDefinitions.Add(new RowDefinition());
            WpfHelper.setRowBackground(grItemLinks, row, Brushes.Transparent, Brushes.Transparent);
            WpfHelper.placeGridContent(grItemLinks, WpfHelper.createImageButton(yellowPlus, btnCreateItemLink_Click, "Neuen Link hinzufügen"), row, 0,
                    HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
        }

        /// <summary>
        /// Erzeugt ein Grid für die Attribute
        /// </summary>
        /// <returns>Grid</returns>
        private void prepareItemLinksGrid()
        {
            grItemLinks.Children.Clear();
            for (int i = 0; i < 2; i++)
            {
                GridSplitter gs = new GridSplitter();
                gs.HorizontalAlignment = System.Windows.HorizontalAlignment.Center;
                gs.ResizeBehavior = GridResizeBehavior.PreviousAndNext;
                gs.ResizeDirection = GridResizeDirection.Columns;
                gs.Width = 3;
                grItemLinks.Children.Add(gs);
                Grid.SetColumn(gs, i * 2 + 1);
            }
            grItemLinks.RowDefinitions.Add(new RowDefinition());
            WpfHelper.placeGridContent(grItemLinks, WpfHelper.createRectangle(Brushes.LightGray, Brushes.Gray), 0, 0);
            WpfHelper.placeGridContent(grItemLinks, WpfHelper.createRectangle(Brushes.LightGray, Brushes.Gray), 0, 2);
            WpfHelper.placeGridContent(grItemLinks, WpfHelper.createRectangle(Brushes.LightGray, Brushes.Gray), 0, 4);

            WpfHelper.placeGridContent(grItemLinks, WpfHelper.createTextBlock("Link-URI"), 0, 0, HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
            WpfHelper.placeGridContent(grItemLinks, WpfHelper.createTextBlock("Beschreibung"), 0, 2, HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
            WpfHelper.placeGridContent(grItemLinks, WpfHelper.createTextBlock("Befehle"), 0, 4, HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
        }

        /// <summary>
        /// Zeigt die Abhängigkeiten des Configuration Items von anderen Items an 
        /// </summary>
        private void showItemDependencies()
        {
            this.prepareItemDependenciesGrid();
            CMDBDataSet.ConnectionRulesDataTable dt = this.da.ConnectionRules_GetByItemUpperType(this.itemRow.ItemType);
            Guid lastConnType = new Guid();
            int row = 0;
            foreach (CMDBDataSet.ConnectionRulesRow crr in dt.Rows)
            {
                row++;
                if (row >= grDependencies.RowDefinitions.Count)
                    grDependencies.RowDefinitions.Add(new RowDefinition());
                if (!lastConnType.Equals(crr.ConnType)) // Zeilenwechsel in der ersten Spalte
                {
                    lastConnType = crr.ConnType;
                    // Oberen Rand in den linken beiden Spalten hinzufügen
                    WpfHelper.placeGridContent(grDependencies, WpfHelper.createBorder(new Thickness(0, 1, 0, 0), Brushes.Gray, HorizontalAlignment.Stretch, VerticalAlignment.Top,
                         WpfHelper.createTextBlock(this.da.Dataset.ConnectionTypes.FindByConnTypeId(crr.ConnType).ConnTypeName, new Thickness(5, 5, 5, 5))), row, 0);
                    WpfHelper.placeGridContent(grDependencies, WpfHelper.createBorder(new Thickness(0, 1, 0, 0), Brushes.Gray, HorizontalAlignment.Stretch, VerticalAlignment.Stretch, null), row, 1);
                }
                // Oberen Rand in den mittleren beiden Spalten hinzufügen
                WpfHelper.placeGridContent(grDependencies, WpfHelper.createBorder(new Thickness(0, 1, 0, 0), Brushes.Gray, HorizontalAlignment.Stretch, VerticalAlignment.Top,
                    WpfHelper.createTextBlock(string.Format("{0} ({1} - {2})", this.da.Dataset.ItemTypes.FindByTypeId(crr.ItemLowerType).TypeName,
                    crr.MaxConnectionsToUpper, crr.MaxConnectionsToLower), new Thickness(5, 5, 5, 5))), row, 2);
                WpfHelper.placeGridContent(grDependencies, WpfHelper.createBorder(new Thickness(0, 1, 0, 0), Brushes.Gray, HorizontalAlignment.Stretch, VerticalAlignment.Stretch, null), row, 3);
                IEnumerable<CMDBDataSet.ConnectionsRow> dtconn = this.da.getConnectionsForUpperItemAndRule(this.itemRow.ItemId, crr.RuleId);
                bool addConnectionDisplayed = false;
                for (int i = 0; i < crr.MaxConnectionsToLower; i++)
                {
                    if (i > 0)
                    {
                        row++;
                        if (row >= grDependencies.RowDefinitions.Count)
                            grDependencies.RowDefinitions.Add(new RowDefinition());
                    }
                    // linken Rand  in der linken Spalte hinzufügen
                    WpfHelper.placeGridContent(grDependencies, WpfHelper.createBorder(new Thickness(1, 0, 0, 0), Brushes.Gray, HorizontalAlignment.Stretch, VerticalAlignment.Stretch, null), row, 0);
                    if (dtconn.Count() > i) // Objekte entsprechend Mindestregel vorhanden
                    {
                        WpfHelper.placeGridContent(grDependencies, WpfHelper.createBorder(new Thickness(0, 1, 0, 0), Brushes.Gray, HorizontalAlignment.Stretch, VerticalAlignment.Stretch,
                            WpfHelper.createTextBlock(this.da.Dataset.ConfigurationItems.FindByItemId(dtconn.ToArray()[i].ConnLowerItem).ItemName, new Thickness(5, 5, 5, 5))), row, 4);
                        WpfHelper.placeGridContent(grDependencies, WpfHelper.createBorder(new Thickness(0, 1, 0, 0), Brushes.Gray, HorizontalAlignment.Stretch, VerticalAlignment.Stretch, null), row, 5);
                        if (this.userCanEdit)
                            WpfHelper.placeGridContent(grDependencies, WpfHelper.createBorder(new Thickness(0, 1, 1, 0), Brushes.Gray, HorizontalAlignment.Stretch, VerticalAlignment.Stretch,
                                WpfHelper.createImageButton(redX, btnDeleteConnection_Click, "Verbindung löschen", dtconn.ToArray()[i], new Thickness(5, 5, 5, 5))), row, 6);
                        else
                            WpfHelper.placeGridContent(grDependencies, WpfHelper.createBorder(new Thickness(0, 1, 1, 0), Brushes.Gray, HorizontalAlignment.Stretch, VerticalAlignment.Stretch,
                                null), row, 6);

                    }
                    else // weniger Objekte als Maximum enthalten
                    {
                        if (addConnectionDisplayed) // Mindestanzahl erfüllt
                        {
                            row--;
                            break;
                        }
                        // Hinzufügen anzeigen
                        addConnectionDisplayed = true;
                        if (this.userCanEdit)
                        {
                            StackPanel sp = WpfHelper.createContentStackPanel(Orientation.Horizontal);
                            sp.Children.Add(WpfHelper.createImageButton(yellowPlus, btnAddConnection_Click, "Neue Verbindung hinzufügen", crr, new Thickness(5, 7, 5, 7)));
                            if (crr.MaxConnectionsToLower - dtconn.Count() > 1)
                                sp.Children.Add(WpfHelper.createImageButton(yellowDoublePlus, btnAddMultipleConnections_Click, "Mehrere neue Verbindungen hinzufügen",
                                crr, new Thickness(5, 7, 5, 7)));
                            WpfHelper.placeGridContent(grDependencies, WpfHelper.createBorder(new Thickness(0, 1, 0, 0), Brushes.Gray,
                                HorizontalAlignment.Stretch, VerticalAlignment.Stretch, sp), row, 4);
                        }
                        else
                            WpfHelper.placeGridContent(grDependencies, WpfHelper.createBorder(new Thickness(0, 1, 0, 0), Brushes.Gray,
                                HorizontalAlignment.Stretch, VerticalAlignment.Stretch,
                                null), row, 4);
                        WpfHelper.placeGridContent(grDependencies, WpfHelper.createBorder(new Thickness(0, 1, 0, 0), Brushes.Gray,
                            HorizontalAlignment.Stretch, VerticalAlignment.Stretch, null), row, 5);
                        WpfHelper.placeGridContent(grDependencies, WpfHelper.createBorder(new Thickness(0, 1, 1, 0), Brushes.Gray,
                            HorizontalAlignment.Stretch, VerticalAlignment.Stretch, null), row, 6);
                    }
                }
            }
            //Abschlusslinie hinzufügen
            row++;
            if (row >= grDependencies.RowDefinitions.Count)
                grDependencies.RowDefinitions.Add(new RowDefinition());
            for (int i = 0; i < grDependencies.ColumnDefinitions.Count; i++)
            {
                WpfHelper.placeGridContent(grDependencies, WpfHelper.createBorder(new Thickness(0, 1, 0, 0), Brushes.Gray, HorizontalAlignment.Stretch, VerticalAlignment.Stretch, null), row, i);
            }
        }

        private void btnDeleteConnection_Click(object sender, RoutedEventArgs e)
        {
            CMDBDataSet.ConnectionsRow r = (CMDBDataSet.ConnectionsRow)((Button)sender).Tag;
            if (MessageBox.Show("Wollen Sie wirklich die Verbindung unwiderruflich löschen?", "Löschen bestätigen", MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.No)
                return;
            this.da.Connection_Delete(r.ConnId, r.ConnType, r.ConnUpperItem, r.ConnLowerItem, r.ConnectionRuleId, r.ConnCreated, r.ConnLastChange, r.ConnVersion,
                System.Security.Principal.WindowsIdentity.GetCurrent().Name);
            this.showItemDependencies();
        }

        private void btnAddConnection_Click(object sender, RoutedEventArgs e)
        {
            CMDBDataSet.ConnectionRulesRow crr = (CMDBDataSet.ConnectionRulesRow)((Button)sender).Tag;
            IEnumerable<CmdbAPI.TransferObjects.ConfigurationItem> dt = DataHandler.GetConfigurationItemsConnectableAsLowerItem(this.itemRow.ItemId, crr.RuleId);
            ConfigItemListEditor ed = new ConfigItemListEditor(dt, string.Format("Verbindung von {0}", this.itemRow.ItemName));
            if (ed.ShowDialog() == true)
            {
                this.da.Connection_Insert(Guid.NewGuid(), crr.ConnType, this.itemRow.ItemId, ed.SelectedValue, crr.RuleId, System.Security.Principal.WindowsIdentity.GetCurrent().Name);
                this.showItemDependencies();
            }
        }

        private void btnAddMultipleConnections_Click(object sender, RoutedEventArgs e)
        {
            CMDBDataSet.ConnectionRulesRow crr = (CMDBDataSet.ConnectionRulesRow)((Button)sender).Tag;
            IEnumerable<CmdbAPI.TransferObjects.ConfigurationItem> dt = DataHandler.GetConfigurationItemsConnectableAsLowerItem(this.itemRow.ItemId, crr.RuleId);
            ConfigItemMultipleConnectionsEditor ed = new ConfigItemMultipleConnectionsEditor(dt, string.Format("Verbindung von {0}", this.itemRow.ItemName));
            if (ed.ShowDialog() == true)
            {
                Guid[] ids = ed.SelectedValues;
                for (int i = 0; i < ids.Length; i++)
                {
                    this.da.Connection_Insert(Guid.NewGuid(), crr.ConnType, this.itemRow.ItemId, ids[i], crr.RuleId, System.Security.Principal.WindowsIdentity.GetCurrent().Name);
                }
                this.showItemDependencies();
            }
        }

        /// <summary>
        /// Erzeugt ein Grid für die Attribute
        /// </summary>
        /// <returns>Grid</returns>
        private void prepareItemDependenciesGrid()
        {
            grDependencies.Children.Clear();
            grDependencies.RowDefinitions.Add(new RowDefinition());
            for (int i = 0; i < 2; i++)
            {
                GridSplitter gs = new GridSplitter();
                gs.HorizontalAlignment = System.Windows.HorizontalAlignment.Center;
                gs.ResizeBehavior = GridResizeBehavior.PreviousAndNext;
                gs.ResizeDirection = GridResizeDirection.Columns;
                gs.Width = 3;
                grDependencies.Children.Add(gs);
                Grid.SetColumn(gs, i * 2 + 1);
            }
            for (int i = 0; i < 4; i++)
            {
                WpfHelper.placeGridContent(grDependencies, WpfHelper.createRectangle(Brushes.LightGray, Brushes.Gray), 0, i * 2);
            }

            WpfHelper.placeGridContent(grDependencies, WpfHelper.createTextBlock("Verbindungstyp"), 0, 0, HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
            WpfHelper.placeGridContent(grDependencies, WpfHelper.createTextBlock("Item-Typ"), 0, 2, HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
            WpfHelper.placeGridContent(grDependencies, WpfHelper.createTextBlock("Item"), 0, 4, HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
            WpfHelper.placeGridContent(grDependencies, WpfHelper.createTextBlock("Befehle"), 0, 6, HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
        }

        private void showResponsibilities()
        {
            prepareResponsibleGrid();
            int row = 0;
            foreach (CMDBDataSet.ResponsibilityRow rr in this.da.Dataset.Responsibility.Where(a => a.ItemId.Equals(this.itemRow.ItemId)))
            {
                row++;
                if (grResponsible.RowDefinitions.Count() < row + 1)
                    grResponsible.RowDefinitions.Add(new RowDefinition());
                Dictionary<string, string> users = ADSHelper.GetUserProperties(ADSHelper.GetBase64SIDFromUserName(rr.ResponsibleToken));
                WpfHelper.placeGridContent(grResponsible, WpfHelper.createBorder(new Thickness(1, 1, 1, 1), Brushes.Gray, System.Windows.HorizontalAlignment.Stretch, System.Windows.VerticalAlignment.Stretch,
                    WpfHelper.createTextBlock(users["displayname"], new Thickness(10, 10, 10, 10))), row, 0);
                WpfHelper.placeGridContent(grResponsible, WpfHelper.createBorder(new Thickness(1, 1, 1, 1), Brushes.Gray, System.Windows.HorizontalAlignment.Stretch, System.Windows.VerticalAlignment.Stretch,
                    WpfHelper.createCommandButton(users["mail"], btnMail_Click, users["mail"])), row, 2);
            }
        }

        private void btnMail_Click(object sender, RoutedEventArgs e)
        {
            string mail = string.Format("mailto:{0}?subject={1}: {2}", ((Button)sender).Tag, this.itemRow.TypeName, this.itemRow.ItemName);
            System.Diagnostics.Process.Start(mail);
        }

        /// <summary>
        /// Erzeugt ein Grid für die Attribute
        /// </summary>
        /// <returns>Grid</returns>
        private void prepareResponsibleGrid()
        {
            grResponsible.Children.Clear();
            grResponsible.RowDefinitions.Clear();
            for (int i = 0; i < 1; i++)
            {
                GridSplitter gs = new GridSplitter();
                gs.HorizontalAlignment = System.Windows.HorizontalAlignment.Center;
                gs.ResizeBehavior = GridResizeBehavior.PreviousAndNext;
                gs.ResizeDirection = GridResizeDirection.Columns;
                gs.Width = 3;
                grResponsible.Children.Add(gs);
                Grid.SetColumn(gs, i * 2 + 1);
            }
            grResponsible.RowDefinitions.Add(new RowDefinition());
            WpfHelper.placeGridContent(grResponsible, WpfHelper.createRectangle(Brushes.LightGray, Brushes.Gray), 0, 0);
            WpfHelper.placeGridContent(grResponsible, WpfHelper.createRectangle(Brushes.LightGray, Brushes.Gray), 0, 2);

            WpfHelper.placeGridContent(grResponsible, WpfHelper.createTextBlock("Name"), 0, 0, HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
            WpfHelper.placeGridContent(grResponsible, WpfHelper.createTextBlock("Mail"), 0, 2, HorizontalAlignment.Left, VerticalAlignment.Center, new Thickness(5, 5, 5, 5));
        }

        private void btnSearch_Click(object sender, RoutedEventArgs e)
        {
            if (chkSearchText.IsChecked == true)
            {
                // Wenn kein Text eingegeben ist, aber nach Text gesucht werden soll abbrechen
                if (string.IsNullOrWhiteSpace(txtSearchText.Text))
                {
                    txtSearchText.Focus();
                    return;
                }
                if (chkSearchType.IsChecked == true)
                {
                    // Beide Suchkriterien suchen
                    SearchResultsTable = this.da.searchConfigurationItems((Guid)lstSearchItemType.SelectedValue, txtSearchText.Text);
                }
                else
                {
                    // nur Text suchen
                    SearchResultsTable = this.da.searchConfigurationItems(txtSearchText.Text);
                }
            }
            else
            {
                // Nur Typ suchen
                SearchResultsTable = this.da.searchConfigurationItems((Guid)lstSearchItemType.SelectedValue);
            }
            lvSearchResults.Items.Clear();
            foreach (CMDBDataSet.ConfigurationItemsRow r in SearchResultsTable.Rows)
            {
                int num = lvSearchResults.Items.Add(r); //new { ItemId = r.ItemId, TypeName = r.TypeName, ItemName = r.ItemName }
            }
            // Befehlsliste nur anzeigen, wenn mindestens ein Item gefunden wurde
            if (lvSearchResults.Items.Count > 0)
                spOperations.Visibility = System.Windows.Visibility.Visible;
            else
                spOperations.Visibility = System.Windows.Visibility.Collapsed;
            if (e != null)
                e.Handled = true;
            lvSearchResults_SelectionChanged(sender, null);

        }

        private void chkSearchText_Checked(object sender, RoutedEventArgs e)
        {
            txtSearchText.IsEnabled = true;
        }

        private void chkSearchText_Unchecked(object sender, RoutedEventArgs e)
        {
            if (chkSearchType.IsChecked == false)
                chkSearchType.IsChecked = true;
            txtSearchText.IsEnabled = false;
        }

        private void chkSearchType_Checked(object sender, RoutedEventArgs e)
        {
            if (lstSearchItemType != null)
                lstSearchItemType.IsEnabled = true;
        }

        private void chkSearchType_Unchecked(object sender, RoutedEventArgs e)
        {
            if (chkSearchText.IsChecked == false)
                chkSearchText.IsChecked = true;
            lstSearchItemType.IsEnabled = false;
        }

        private void lvSearchResults_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            btnExportSelection.IsEnabled = (lvSearchResults.SelectedValue != null);
        }

        private void lvSearchResults_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            // Zurückspringen, wenn mehrere Items ausgewählt wurden (sollte nicht auftreten)
            if (lvSearchResults.SelectedItems.Count > 1)
                return;
            // Zurückspringen, wenn ins leere Feld geclickt wurde
            if (e.OriginalSource.GetType() == typeof(ScrollViewer))
                return;
            if (lvSearchResults.SelectedItem != null)
            {
                this.TablePosition = lvSearchResults.SelectedIndex;
                if (tiEdit.Visibility == System.Windows.Visibility.Visible) // Falls Editormodus gewählt wurde, editieren, sonst Navigator anzeigen-------
                {
                    tcEdit.SelectedIndex = 1;
                }
                else
                {
                    new NavigatorWindow((Guid)lvSearchResults.SelectedValue).Show();
                }
            }
        }

        private void btnSaveNewItem_Click(object sender, RoutedEventArgs e)
        {
            txtNewItemName.Text = txtNewItemName.Text.Trim();
            if (string.IsNullOrWhiteSpace(txtNewItemName.Text))
            {
                txtNewItemName.Focus();
                return;
            }
            Guid itemId = Guid.NewGuid(), itemType = (Guid)lstNewItemType.SelectedValue;
            this.da.ConfigurationItem_Insert(itemId, itemType, txtNewItemName.Text, System.Security.Principal.WindowsIdentity.GetCurrent().Name);
            txtNewItemName.Text = string.Empty;
            if (this.da.Dataset.ConfigurationItems.Equals(this.SearchResultsTable))
                this.SearchResultsTable = this.da.Dataset.ConfigurationItems;
            else
                btnSearch_Click(sender, e);
            CMDBDataSet.ConfigurationItemsRow r = this.SearchResultsTable.FindByItemId(itemId);
            if (r != null)
            {
                this.TablePosition = this.SearchResultsTable.Rows.IndexOf(r);
            }
            else
                this.TablePosition = 0;
        }

        private void btnPreviousItem_Click(object sender, RoutedEventArgs e)
        {
            if (this.TablePosition > 0)
                this.TablePosition--;
        }

        private void btnFirstItem_Click(object sender, RoutedEventArgs e)
        {
            this.TablePosition = 0;
        }

        private void btnNextItem_Click(object sender, RoutedEventArgs e)
        {
            if (this.TablePosition < this.SearchResultsTable.Rows.Count - 1)
                this.TablePosition++;
        }

        private void btnLastItem_Click(object sender, RoutedEventArgs e)
        {
            this.TablePosition = this.SearchResultsTable.Rows.Count - 1;
        }

        private void btnAddNewItem_Click(object sender, RoutedEventArgs e)
        {
            tcEdit.SelectedIndex = 2;
        }

        private void btnSaveChangedItem_Click(object sender, RoutedEventArgs e)
        {
            txtEditName.Text = txtEditName.Text.Trim();
            if (txtEditName.Text.Equals(this.itemRow.ItemName, StringComparison.CurrentCulture))
                return; // Keine Änderung ==> Keine Aktion
            this.da.ConfigurationItem_Update(this.itemRow.ItemId, this.itemRow.ItemType, txtEditName.Text, this.itemRow.ItemCreated, this.itemRow.ItemLastChange, this.itemRow.ItemVersion,
                System.Security.Principal.WindowsIdentity.GetCurrent().Name);
            if (this.da.Dataset.ConfigurationItems.Equals(this.SearchResultsTable))
                this.SearchResultsTable = this.da.Dataset.ConfigurationItems;
            else
                btnSearch_Click(sender, e);
        }


        private void btnEditAttributeValue_Click(object sender, RoutedEventArgs e)
        {
            CMDBDataSet.ItemAttributesRow attr = (CMDBDataSet.ItemAttributesRow)((Button)sender).Tag;
            NameIdEditor ed = new NameIdEditor(attr.AttributeId, attr.AttributeValue, string.Format("{0}-Attribut für {1}: {2} bearbeiten", attr.AttributeTypeName,
                this.itemRow.TypeName, this.itemRow.ItemName), "Attributwert");
            if (ed.ShowDialog() == true)
            {
                this.da.ItemAttributes_Update(attr.AttributeId, ed.NameText, attr.AttributeLastChange, attr.AttributeVersion, System.Security.Principal.WindowsIdentity.GetCurrent().Name);
                showItemAttributes();
            }
        }

        private void btnCreateAttributeValue_Click(object sender, RoutedEventArgs e)
        {
            CMDBDataSet.GroupAttributeTypeMappingsRow gar = (CMDBDataSet.GroupAttributeTypeMappingsRow)((Button)sender).Tag;
            Guid attid = Guid.NewGuid();
            NameIdEditor ed = new NameIdEditor(attid, "", string.Format("{0}-Attribut für {1}: {2} erstellen", this.da.Dataset.AttributeTypes.FindByAttributeTypeId(gar.AttributeTypeId).AttributeTypeName,
                this.itemRow.TypeName, this.itemRow.ItemName), "Attributwert");
            if (ed.ShowDialog() == true)
            {
                try
                {
                    this.da.ItemAttributes_Insert(attid, this.itemRow.ItemId, gar.AttributeTypeId, ed.NameText, System.Security.Principal.WindowsIdentity.GetCurrent().Name);
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                }
                showItemAttributes();
            }
        }

        private void btnDeleteAttribute_Click(object sender, RoutedEventArgs e)
        {
            if (MessageBox.Show("Wollen Sie wirklich das Attribut unwiderruflich löschen?", "Löschen bestätigen", MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.No)
                return;
            CMDBDataSet.ItemAttributesRow attr = (CMDBDataSet.ItemAttributesRow)((Button)sender).Tag;
            this.da.ItemAttributes_Delete(attr.AttributeId, attr.ItemId, attr.AttributeTypeId, attr.AttributeValue, attr.AttributeCreated, attr.AttributeLastChange, attr.AttributeVersion,
                System.Security.Principal.WindowsIdentity.GetCurrent().Name);
            showItemAttributes();
        }
        private void NumericText_PreviewKeyDown(object sender, KeyEventArgs e)
        {
            // Leertaste nicht zulassen
            if (e.Key == Key.Space)
                e.Handled = true;
            // Ctrl + v unterdrücken und Shift + Einfg unterdrücken
            if ((e.Key == Key.V && (Keyboard.Modifiers & ModifierKeys.Control) == ModifierKeys.Control) || (e.Key == Key.Insert && (Keyboard.Modifiers & ModifierKeys.Shift) == ModifierKeys.Shift))
            {
                int num;
                if (!Clipboard.ContainsText() || !int.TryParse(Clipboard.GetText(TextDataFormat.Text), out num))
                {
                    e.Handled = true;
                    return;
                }
                e.Handled = !isTextInRange((TextBox)sender, num.ToString());

            }
        }

        private void NumericText_PreviewTextInput(object sender, TextCompositionEventArgs e)
        {
            // Nur Ziffern zulassen
            if (!System.Text.RegularExpressions.Regex.IsMatch(e.Text, "[0-9]"))
            {
                e.Handled = true;
                return;
            }
            // Überprüfen, ob der neu eingegebene Text größer wäre als die Anzahl der Datensätze
            e.Handled = !isTextInRange((TextBox)sender, e.Text);
        }

        /// <summary>
        /// Prüft, ob die Textbox mit dem zusätzlichen Text einen gültigen Wert innerhalb der Reichweite der Bearbeitung besitzt.
        /// </summary>
        /// <param name="tb">Textbox, die überprüft wird</param>
        /// <param name="newText">Text, der hinzugefügt werden soll</param>
        /// <returns>Wahr, falls Zahl in Ordnung geht</returns>
        private bool isTextInRange(TextBox tb, string newText)
        {
            string text = tb.Text;
            if (tb.SelectionLength > 0)
                text = text.Replace(tb.SelectedText, newText);
            else
                text = text.Insert(tb.SelectionStart, newText);
            int newPos;
            if (!int.TryParse(text, out newPos))
                return false;
            return (newPos > 0 && newPos <= searchResultsTable.Rows.Count);
        }

        private void txtItemPosition_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Return || e.Key == Key.Enter)
            {
                this.TablePosition = Convert.ToInt32(txtItemPosition.Text) - 1;
            }
        }

        private void txtItemPosition_LostFocus(object sender, RoutedEventArgs e)
        {
            this.TablePosition = Convert.ToInt32(txtItemPosition.Text) - 1;
        }

        private void btnCreateItemLink_Click(object sender, RoutedEventArgs e)
        {
            LinkEditor ed = new LinkEditor(string.Empty, string.Empty, string.Format("Neuer Link für {0} {1}", this.itemRow.TypeName, this.itemRow.ItemName));
            if (ed.ShowDialog() == true)
            {
                this.da.ItemLinks_Insert(Guid.NewGuid(), this.itemRow.ItemId, ed.Path, ed.Description);
                showItemLinks();
            }
        }

        private void btnEditItemLink_Click(object sender, RoutedEventArgs e)
        {
            CMDBDataSet.ItemLinksRow ilr = (CMDBDataSet.ItemLinksRow)((Button)sender).Tag;
            LinkEditor ed = new LinkEditor(ilr.LinkURI, ilr.LinkDescription, string.Format("Link bearbeiten für {0} {1}", this.itemRow.TypeName, this.itemRow.ItemName));
            if (ed.ShowDialog() == true)
            {
                this.da.ItemLinks_Update(ilr.LinkId, ilr.ItemId, ed.Path, ed.Description, ilr.LinkURI, ilr.LinkDescription);
                showItemLinks();
            }

        }

        private void btnDeleteItemLink_Click(object sender, RoutedEventArgs e)
        {
            if (MessageBox.Show("Wollen Sie wirklich den Link unwiderruflich löschen?", "Löschen bestätigen", MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.No)
                return;
            CMDBDataSet.ItemLinksRow ilr = (CMDBDataSet.ItemLinksRow)((Button)sender).Tag;
            this.da.ItemLinks_Delete(ilr.LinkId, ilr.ItemId, ilr.LinkURI, ilr.LinkDescription);
            showItemLinks();
        }

        private void btnOpenItemLink_Click(object sender, RoutedEventArgs e)
        {
            string path = ((Button)sender).Tag.ToString();
            System.Diagnostics.Process.Start(path);
        }

        private void grItemLinks_DragEnter(object sender, DragEventArgs e)
        {
            if (!e.Data.GetDataPresent(DataFormats.FileDrop))
                e.Effects = DragDropEffects.None;
        }

        private void grItemLinks_Drop(object sender, DragEventArgs e)
        {
            if (e.Data.GetDataPresent(DataFormats.FileDrop))
            {
                string[] files = (string[])e.Data.GetData(DataFormats.FileDrop);
                foreach (string file in files)
                {
                    string description = "Dienstkatalogeintrag";
                    string path = "file://" + file.Replace('\\', '/');
                    this.da.ItemLinks_Insert(Guid.NewGuid(), this.itemRow.ItemId, path, description);
                }
                showItemLinks();
            }

        }

        private void btnDeleteItem_Click(object sender, RoutedEventArgs e)
        {
            // Löschen eines Configuration Items
            if (MessageBox.Show("Wollen Sie wirklich das aktuelle Configuration Item inklusive aller Attribute, Links und Verbindungen zu anderen Items unwiderruflich löschen?",
                "Löschen bestätigen", MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.No)
                return;
            this.da.ConfigurationItem_Delete(this.itemRow.ItemId, this.itemRow.ItemType, this.itemRow.ItemName, this.itemRow.ItemCreated, this.itemRow.ItemLastChange, this.itemRow.ItemVersion,
                System.Security.Principal.WindowsIdentity.GetCurrent().Name);
            if (this.da.Dataset.ConfigurationItems.Equals(this.SearchResultsTable))
                this.SearchResultsTable = this.da.Dataset.ConfigurationItems;
            else
                btnSearch_Click(sender, e);
            this.TablePositionChanged(sender, EventArgs.Empty);
        }

        private void btnShowOrgChart_Click(object sender, RoutedEventArgs e)
        {
            // Navigator anzeigen
            new NavigatorWindow(this.itemRow).Show();
        }

        private void tcEdit_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // Suchbutton mit Enter erreichbar machen, wenn Registerkarte Suche gewählt ist
            btnSearch.IsDefault = (tcEdit.SelectedIndex == 0);
            // Speichern-Button mit Enter erreichbar machen, wenn Registerkarte Neu erstellen gewählt ist
            btnSaveNewItem.IsDefault = (tcEdit.SelectedIndex == 2);
        }

        private void btnExport_Click(object sender, RoutedEventArgs e)
        {
            // Exportiern eines ausgewählten Datensatzes
        }

        private void MenuButton_Click(object sender, RoutedEventArgs e)
        {
            Button b = (Button)sender;
            if (b.ContextMenu != null)
            {
                b.ContextMenu.PlacementTarget = b;
                b.ContextMenu.Placement = System.Windows.Controls.Primitives.PlacementMode.Bottom;
                b.ContextMenu.IsOpen = true;
            }
        }

        private void ExportListToExcel_Click(object sender, RoutedEventArgs e)
        {
            // Exportieren der gefundenen Items in andere Datenformate ermöglichen
            System.Data.DataTable t = new System.Data.DataTable();
            t.Columns.Add("Configuration Item");
            t.Columns.Add("Item-Typ");
            foreach (CMDBDataSet.ConfigurationItemsRow r in this.searchResultsTable.Rows)
            {
                System.Data.DataRow rx = t.Rows.Add(r.ItemName, r.TypeName);
                foreach (CMDBDataSet.ItemAttributesRow attr in this.da.getAttributesForItem(r.ItemId))
                {
                    string attType = attr.AttributeTypeName;
                    if (!t.Columns.Contains(attType))
                        t.Columns.Add(attType);
                    rx[attType] = attr.AttributeValue;
                }
            }
            OfficeHelper.CreateExcelSheetFromDataTable(t);
        }

        private void ExportToyEd_Click(object sender, RoutedEventArgs e)
        {
            this.TablePosition = lvSearchResults.SelectedIndex;
            List<Guid> itemTypes = new List<Guid>(), connectionTypes = new List<Guid>();
            int maximumUpwardLevels = int.MaxValue, maximumDownwardLevels = int.MaxValue;
            GraphMLhelper ml = new GraphMLhelper();
            switch (((MenuItem)sender).Tag.ToString())
            {
                case "1":
                    maximumUpwardLevels = 1;
                    maximumDownwardLevels = 1;
                    itemTypes.AddRange(this.da.Dataset.ItemTypes.Select(a => a.TypeId));
                    connectionTypes.AddRange(this.da.Dataset.ConnectionTypes.Select(a => a.ConnTypeId));
                    break;
                case "Filter":
                    FilterEditor ed = new FilterEditor(this.da.Dataset.ConnectionTypes, this.da.Dataset.ItemTypes);
                    if (ed.ShowDialog() == true)
                    {
                        maximumDownwardLevels = ed.DownwardMaximum;
                        maximumUpwardLevels = ed.UpwardMaximum;
                        itemTypes.AddRange(ed.SelectedItemTypes);
                        connectionTypes.AddRange(ed.SelectedConnectionTypes);
                    }
                    else
                        return;
                    break;
                case "All":
                    itemTypes.AddRange(this.da.Dataset.ItemTypes.Select(a => a.TypeId));
                    connectionTypes.AddRange(this.da.Dataset.ConnectionTypes.Select(a => a.ConnTypeId));
                    break;
                case "Complete":
                    ml.GraphMLExportAll_Click();
                    return;
            }
            ml.GraphMLExportPartial_Click(this.itemRow, itemTypes, connectionTypes, maximumUpwardLevels, maximumDownwardLevels, false);
        }

        private void btnTakeResponsibility_Click(object sender, RoutedEventArgs e)
        {
            this.da.TakeResponsibility(this.itemRow.ItemId, System.Security.Principal.WindowsIdentity.GetCurrent().Name);
            this.TablePositionChanged(this, EventArgs.Empty);
        }

    }
}
