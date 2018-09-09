using CmdbClient;
using CmdbClient.CmsService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace CmdbGui
{
    /// <summary>
    /// Interaktionslogik für AdminWindow.xaml
    /// </summary>
    public partial class AdminWindow : Window
    {
        private const string maxNum = "Maximalanzahl {0}";
        //private 
        //private CmsMetadata.CmsMetadataClient metadata = new CmsMetadata.CmsMetadataClient();
        private ComboBox lstUngroupedAttributeTypes, lstNotAddedGroups;
        private BitmapSource redX, moveArrow;

        private DataWrapper metaDataWrapper = new DataWrapper();

        private MetaData metaData { get; } = new MetaData();

        public AdminWindow()
        {
            InitializeComponent();
            if(metaDataWrapper.GetRoleForUser() != UserRole.Administrator)
            {
                MessageBox.Show("Sie sind kein Administrator. Programm wird beendet.", "Fehlende Berechtigung", MessageBoxButton.OK, MessageBoxImage.Error);
                this.Close();
                return;
            }
            // Grafik aus den Ressourcen zuweisen
            redX = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap(
                            global::CmdbGui.Properties.Resources.DeleteItem.GetHbitmap(), IntPtr.Zero, Int32Rect.Empty, BitmapSizeOptions.FromEmptyOptions());

            moveArrow = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap(
                            global::CmdbGui.Properties.Resources.NextItem.GetHbitmap(), IntPtr.Zero, Int32Rect.Empty, BitmapSizeOptions.FromEmptyOptions());

            // Attributtypen initialisieren
            lstAttributeTypes.ItemsSource = metaData.AttributeTypes;
            this.lstAttributeTypes_SelectionChanged(null, null);

            // Verbindungstypen initialisieren
            lstConnectionTypes.ItemsSource = metaData.ConnectionTypes;
            this.lstConnectionTypes_SelectionChanged(null, null);

            // Attributgruppen initialisieren
            lstAttributeGroups.ItemsSource = metaData.AttributeGroups;
            this.lstAttributeGroups_SelectionChanged(null, null);

            // Item-Typen initialisieren
            lstItemTypes.ItemsSource = metaData.ItemTypes;
            this.lstItemTypes_SelectionChanged(null, null);

            // Filter initialisieren
            lstFilterRulesLower.ItemsSource = metaData.ItemTypesFilter;
            lstFilterRulesUpper.ItemsSource = metaData.ItemTypesFilter;
            lstFilterRulesConnType.ItemsSource = metaData.ConnectionTypesFilter;

            // Daten holen
            metaData.FillAll();

            // Verbindungsregeln initialisieren
            this.createFilteredConnectionRulesList(metaDataWrapper.GetConnectionRules());


        }
        #region General_Methods

        /// <summary>
        /// Füllt eine Zeile in einem angegebenen Grid mit Textblock-Elementen, die aus den angegebenen Strings erzeugt werden.
        /// </summary>
        /// <param name="gr">Grid, dessen Zeile gefüllt werden soll</param>
        /// <param name="row">Zeile im Grid, die gefüllt werden soll</param>
        /// <param name="values">String-Liste zum Füllen</param>
        private void fillGridRowWithText(Grid gr, int row, params string[] values)
        {
            List<UIElement> l = new List<UIElement>(values.Length);
            for (int i = 0; i < values.Length; i++)
            {
                TextBlock tb = WpfHelper.createTextBlock(values[i]);
                l.Add(tb);
            }
            fillGridRow(gr, row, l.ToArray());
        }

        /// <summary>
        /// Füllt eine Zeile in einem angegebenen Grid mit UI-Elementen
        /// </summary>
        /// <param name="gr">Grid, dessen Zeile gefüllt werden soll</param>
        /// <param name="row">Zeile im Grid, die gefüllt werden soll</param>
        /// <param name="values">Liste der UI-Elemente</param>
        private void fillGridRow(Grid gr, int row, params UIElement[] values)
        {
            // Zuerst alle Spalten mit der entsprechenden Hintergrundfarbe versehen
            for (int i = 0; i < gr.ColumnDefinitions.Count; i++)
            {
                Rectangle re = new Rectangle();
                re.Stroke = Brushes.LightGray;
                re.Fill = (row % 2 == 0) ? Brushes.Transparent : Brushes.LightGray;
                WpfHelper.placeGridContent(gr, re, row, i * 2);
            }
            // Dann alle Spalten füllen
            for (int i = 0; i < values.Length; i++)
            {
                if (values[i] is FrameworkElement)
                {
                    FrameworkElement fe = (FrameworkElement)values[i];
                    fe.Margin = new Thickness(5, 2, 5, 2);
                }
                WpfHelper.placeGridContent(gr, values[i], row, i * 2);
            }
        }


        #endregion

        #region AttributeTypes

        private void lstAttributeTypes_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            btnUpdateAttributeType.IsEnabled = (lstAttributeTypes.SelectedValue != null);
            btnConvertAttributeTypeToItemType.IsEnabled = btnUpdateAttributeType.IsEnabled;
            btnCopyAttributeTypeIdToClipBoard.IsEnabled = btnUpdateAttributeType.IsEnabled;
            btnDeleteAttributeType.IsEnabled = btnUpdateAttributeType.IsEnabled && (metaDataWrapper.GetItemAttributesCountForAttributeType((Guid)lstAttributeTypes.SelectedValue) == 0);
        }

        private void lstAttributeTypes_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {

            if (lstAttributeTypes.SelectedItems.Count > 1)
                return;
            if (e.OriginalSource.GetType() == typeof(ScrollViewer))
            {
                AttributeType_New();
            }
            else
            {
                if (lstAttributeTypes.SelectedItem != null)
                {
                    AttributeType_Update();
                }
            }
        }

        private void lstAttributeTypes_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.Key)
            {
                case Key.Delete: // Löschen
                    if (lstAttributeTypes.SelectedValue == null || btnDeleteAttributeType.IsEnabled == false)
                        return;
                    AttributeType_Delete();
                    break;
                case Key.F2: // Umbenennen = Editieren
                    AttributeType_Update();
                    break;
            }
        }

        private void btnNewAttributeType_Click(object sender, RoutedEventArgs e)
        {
            AttributeType_New();
        }

        private void btnUpdateAttributeType_Click(object sender, RoutedEventArgs e)
        {
            AttributeType_Update();
        }

        private void btnDeleteAttributeType_Click(object sender, RoutedEventArgs e)
        {
            AttributeType_Delete();
        }

        /// <summary>
        /// Erstellt einen neuen AttributeType
        /// </summary>
        private void AttributeType_New()
        {
            Guid id = Guid.NewGuid();
            string name = string.Empty;
            NameIdEditor ed = new NameIdEditor(id, name, string.Format("{0} neu erstellen", "Attributtyp"), "Attributtyp-Name");
            ed.Owner = this;
            if (ed.ShowDialog() == true)
            {
                metaDataWrapper.CreateAttributeType(new AttributeType() { TypeId = id, TypeName = ed.NameText });
            }
            metaData.FillAttributeTypes();
            this.lstAttributeGroups_SelectionChanged(null, null);
        }

        /// <summary>
        /// Verändert einen bestehenden AttributeType
        /// </summary>
        private void AttributeType_Update()
        {
            try
            {
                AttributeType r = metaDataWrapper.GetAttributeType((Guid)lstAttributeTypes.SelectedValue);
                NameIdEditor ed = new NameIdEditor(r.TypeId, r.TypeName, string.Format("{0}: {1} editieren", "Attributtyp", r.TypeName), "Attributtyp-Name");
                ed.Owner = this;
                if (ed.ShowDialog() == true)
                {
                    r.TypeName = ed.NameText;
                    metaDataWrapper.UpdateAttributeType(r);
                }
                metaData.FillAttributeTypes();
                this.lstAttributeGroups_SelectionChanged(null, null);

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        /// <summary>
        /// Löscht einen bestehenden AttributeType
        /// </summary>
        private void AttributeType_Delete()
        {
            if (MessageBox.Show("Wollen Sie wirklich den Attributtyp unwiderruflich löschen?", "Löschen bestätigen", MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.No)
                return;
            try
            {
                AttributeType r = metaDataWrapper.GetAttributeType((Guid)lstAttributeTypes.SelectedValue);
                int num = metaDataWrapper.GetItemAttributesCountForAttributeType(r.TypeId);
                if (num > 0)
                {
                    MessageBox.Show(string.Format("Achtung!\r\nEs existieren {0} Attribute dieses Types. Diese müssen zuerst gelöscht werden, bevor Sie diese Aktion fortsetzen können!", num),
                        "Löschen nicht möglich", MessageBoxButton.OK, MessageBoxImage.Stop);
                    return;
                }
                metaDataWrapper.DeleteAttributeType(r);
                metaData.FillAttributeTypes();
                this.lstAttributeGroups_SelectionChanged(null, null);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void btnConvertAttributeTypeToItemType_Click(object sender, RoutedEventArgs e)
        {
            AttributeToItemWindow w = new AttributeToItemWindow((AttributeType)lstAttributeTypes.SelectedItem);
            if (w.ShowDialog() == true)
            {
                metaData.FillAll();
            }
        }

        #endregion

        #region ConnectionTypes

        private void btnDeleteConnectionType_Click(object sender, RoutedEventArgs e)
        {
            ConnectionType_Delete();
        }

        private void btnUpdateConnectionType_Click(object sender, RoutedEventArgs e)
        {
            ConnectionType_Update();
        }

        private void btnNewConnectionType_Click(object sender, RoutedEventArgs e)
        {
            ConnectionType_New();
        }

        private void lstConnectionTypes_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            btnUpdateConnectionType.IsEnabled = (lstConnectionTypes.SelectedValue != null);
            btnCopyConnectionTypeIdToClipBoard.IsEnabled = btnUpdateConnectionType.IsEnabled;
            btnDeleteConnectionType.IsEnabled = (lstConnectionTypes.SelectedValue != null) && metaDataWrapper.CanDeleteConnectionType((ConnectionType)lstConnectionTypes.SelectedItem);
        }

        private void lstConnectionTypes_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.Key)
            {
                case Key.Delete: // Löschen
                    if (lstConnectionTypes.SelectedValue == null || btnDeleteConnectionType.IsEnabled == false)
                        return;
                    ConnectionType_Delete();
                    break;
                case Key.F2: // Umbenennen = Editieren
                    ConnectionType_Update();
                    break;
            }
        }

        private void lstConnectionTypes_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            if (lstConnectionTypes.SelectedItems.Count > 1)
                return;
            if (e.OriginalSource.GetType() == typeof(ScrollViewer))
            {
                ConnectionType_New();
            }
            else
            {
                if (lstConnectionTypes.SelectedItem != null)
                {
                    ConnectionType_Update();
                }
            }
        }

        /// <summary>
        /// Erstellt einen neuen ConnectionType
        /// </summary>
        private void ConnectionType_New()
        {
            Guid id = Guid.NewGuid();
            ConnectionEditor ed = new ConnectionEditor(id, string.Empty, string.Empty, string.Format("{0} neu erstellen", "Verbindungstyp"));
            ed.Owner = this;
            if (ed.ShowDialog() == true)
            {
                metaDataWrapper.CreateConnectionType(new ConnectionType() { ConnTypeId = id, ConnTypeName = ed.NameText, ConnTypeReverseName = ed.ReverseNameText });
            }
            metaData.FillConnectionTypes();
        }

        /// <summary>
        /// Verändert einen bestehenden ConnectionType
        /// </summary>
        private void ConnectionType_Update()
        {
            try
            {
                ConnectionType r = metaDataWrapper.GetConnectionType((Guid)lstConnectionTypes.SelectedValue);
                ConnectionEditor ed = new ConnectionEditor(r.ConnTypeId, r.ConnTypeName, r.ConnTypeReverseName, string.Format("{0}: {1} / {2} editieren", "Verbindungstyp", r.ConnTypeName, r.ConnTypeReverseName));
                ed.Owner = this;
                if (ed.ShowDialog() == true)
                {
                    r.ConnTypeName = ed.NameText;
                    r.ConnTypeReverseName = ed.ReverseNameText;
                    metaDataWrapper.UpdateConnectionType(r);
                }
                metaData.FillConnectionTypes();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        /// <summary>
        /// Löscht einen bestehenden ConnectionType
        /// </summary>
        private void ConnectionType_Delete()
        {
            if (MessageBox.Show("Wollen Sie wirklich den Verbindungstyp unwiderruflich löschen?", "Löschen bestätigen", MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.No)
                return;
            try
            {
                ConnectionType r = metaDataWrapper.GetConnectionType((Guid)lstConnectionTypes.SelectedValue);
                metaDataWrapper.DeleteConnectionType(r);

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            metaData.FillConnectionTypes();
        }


        #endregion

        #region AttributeGroups

        private void lstAttributeGroups_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            bool isNotNull = (lstAttributeGroups.SelectedValue != null);
            btnUpdateAttributeGroup.IsEnabled = isNotNull;
            btnCopyAttributeGroupIdToClipBoard.IsEnabled = isNotNull;
            btnDeleteAttributeGroup.IsEnabled = isNotNull && (metaDataWrapper.CanDeleteAttributeGroup((AttributeGroup)lstAttributeGroups.SelectedItem));
            if (isNotNull)
                createGroupAttributeTypesList();
        }

        /// <summary>
        /// Erzeugt eine Liste mit zwei Buttons pro Eintrag: einen mit der Bezeichnung zum Editieren, und einen mit einem roten X zum Löschen.
        /// </summary>
        private void createGroupAttributeTypesList()
        {
            try
            {
                AttributeGroup group = (AttributeGroup)lstAttributeGroups.SelectedItem;
                IEnumerable<AttributeType> dt = metaDataWrapper.GetAttributeTypesForAttributeGroup(group);
                if (dt.Count() > 0)
                    btnDeleteAttributeGroup.IsEnabled = false;
                spAttributeGroupsAssociates.Children.Clear();
                spAttributeGroupsAssociates.Children.Add(WpfHelper.createTextBlock("Zugeordnete Attributtypen:", new Thickness(0, 0, 0, 10), FontWeights.Bold));
                StackPanel sp;
                // Einen Textblock und einen Button pro Eintrag erzeugen und beschriften
                foreach (AttributeType r in dt)
                {
                    GroupAttributeTypeMapping gar = metaDataWrapper.GetGroupAttributeTypeMapping(group.GroupId, r.TypeId);
                    sp = WpfHelper.createContentStackPanel(Orientation.Horizontal, new Thickness(2, 2, 2, 2));
                    sp.Children.Add(WpfHelper.createTextBlock(r.TypeName, new Thickness(10, 0, 10, 0)));
                    sp.Children.Add(WpfHelper.createImageButton(redX, btnRemoveAttributeTypeFromGroup_Click, "Attributzuordnung aufheben", gar));
                    sp.Children.Add(WpfHelper.createImageButton(moveArrow, btnMoveAttributeTypeToAnotherGroup_Click, "Attributzuordnung in andere Gruppe verschieben", gar));
                    spAttributeGroupsAssociates.Children.Add(sp);
                }
                // Falls es noch nicht zugeordente Attribute gibt, diese in einer Liste mit dem Button "Hinzufügen" anzeigen
                dt = metaDataWrapper.GetAttributeTypesWithoutGroup();
                if (dt.Count() > 0)
                {
                    sp = WpfHelper.createContentStackPanel(Orientation.Horizontal, new Thickness(2, 10, 2, 2));
                    spAttributeGroupsAssociates.Children.Add(sp);
                    lstUngroupedAttributeTypes = new ComboBox();
                    WpfHelper.fillIdNameComboBox(lstUngroupedAttributeTypes, dt, "TypeId", "TypeName");
                    sp.Children.Add(lstUngroupedAttributeTypes);
                    sp.Children.Add(WpfHelper.createButton(WpfHelper.createTextBlock("Hinzufügen", new Thickness(10, 0, 10, 0)), btnAddAttributeTypeToGroup_Click));
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void btnMoveAttributeTypeToAnotherGroup_Click(object sender, RoutedEventArgs e)
        {
            GroupAttributeTypeMapping gar = (GroupAttributeTypeMapping)((Button)sender).Tag;
            IEnumerable<AttributeGroup> targetGroups = metaData.AttributeGroups.Where(ag => !ag.GroupId.Equals(gar.GroupId));
            if (targetGroups.Count() == 0)
            {
                MessageBox.Show("Keine Gruppen zum Verschieben mehr übrig.", "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }
            MoveAttributeToGroupEditor med = new MoveAttributeToGroupEditor(metaDataWrapper.GetAttributeType(gar.AttributeTypeId).TypeName, targetGroups);
            if (med.ShowDialog() == true)
            {
                metaDataWrapper.UpdateGroupAttributeTypeMapping(gar, med.TargetGroupId);
                createGroupAttributeTypesList();
                createItemAttributeGroupsList();
            }
        }

        private void btnAddAttributeTypeToGroup_Click(object sender, RoutedEventArgs e)
        {
            Guid group = (Guid)lstAttributeGroups.SelectedValue, attr = (Guid)lstUngroupedAttributeTypes.SelectedValue;
            metaDataWrapper.CreateGroupAttributeTypeMapping(new GroupAttributeTypeMapping() { GroupId = group, AttributeTypeId = attr });
            createGroupAttributeTypesList();
        }

        private void btnRemoveAttributeTypeFromGroup_Click(object sender, RoutedEventArgs e)
        {
            if (lstAttributeGroups.SelectedValue == null)
                return;
            if (MessageBox.Show("Wollen Sie wirklich die Zuordnung unwiderruflich löschen?", "Löschen bestätigen", MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.No)
                return;
            GroupAttributeTypeMapping gar = (GroupAttributeTypeMapping)((Button)sender).Tag;
            if (!metaDataWrapper.CanDeleteGroupAttributeTypeMapping(gar)) // Falls Attribute existieren, die aus dieser Gruppenzuordnung entstanden sind
            {
                if (MessageBox.Show("ACHTUNG!\r\nEs existieren noch Attribute aus dieser Zuordnung. Die Attributwerte werden unwiderruflich mit gelöscht.\r\n\r\nSind Sie sicher, dass Sie das wollen?",
                    "Löschen bestätigen", MessageBoxButton.OKCancel, MessageBoxImage.Stop, MessageBoxResult.Cancel) == MessageBoxResult.Cancel)
                    return;
                try
                {
                    metaDataWrapper.DeleteGroupAttributeTypeMapping(gar);
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "Fehler beim Löschen", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            createGroupAttributeTypesList();
        }

        private void lstAttributeGroups_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.Key)
            {
                case Key.Delete: // Löschen
                    if (lstAttributeGroups.SelectedValue == null || btnDeleteAttributeGroup.IsEnabled == false)
                        return;
                    AttributeGroup_Delete();
                    break;
                case Key.F2: // Umbenennen = Editieren
                    AttributeGroup_Update();
                    break;
            }
        }

        private void lstAttributeGroups_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            if (lstAttributeGroups.SelectedItems.Count > 1)
                return;
            if (e.OriginalSource.GetType() == typeof(ScrollViewer))
            {
                AttributeGroup_New();
            }
            else
            {
                if (lstAttributeGroups.SelectedItem != null)
                {
                    AttributeGroup_Update();
                }
            }
        }

        private void btnDeleteAttributeGroup_Click(object sender, RoutedEventArgs e)
        {
            AttributeGroup_Delete();
        }

        private void btnUpdateAttributeGroup_Click(object sender, RoutedEventArgs e)
        {
            AttributeGroup_Update();
        }

        private void btnNewAttributeGroup_Click(object sender, RoutedEventArgs e)
        {
            AttributeGroup_New();
        }

        /// <summary>
        /// Erzeugt eine neue Attributgruppe
        /// </summary>
        private void AttributeGroup_New()
        {
            Guid id = Guid.NewGuid();
            string name = string.Empty;
            NameIdEditor ed = new NameIdEditor(id, name, string.Format("{0} neu erstellen", "Attributgruppen-Name"), "Attributgruppen-Name");
            ed.Owner = this;
            if (ed.ShowDialog() == true)
            {
                metaDataWrapper.CreateAttributeGroup(new AttributeGroup() { GroupId = id, GroupName = ed.NameText });
            }
            metaData.FillAttributeGroups();
            this.lstItemTypes_SelectionChanged(null, null);
        }

        /// <summary>
        /// Ändert eine existierende Attributgruppe
        /// </summary>
        private void AttributeGroup_Update()
        {
            try
            {
                AttributeGroup r = metaDataWrapper.GetAttributeGroup((Guid)lstAttributeGroups.SelectedValue);
                NameIdEditor ed = new NameIdEditor(r.GroupId, r.GroupName, string.Format("{0}: {1} editieren", "Attributgruppen-Name", r.GroupName), "Attributgruppen-Name");
                ed.Owner = this;
                if (ed.ShowDialog() == true)
                {
                    r.GroupName = ed.NameText;
                    metaDataWrapper.UpdateAttributeGroup(r);
                }
                metaData.FillAttributeGroups();
                this.lstItemTypes_SelectionChanged(null, null);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        /// <summary>
        /// Löscht eine existierende Attributgruppe
        /// </summary>
        private void AttributeGroup_Delete()
        {
            try
            {
                if (MessageBox.Show("Wollen Sie wirklich den Attributgruppen-Namen unwiderruflich löschen?", "Löschen bestätigen", MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.No)
                    return;
                AttributeGroup r = metaDataWrapper.GetAttributeGroup((Guid)lstAttributeGroups.SelectedValue);
                if (r != null)
                    metaDataWrapper.DeleteAttributeGroup(r);
                metaData.FillAttributeGroups();
                this.lstItemTypes_SelectionChanged(null, null);

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        #endregion

        #region ItemTypes

        private void lstItemTypes_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            bool isNotNull = (lstItemTypes.SelectedValue != null);
            btnUpdateItemType.IsEnabled = isNotNull;
            btnCopyItemTypeIdToClipBoard.IsEnabled = isNotNull;
            btnDeleteItemType.IsEnabled = isNotNull && (metaDataWrapper.CanDeleteItemType((ItemType)lstItemTypes.SelectedItem));
            if (isNotNull)
            {
                spItemTypesAssociates.Background = (Brush)(new BrushConverter().ConvertFrom(((ItemType)lstItemTypes.SelectedItem).TypeBackColor));
                createItemAttributeGroupsList();
            }
        }

        /// <summary>
        /// Erzeugt eine Liste mit den Attributgruppen, die einem Item zugeordnet sind
        /// </summary>
        private void createItemAttributeGroupsList()
        {
            if (lstItemTypes.SelectedItem == null)
                return;
            ItemType itemtype = (ItemType)lstItemTypes.SelectedItem;
            IEnumerable<AttributeGroup> dt = metaDataWrapper.GetAttributeGroupsAssignedToItemType(itemtype.TypeId);
            if (dt.Count() > 0)
                btnDeleteItemType.IsEnabled = false;
            spItemTypesAssociates.Children.Clear();
            spItemTypesAssociates.Children.Add(WpfHelper.createTextBlock("Zugeordnete Attributgruppen:", new Thickness(0, 0, 0, 10), FontWeights.Bold));
            StackPanel sp;
            // Zwei Buttons pro Eintrag erzeugen und beschriften
            foreach (AttributeGroup r in dt)
            {
                ItemTypeAttributeGroupMapping iagr = new ItemTypeAttributeGroupMapping() { GroupId = r.GroupId, ItemTypeId = itemtype.TypeId };
                sp = WpfHelper.createContentStackPanel(Orientation.Horizontal, new Thickness(2, 2, 2, 2));
                sp.Children.Add(WpfHelper.createTextBlock(r.GroupName, new Thickness(10, 0, 10, 0)));
                sp.Children.Add(WpfHelper.createImageButton(redX, btnRemoveAssignedGroup_Click, "Gruppenzuordnung aufheben", iagr));
                spItemTypesAssociates.Children.Add(sp);
            }
            // Falls es noch nicht zugeordente Attribute gibt, diese in einer Liste mit dem Button "Hinzufügen" anzeigen
            dt = metaDataWrapper.GetAttributeGroupsNotAssignedToItemType(itemtype.TypeId);
            if (dt.Count() > 0)
            {
                sp = WpfHelper.createContentStackPanel(Orientation.Horizontal, new Thickness(2, 10, 2, 2));
                spItemTypesAssociates.Children.Add(sp);
                lstNotAddedGroups = new ComboBox();
                WpfHelper.fillIdNameComboBox(lstNotAddedGroups, dt, "GroupId", "GroupName");
                sp.Children.Add(lstNotAddedGroups);
                sp.Children.Add(WpfHelper.createButton(WpfHelper.createTextBlock("Hinzufügen", new Thickness(10, 0, 10, 0)), btnAssingGroupToItem_Click));
            }
        }

        private void btnAssingGroupToItem_Click(object sender, RoutedEventArgs e)
        {
            ItemType itemtype = (ItemType)lstItemTypes.SelectedItem;
            Guid group = (Guid)lstNotAddedGroups.SelectedValue;
            metaDataWrapper.CreateItemTypeAttributeGroupMapping(new ItemTypeAttributeGroupMapping() { GroupId = group, ItemTypeId = itemtype.TypeId });
            createItemAttributeGroupsList();
            lstAttributeGroups_SelectionChanged(sender, null);
        }

        private void btnRemoveAssignedGroup_Click(object sender, RoutedEventArgs e)
        {
            if (lstItemTypes.SelectedValue == null)
                return;
            if (MessageBox.Show("Wollen Sie wirklich die Zuordnung unwiderruflich löschen?", "Löschen bestätigen", MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.No)
                return;
            ItemTypeAttributeGroupMapping iagr = (ItemTypeAttributeGroupMapping)((Button)sender).Tag;
            if (!metaDataWrapper.CanDeleteItemTypeAttributeGroupMapping(iagr) &&
                MessageBox.Show("ACHTUNG!\r\nEs existieren noch Attribute aus dieser Zuordnung. Die Attributwerte werden unwiderruflich mit gelöscht.\r\n\r\nSind Sie sicher, dass Sie das wollen?",
                "Löschen bestätigen", MessageBoxButton.OKCancel, MessageBoxImage.Stop, MessageBoxResult.Cancel) == MessageBoxResult.Cancel)
                return;
            try
            {
                metaDataWrapper.DeleteItemTypeAttributeGroupMapping(iagr);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Fehler beim Löschen", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            createItemAttributeGroupsList();
            lstAttributeGroups_SelectionChanged(sender, null);
        }

        private void lstItemTypes_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.Key)
            {
                case Key.Delete: // Löschen
                    if (lstItemTypes.SelectedValue == null || btnDeleteItemType.IsEnabled == false)
                        return;
                    ItemType_Delete();
                    break;
                case Key.F2: // Umbenennen = Editieren
                    ItemType_Update();
                    break;
            }
        }

        private void lstItemTypes_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            if (lstItemTypes.SelectedItems.Count > 1)
                return;
            if (e.OriginalSource.GetType() == typeof(ScrollViewer))
            {
                ItemType_New();
            }
            else
            {
                if (lstItemTypes.SelectedItem != null)
                {
                    ItemType_Update();
                }
            }
        }

        private void btnNewItemType_Click(object sender, RoutedEventArgs e)
        {
            ItemType_New();
        }

        private void btnUpdateItemType_Click(object sender, RoutedEventArgs e)
        {
            ItemType_Update();
        }

        private void btnDeleteItemType_Click(object sender, RoutedEventArgs e)
        {
            ItemType_Delete();
        }

        /// <summary>
        /// Erzeugt einen neuen ItemType
        /// </summary>
        private void ItemType_New()
        {
            Guid id = Guid.NewGuid();
            string name = string.Empty;
            ItemTypeEditor ed = new ItemTypeEditor(id, name, string.Format("{0} neu erstellen", "Item-Typ"), "Itemtyp-Name", "#FFFFFF");
            ed.Owner = this;
            if (ed.ShowDialog() == true)
            {
                metaDataWrapper.CreateItemType(new ItemType() { TypeId = id, TypeName = ed.NameText, TypeBackColor = ed.Color });
            }
            metaData.FillItemTypes();
        }

        /// <summary>
        /// Ändert einen existierenden ItemType
        /// </summary>
        private void ItemType_Update()
        {
            try
            {
                ItemType r = (ItemType)lstItemTypes.SelectedItem;
                ItemTypeEditor ed = new ItemTypeEditor(r.TypeId, r.TypeName, string.Format("{0}: {1} editieren", "Item-Typ", r.TypeName), "Itemtyp-Name", r.TypeBackColor);
                ed.Owner = this;
                if (ed.ShowDialog() == true)
                {
                    r.TypeName = ed.NameText;
                    r.TypeBackColor = ed.Color;
                    metaDataWrapper.UpdateItemType(r);
                }
                metaData.FillItemTypes();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        /// <summary>
        /// Löscht einen existierenden ItemType
        /// </summary>
        private void ItemType_Delete()
        {
            try
            {
                if (MessageBox.Show("Wollen Sie wirklich den Item-Typ unwiderruflich löschen?", "Löschen bestätigen", MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.No)
                    return;
                ItemType r = (ItemType)lstItemTypes.SelectedItem;
                OperationResult or = metaDataWrapper.DeleteItemType(r);
                if (!or.Success)
                    MessageBox.Show(or.Message, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
                metaData.FillItemTypes();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        #endregion

        #region ConnectionRules

        /// <summary>
        /// Erzeugt eine gefilterte Liste von Verbindungsregeln im GridView grConnectionRules.
        /// </summary>
        /// <param name="dv">DataView mit den gefilterten Daten</param>
        private void createFilteredConnectionRulesList(IEnumerable<ConnectionRule> dv)
        {
            grConnectionRules.RowDefinitions.Clear();
            grConnectionRules.Children.Clear();

            for (int i = 0; i < 3; i++)
            {
                GridSplitter gs = new GridSplitter();
                gs.HorizontalAlignment = System.Windows.HorizontalAlignment.Center;
                gs.ResizeBehavior = GridResizeBehavior.PreviousAndNext;
                gs.ResizeDirection = GridResizeDirection.Columns;
                gs.Width = 3;
                grConnectionRules.Children.Add(gs);
                Grid.SetColumn(gs, i * 2 + 1);
            }

            // Erzeugt die RowDefinitions für die Überschrift und die Filter-ComboBoxen
            for (int i = 0; i < 2; i++)
            {
                grConnectionRules.RowDefinitions.Add(new RowDefinition());
            }
            this.fillGridRowWithText(grConnectionRules, 0, "Regel-ID", "Oberer Itemtyp", "Verbindungstyp", "Unterer Itemtyp", "Minimum", "Maximum", "Anzahl", "Löschen");

            // Wenn keine Datensätze mit Filter übereinstimmen und alle Filter gesetzt sind, Button "Erstellen" links neben dem Filter anzeigen
            Button bt = null;
            if (dv.Count() == 0 && lstFilterRulesUpper.SelectedIndex != 0 && lstFilterRulesLower.SelectedIndex != 0 && lstFilterRulesConnType.SelectedIndex != 0)
            {
                bt = WpfHelper.createButton("Neu", btnNewConnectionRule_Click);
            }

            // Filter anzeigen
            this.fillGridRow(grConnectionRules, 1, null, lstFilterRulesUpper, lstFilterRulesConnType, lstFilterRulesLower, bt, null, WpfHelper.createTextBlock("Regeln"));

            int ctr = 0;
            foreach (ConnectionRule r in dv)
            {
                grConnectionRules.RowDefinitions.Add(new RowDefinition());
                int numberOfRules = metaDataWrapper.GetConnectionCountForConnectionRule(r.RuleId);
                UIElement e;
                if (numberOfRules > 0)
                    e = WpfHelper.createTextBlock("");
                else
                    e = WpfHelper.createImageButton(redX, btnDeleteConnectionRule_Click, "Verbindungsregel löschen", r.RuleId);
                this.fillGridRow(grConnectionRules, ctr + 2, WpfHelper.createTextBlock(r.RuleId.ToString()),
                    WpfHelper.createTextBlock(metaData.ItemTypes.Single(t => t.TypeId.Equals(r.ItemUpperType)).TypeName),
                    WpfHelper.createTextBlock(metaData.ConnectionTypes.Single(t => t.ConnTypeId.Equals(r.ConnType)).ConnTypeName),
                    WpfHelper.createTextBlock(metaData.ItemTypes.Single(t => t.TypeId.Equals(r.ItemLowerType)).TypeName),
                    WpfHelper.createTextBlock(r.MaxConnectionsToUpper.ToString()),
                    WpfHelper.createTextBlock(r.MaxConnectionsToLower.ToString()),
                    WpfHelper.createButton(numberOfRules.ToString(), btnUpdateConnectionRule_Click, r.RuleId),
                    e);
                ctr++;
            }
        }

        private void lstFilterRules_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // Filter anhand der ausgewählten Einträge erstellen
            IEnumerable<ConnectionRule> rules = metaDataWrapper.GetConnectionRules();
            if (lstFilterRulesUpper.SelectedIndex > 0)
                rules = rules.Where(r => r.ItemUpperType.Equals(Guid.Parse(lstFilterRulesUpper.SelectedValue.ToString())));
            if (lstFilterRulesLower.SelectedIndex > 0)
                rules = rules.Where(r => r.ItemLowerType.Equals((Guid)lstFilterRulesLower.SelectedValue));
            if (lstFilterRulesConnType.SelectedIndex > 0)
                rules = rules.Where(r => r.ConnType.Equals((Guid)lstFilterRulesConnType.SelectedValue));
            this.createFilteredConnectionRulesList(rules);
        }

        private void btnNewConnectionRule_Click(object sender, RoutedEventArgs e)
        {
            Guid upper = Guid.Parse(lstFilterRulesUpper.SelectedValue.ToString()),
                lower = Guid.Parse(lstFilterRulesLower.SelectedValue.ToString()),
                connType = Guid.Parse(lstFilterRulesConnType.SelectedValue.ToString());
            TwoValueEditor ed = new TwoValueEditor(1, string.Format(maxNum, lstFilterRulesUpper.Text), 1, string.Format(maxNum, lstFilterRulesLower.Text), "Neue Regel erstellen");
            if (ed.ShowDialog() == true)
            {
                metaDataWrapper.CreateConnectionRule(new ConnectionRule() { RuleId = Guid.NewGuid(), ItemUpperType = upper, ConnType = connType, ItemLowerType = lower, MaxConnectionsToUpper = ed.FirstValue, MaxConnectionsToLower = ed.SecondValue });
                lstFilterRules_SelectionChanged(sender, null);
            }
        }

        private void btnCopyToClipBoard_Click(object sender, RoutedEventArgs e)
        {
            if ((sender as Button).Tag != null)
                Clipboard.SetText((sender as Button).Tag.ToString());
        }

        private void btnUpdateConnectionRule_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                ConnectionRule r = metaDataWrapper.GetConnectionRule((Guid)((Button)sender).Tag);
                TwoValueEditor ed = new TwoValueEditor(r.MaxConnectionsToUpper, string.Format(maxNum, metaDataWrapper.GetItemType(r.ItemUpperType).TypeName),
                    r.MaxConnectionsToLower, string.Format(maxNum, metaDataWrapper.GetItemType(r.ItemLowerType).TypeName), "Regel anpassen");
                if (ed.ShowDialog() == true)
                {
                    if (r.MaxConnectionsToUpper != ed.FirstValue)
                        r.MaxConnectionsToUpper = ed.FirstValue;
                    if (r.MaxConnectionsToLower != ed.SecondValue)
                        r.MaxConnectionsToLower = ed.SecondValue;
                    metaDataWrapper.UpdateConnectionRule(r);
                    lstFilterRules_SelectionChanged(sender, null);
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void btnDeleteConnectionRule_Click(object sender, RoutedEventArgs e)
        {
            if (MessageBox.Show("Wollen Sie wirklich die Verbindungsregel unwiderruflich löschen?", "Löschen bestätigen", MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.No)
                return;
            try
            {
                ConnectionRule r = metaDataWrapper.GetConnectionRule((Guid)((Button)sender).Tag);
                if (r != null)
                    metaDataWrapper.DeleteConnectionRule(r);

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Fehler", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            lstFilterRules_SelectionChanged(sender, null);
        }

        #endregion

    }
}
