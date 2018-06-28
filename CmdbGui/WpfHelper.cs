using System;
using System.Collections;
using System.Data;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace CmdbGui
{
    /// <summary>
    /// Enthält Funktionen zum vereinfachten Erzeugen von UI-Elementen mit Attributen
    /// </summary>
    public static class WpfHelper
    {
        /// <summary>
        /// Füllt eine Listview mit den Daten einer Tabelle, die die Spalten ID und Name enthält, wobei die entsprechenden Spaltennamen der DataTable mitgegeben und übersetzt werden
        /// </summary>
        /// <param name="lv">Listview, das gefüllt werden soll</param>
        /// <param name="t">DataTable, die zum Füllen verwendet wird</param>
        /// <param name="idColumnName">Bezeichnung der ID-Spalte</param>
        /// <param name="nameColumnName">Bezeichnung der Name-Spalte</param>
        public static void fillIdNameListView(ListView lv, IEnumerable t, string idColumnName, string nameColumnName)
        {
            lv.ItemsSource = null;
            lv.Items.Clear();
            lv.ItemsSource = t;
            GridView gv = new GridView();
            gv.Columns.Add(createGridViewColumn("ID", idColumnName));
            gv.Columns.Add(createGridViewColumn("Name", nameColumnName));
            gv.Columns[0].Width = 0;
            lv.View = gv;
            lv.SelectionMode = SelectionMode.Single;
            lv.SelectedValuePath = idColumnName;
            lv.DisplayMemberPath = nameColumnName;

        }

        /// <summary>
        /// Überladen: Füllt eine ComboBox mit den Daten einer Tabelle, die die Spalten ID und Name enthält, wobei die entsprechenden Spaltennamen der DataTable mitgegeben und übersetzt werden
        /// </summary>
        /// <param name="cb">ComboBox, die gefüllt werden soll</param>
        /// <param name="t">IEnumerable, das zum Füllen verwendet wird</param>
        /// <param name="idFieldName">Bezeichnung der ID-Spalte</param>
        /// <param name="nameFieldName">Bezeichnung der Name-Spalte</param>
        public static void fillIdNameComboBox(ComboBox cb, IEnumerable t, string idFieldName, string nameFieldName)
        {
            cb.ItemsSource = null;
            cb.ItemsSource = t;
            cb.SelectedValuePath = idFieldName;
            cb.DisplayMemberPath = nameFieldName;
            try
            {
                cb.SelectedIndex = 0;
            }
            catch { }
        }

        /// <summary>
        /// Überladen: Füllt eine ComboBox mit den Daten einer Tabelle, die die Spalten Id und Name enthält
        /// </summary>
        /// <param name="cb">ComboBox, die gefüllt werden soll</param>
        /// <param name="list">IEnumerable, das zum Füllen verwendet wird</param>
        public static void fillIdNameComboBox(ComboBox cb, IEnumerable list)
        {
            fillIdNameComboBox(cb, list, "Id", "Name");
        }

        /// <summary>
        /// Erzeugt in einem Grid eine benannten Spalte mit Überschrift
        /// </summary>
        /// <param name="header">Überschriftentext</param>
        /// <param name="columnName">Spaltenname</param>
        /// <returns>GridViewColumn-Objekt</returns>
        public static GridViewColumn createGridViewColumn(string header, string columnName)
        {
            GridViewColumn gvc = new GridViewColumn();
            gvc.Header = header;
            gvc.DisplayMemberBinding = new System.Windows.Data.Binding(columnName);
            return gvc;
        }

        /// <summary>
        /// Überladen: Erzeugt einen breiten Command-Button mit Text zusätzlichem Rand
        /// </summary>
        /// <param name="text">Text, der auf dem Button erscheinen soll</param>
        /// <param name="click">Click-Eventhandler</param>
        /// <param name="margin">Randbreite des Buttons</param>
        /// <param name="tag">Zusätzliche Informationen</param>
        /// <returns>Button</returns>
        public static Button createCommandButton(string text, System.Windows.RoutedEventHandler click, Thickness margin, object tag)
        {
            Button btn = createCommandButton(text, click, margin);
            btn.Tag = tag;
            return btn;
        }

        /// <summary>
        /// Überladen: Erzeugt einen breiten Command-Button mit Text zusätzlichem Rand
        /// </summary>
        /// <param name="text">Text, der auf dem Button erscheinen soll</param>
        /// <param name="click">Click-Eventhandler</param>
        /// <param name="tag">Zusätzliche Informationen</param>
        /// <returns>Button</returns>
        public static Button createCommandButton(string text, System.Windows.RoutedEventHandler click, object tag)
        {
            Button btn = createCommandButton(text, click);
            btn.Tag = tag;
            return btn;
        }

        /// <summary>
        /// Überladen: Erzeugt einen breiten Command-Button mit Text zusätzlichem Rand
        /// </summary>
        /// <param name="text">Text, der auf dem Button erscheinen soll</param>
        /// <param name="click">Click-Eventhandler</param>
        /// <returns>Button</returns>
        public static Button createCommandButton(string text, System.Windows.RoutedEventHandler click)
        {
            return createButton(createTextBlock(text, new Thickness(10, 3, 10, 3)), click, new Thickness(10, 10, 10, 10));
        }

        /// <summary>
        /// Überladen: Erzeugt einen Button mit einem Bild
        /// </summary>
        /// <param name="imageSource">Bild, das verwendet werden soll</param>
        /// <param name="click">Click-Eventhandler</param>
        /// <param name="tag">Zusätzliche Information</param>
        /// <returns>Button</returns>
        public static Button createImageButton(ImageSource imageSource, System.Windows.RoutedEventHandler click, string toolTipText, object tag, Thickness margin)
        {
            Button btn = createImageButton(imageSource, click, toolTipText, tag);
            btn.Margin = new Thickness(5, 5, 5, 5);
            return btn;
        }

        /// <summary>
        /// Überladen: Erzeugt einen Button mit einem Bild
        /// </summary>
        /// <param name="imageSource">Bild, das verwendet werden soll</param>
        /// <param name="click">Click-Eventhandler</param>
        /// <param name="tag">Zusätzliche Information</param>
        /// <returns>Button</returns>
        public static Button createImageButton(ImageSource imageSource, System.Windows.RoutedEventHandler click, string toolTipText, object tag)
        {
            Button btn = createImageButton(imageSource, click, toolTipText);
            btn.Tag = tag;
            return btn;
        }

        /// <summary>
        /// Überladen: Erzeugt einen Button mit einem Bild
        /// </summary>
        /// <param name="imageSource">Bild, das verwendet werden soll</param>
        /// <param name="click">Click-Eventhandler</param>
        /// <param name="tag">Zusätzliche Information</param>
        /// <returns>Button</returns>
        public static Button createImageButton(ImageSource imageSource, System.Windows.RoutedEventHandler click, string toolTipText)
        {
            Image img = new Image();
            img.Source = imageSource;
            img.Stretch = Stretch.Uniform;
            img.MaxHeight = 12;
            Button btn = createButton(img, click);
            btn.Width = imageSource.Width;
            btn.Margin = new Thickness(1, 0, 1, 0);
            btn.HorizontalAlignment = HorizontalAlignment.Left;
            btn.ToolTip = toolTipText;
            return btn;
        }

        /// <summary>
        /// Überladen: Erzeugt einen Button mit beliebigem Content, einen Click-Eventhandler und einem Rand
        /// </summary>
        /// <param name="content">Inhalt, z. B. Image oder Textblock</param>
        /// <param name="click">Click-Eventhandler</param>
        /// <param name="margin">Randbreite des Buttons</param>
        /// <returns>Button</returns>
        public static Button createButton(object content, RoutedEventHandler click, Thickness margin)
        {
            Button bt = createButton(content, click);
            bt.Margin = margin;
            return bt;
        }

        /// <summary>
        /// Überladen: Erzeugt einen Button mit beliebigem Content, einen Click-Eventhandler und einem zugeordneten Tag
        /// </summary>
        /// <param name="content">Inhalt, z. B. Image oder Textblock</param>
        /// <param name="click">Click-Eventhandler</param>
        /// <returns>Button</returns>
        public static Button createButton(object content, RoutedEventHandler click, object tag)
        {
            Button bt = createButton(content, click);
            bt.Tag = tag;
            return bt;
        }

        /// <summary>
        /// Überladen: Erzeugt einen Button mit beliebigem Content, einen Click-Eventhandler
        /// </summary>
        /// <param name="content">Inhalt, z. B. Image oder Textblock</param>
        /// <param name="click">Click-Eventhandler</param>
        /// <returns>Button</returns>
        public static Button createButton(object content, RoutedEventHandler click)
        {
            Button bt = new Button();
            bt.Content = content;
            bt.Click += click;
            return bt;
        }

        /// <summary>
        /// Überladen: Erzeugt einen Textblock mit dem angegebenen Text
        /// </summary>
        /// <param name="text">Text, der im Textblock erscheinen soll</param>
        /// <returns>Textblock mit Text</returns>
        public static TextBlock createTextBlock(string text)
        {
            int number;
            TextBlock tb = new TextBlock();
            tb.Text = text;
            if (Int32.TryParse(text, out number))
                tb.HorizontalAlignment = System.Windows.HorizontalAlignment.Right;
            return tb;
        }

        /// <summary>
        /// Überladen: Erzeugt einen Textblock mit dem angegebenen Text und Rahmen
        /// </summary>
        /// <param name="text">Text, der im Textblock erscheinen soll</param>
        /// <param name="margin">Rahmen, der gesetzt werden soll</param>
        /// <returns>Textblock mit Text und Rahmen</returns>
        public static TextBlock createTextBlock(string text, Thickness margin)
        {
            TextBlock tb = createTextBlock(text);
            tb.Margin = margin;
            return tb;
        }

        /// <summary>
        /// Überladen: Erzeugt einen Textblock mit dem angegebenen Text und Rahmen und Schreibstil
        /// </summary>
        /// <param name="text">Text, der im Textblock erscheinen soll</param>
        /// <param name="margin">Rahmen, der gesetzt werden soll</param>
        /// <param name="fontWeight">Schreibstil (Fett)</param>
        /// <returns>Textblock mit Text und Rahmen</returns>
        public static TextBlock createTextBlock(string text, Thickness margin, FontWeight fontWeight)
        {
            TextBlock tb = createTextBlock(text, margin);
            tb.FontWeight = fontWeight;
            return tb;
        }

        /// <summary>
        /// Überladen: Erzeugt ein Dockpanel, in dem das letzte Child-Element den verbleibenden Platz ausfüllt
        /// </summary>
        /// <returns>DockPanel</returns>
        public static DockPanel createContentDockPanel()
        {
            DockPanel dp = new DockPanel();
            dp.Background = new SolidColorBrush(SystemColors.WindowColor);
            dp.LastChildFill = true;
            return dp;
        }

        /// <summary>
        /// Überladen: Erzeugt ein Dockpanel, in dem das letzte Child-Element den verbleibenden Platz ausfüllt mit einem gegebenen Rahmen
        /// </summary>
        /// <param name="margin">Rand</param>
        /// <returns>DockPanel</returns>
        public static DockPanel createContentDockPanel(Thickness margin)
        {
            DockPanel dp = createContentDockPanel();
            dp.Margin = margin;
            return dp;
        }

        /// <summary>
        /// Überladen: Erzeugt ein Stackpanel, mit der angegebenen Ausrichtung und dem angegebenen Rahmen
        /// </summary>
        /// <param name="orientation">Ausrichtung des Stackpanel</param>
        /// <param name="margin">Rahmenstärke</param>
        /// <returns>Stackpanel</returns>
        public static StackPanel createContentStackPanel(Orientation orientation, Thickness margin)
        {
            StackPanel sp = createContentStackPanel(orientation);
            sp.Margin = margin;
            return sp;
        }

        /// <summary>
        /// Überladen: Erzeugt ein Stackpanel, mit der angegebenen Ausrichtung
        /// </summary>
        /// <param name="orientation">Ausrichtung des Stackpanel</param>
        /// <returns>Stackpanel</returns>
        public static StackPanel createContentStackPanel(Orientation orientation)
        {
            StackPanel sp = new StackPanel();
            sp.Orientation = orientation;
            return sp;
        }

        public static Border createBorder(Thickness borderThickness, Brush brush, HorizontalAlignment hAlign, VerticalAlignment vAlign, UIElement child)
        {
            Border b = new Border();
            b.BorderThickness = borderThickness;
            b.BorderBrush = brush;
            b.HorizontalAlignment = hAlign;
            b.VerticalAlignment = vAlign;
            b.Child = child;
            return b;
        }

        /// <summary>
        /// Platziert ein UIElement in einem Grid an der angegebenen Position
        /// </summary>
        /// <param name="gr">Grid, das verwendet werden soll</param>
        /// <param name="ue">UIElement</param>
        /// <param name="row">Zeile, in der das Element platziert wird</param>
        /// <param name="col">Spalte, in der das Element platziet wird</param>
        public static void placeGridContent(Grid gr, UIElement ue, int row, int col)
        {
            if (ue == null)
                return;
            gr.Children.Add(ue);
            Grid.SetRow(ue, row);
            Grid.SetColumn(ue, col);
        }

        /// <summary>
        /// Überladen: Platziert ein UIElement in einem Grid an der angegebenen Position
        /// </summary>
        /// <param name="gr">Grid, das verwendet werden soll</param>
        /// <param name="ue">UIElement</param>
        /// <param name="row">Zeile, in der das Element platziert wird</param>
        /// <param name="col">Spalte, in der das Element platziet wird</param>
        /// <param name="align">Horizontale Ausrichtung des Elements im Grid</param>
        /// <param name="vAlign">Vertikale Ausrichtung des Elements im Grid</param>
        /// <param name="margin">Rand um das Element</param>
        public static void placeGridContent(Grid gr, UIElement ue, int row, int col, HorizontalAlignment align, VerticalAlignment vAlign, Thickness margin)
        {
            if (ue == null)
                return;
            if (ue is FrameworkElement)
            {
                FrameworkElement fe = (FrameworkElement)ue;
                fe.Margin = margin;
                fe.HorizontalAlignment = align;
                fe.VerticalAlignment = vAlign;
            }
            placeGridContent(gr, ue, row, col);
        }

        /// <summary>
        /// Erzeugt einen hellgrauen Hintergrund - außer in der obersten Zeile, die ist dunkelgrau - sowie einen hellgrauen Rahmen um jede Zelle
        /// </summary>
        /// <param name="gr">Grid, das bearbeitet wird</param>
        /// <param name="row">Gridzeile, die bearbeitet wird</param>
        public static void setRowBackground(Grid gr, int row)
        {
            setRowBackground(gr, row, (row == 0 ? Brushes.LightGray : Brushes.Transparent), (row == 0 ? Brushes.Gray : Brushes.LightGray));
        }

        /// <summary>
        /// Erzeugt einen beliebigen Hintergrund sowie einen beliebigen Rahmen um jede Zelle
        /// </summary>
        /// <param name="gr">Grid, das bearbeitet wird</param>
        /// <param name="row">Gridzeile, die bearbeitet wird</param>
        public static void setRowBackground(Grid gr, int row, Brush backGround, Brush stroke)
        {
            for (int j = 0; j < gr.ColumnDefinitions.Count; j++)
            {
                Rectangle re = createRectangle(backGround, stroke);
                placeGridContent(gr, re, row, j);
            }
        }

        /// <summary>
        /// Erzeugt ein Rechteck mit der angegebenen Füllarbe und Linienfarbe
        /// </summary>
        /// <param name="backGround"></param>
        /// <param name="stroke"></param>
        /// <returns></returns>
        public static Rectangle createRectangle(Brush backGround, Brush stroke)
        {
            Rectangle re = new Rectangle();
            re.Stroke = stroke;
            re.Fill = backGround;
            return re;
        }

        /// <summary>
        /// Aktualisiert die Bindungswerte
        /// </summary>
        /// <param name="property">Die Eigenschaft, die aktualisiert werden soll</param>
        /// <param name="controls">Alle betroffenen Controls</param>
        public static void RefreshControlsBoundProperty(DependencyProperty property, params Control[] controls)
        {
            foreach (Control c in controls)
            {
                c.GetBindingExpression(property).UpdateTarget();
            }
        }



        /// <summary>
        /// Gibt mittels rekursiver Suche ein Kindelement von einem angegebenen Typ zurück
        /// </summary>
        /// <typeparam name="T">Type des zu suchenden Kindelements</typeparam>
        /// <param name="depObj">Objekt, das durchsucht werden soll</param>
        /// <returns>Kindelement</returns>
        public static T GetChildOfType<T>(this DependencyObject depObj) where T : DependencyObject
        {
            if (depObj == null) return null;

            for (int i = 0; i < VisualTreeHelper.GetChildrenCount(depObj); i++)
            {
                var child = VisualTreeHelper.GetChild(depObj, i);

                var result = (child as T) ?? GetChildOfType<T>(child);
                if (result != null) return result;
            }
            return null;
        }

        /// <summary>
        /// Gibt mittels rekursiver Suche alle Kindelemente von einem angegebenen Typ zurück
        /// </summary>
        /// <typeparam name="T">Type des zu suchenden Kindelements</typeparam>
        /// <param name="depObj">Objekt, das durchsucht werden soll</param>
        /// <returns>Kindelemente</returns>
        public static System.Collections.Generic.IEnumerable<T> GetChildrenOfType<T>(this DependencyObject depObj) where T : DependencyObject
        {
            if (depObj != null)
            {
                for (int i = 0; i < VisualTreeHelper.GetChildrenCount(depObj); i++)
                {
                    var child = VisualTreeHelper.GetChild(depObj, i);
                    System.Diagnostics.Debug.WriteLine(child);

                    var result = (child as T) ?? GetChildOfType<T>(child);
                    if (result != null) yield return result;
                }
            }
        }

/*        /// <summary>
        /// Berechnet den Size (Höhe und Breite) eines gegebenen Textes in der angegebenen Schriftausprägung
        /// </summary>
        /// <param name="candidate">Textkandidat zum prüfen</param>
        /// <param name="fontFamily">FontFamily</param>
        /// <param name="emSize">Größe in em</param>
        /// <param name="fontStyle">Italic oder nicht</param>
        /// <param name="fontWeight">Fett oder nicht</param>
        /// <param name="fontStretch">Streckungsgrad</param>
        /// <returns>Size</returns>
        public static Size MeasureString(string candidate, FontFamily fontFamily, double emSize, FontStyle fontStyle, FontWeight fontWeight, FontStretch fontStretch)
        {
            FormattedText formattedText = new FormattedText(candidate,
                System.Globalization.CultureInfo.CurrentUICulture,
                FlowDirection.LeftToRight, new Typeface(fontFamily, fontStyle, fontWeight, fontStretch),
                emSize, Brushes.Black)
            {
                MaxTextWidth = 200
            };

            return new Size(formattedText.Width, formattedText.Height);
        }
*/
        /// <summary>
        /// Erzeugt eine Kopie von einem XML-Element
        /// </summary>
        /// <param name="element">Element, das kopiert wird</param>
        /// <returns>Ein identisches Objekt (Klon)</returns>
        public static object CloneUIElement(object element)
        {
            string elementXaml = System.Windows.Markup.XamlWriter.Save(element);
            System.IO.StringReader stringReader = new System.IO.StringReader(elementXaml);
            System.Xml.XmlReader xmlReader = System.Xml.XmlReader.Create(stringReader);
            return (UIElement)System.Windows.Markup.XamlReader.Load(xmlReader);
        }

        /// <summary>
        /// Copies a UI element to the clipboard as an image.
        /// </summary>
        /// <param name="element">The element to copy.</param>
        public static void CopyUIElementToClipboard(FrameworkElement element)
        {
            double width = element.ActualWidth;
            double height = element.ActualHeight;
            RenderTargetBitmap bmpCopied = new RenderTargetBitmap((int)Math.Round(width), (int)Math.Round(height), 96, 96, PixelFormats.Default);
            DrawingVisual dv = new DrawingVisual();
            using (DrawingContext dc = dv.RenderOpen())
            {
                VisualBrush vb = new VisualBrush(element);
                dc.DrawRectangle(vb, null, new Rect(new Point(), new Size(width, height)));
            }
            bmpCopied.Render(dv);
            // Clipboard.SetImage würde aufgrund mangelnder Transparenzinformationen durch die Beschränkung auf 24 Bit Farbtiefe in diesem Befehl die transparenten Teile schwarz färben.
            // Folglich muss das Bild in das PNG-Format kopiert werden, das die Transparenzinformationen behält.
            System.IO.MemoryStream st = new System.IO.MemoryStream();
            PngBitmapEncoder enc = new PngBitmapEncoder();
            enc.Frames.Add(BitmapFrame.Create(bmpCopied));
            enc.Save(st);
            DataObject data = new DataObject("PNG", st);
            Clipboard.SetDataObject(data, true);
        }
    }
}
