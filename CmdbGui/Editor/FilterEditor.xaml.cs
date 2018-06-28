using CmdbClient.CmsService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace CmdbGui
{
    /// <summary>
    /// Interaktionslogik für FilterEditor.xaml
    /// </summary>
    public partial class FilterEditor : Window
    {
        internal FilterEditor(IEnumerable<ConnectionType> ctt, IEnumerable<ItemType> itt)
        {
            InitializeComponent();
            lstConnTypes.ItemsSource = ctt;
            lstItemTypes.ItemsSource = itt;
            lstConnTypes.SelectAll();
            lstItemTypes.SelectAll();
            this.PreviewKeyDown += new KeyEventHandler(CloseOnEscape);
        }

        private void CloseOnEscape(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Escape)
                this.Close();
        }

        public int DownwardMaximum { get { return Convert.ToInt32(txtDownward.Text); } }

        public int UpwardMaximum { get { return Convert.ToInt32(txtUpward.Text); } }

        //public IEnumerable<Guid> SelectedConnectionTypes { get { return lstConnTypes.SelectedItems.OfType<System.Data.DataRowView>().Select(a => ((ConnectionTypesRow)a.Row).ConnTypeId); } }

        //public IEnumerable<Guid> SelectedItemTypes { get { return lstItemTypes.SelectedItems.OfType<System.Data.DataRowView>().Select(a => ((CMDBDataSet.ItemTypesRow)a.Row).TypeId); } }

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
            return (newPos > 0 && newPos <= 9999);
        }

        private void btnOK_Click(object sender, RoutedEventArgs e)
        {
            e.Handled = true;
            if (lstConnTypes.SelectedItems.Count == 0)
            {
                FocusManager.SetFocusedElement(this, lstConnTypes);
                return;
            }
            if (lstItemTypes.SelectedItems.Count == 0)
            {
                FocusManager.SetFocusedElement(this, lstItemTypes);
                return;
            }
            this.DialogResult = true;
            this.Close();

        }

    }
}
