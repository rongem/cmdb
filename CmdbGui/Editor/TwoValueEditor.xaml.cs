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

namespace CmdbGui
{
    /// <summary>
    /// Interaktionslogik für TwoValueEditor.xaml
    /// </summary>
    public partial class TwoValueEditor : Window
    {
        public TwoValueEditor(int firstValue, string firstDescription, int secondValue, string SecondDescription, string windowTitle)
        {
            InitializeComponent();
            this.Title = windowTitle;
            this.txtFirst.Text = firstValue.ToString();
            this.lblFirst.Text = firstDescription;
            this.txtSecond.Text = secondValue.ToString();
            this.lblSecond.Text = SecondDescription;
            FocusManager.SetFocusedElement(this, txtFirst);
            this.PreviewKeyDown += new KeyEventHandler(CloseOnEscape);
        }

        private void CloseOnEscape(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Escape)
                this.Close();
        }

        private void btnSave_Click(object sender, RoutedEventArgs e)
        {
            // Textfelder von Leerzeichen befreien
            txtFirst.Text = txtFirst.Text.Trim();
            txtSecond.Text = txtSecond.Text.Trim();
            if (string.IsNullOrEmpty(txtFirst.Text))
            {
                FocusManager.SetFocusedElement(this, this.txtFirst);
                return;
            }
            if (string.IsNullOrEmpty(this.txtSecond.Text))
            {
                FocusManager.SetFocusedElement(this, this.txtSecond);
                return;
            }
            try
            {
                // Minimum darf nicht kleiner als 1 und nicht größer als 9999 sein
                if (Convert.ToInt32(this.txtFirst.Text) < 1 || Convert.ToInt32(this.txtFirst.Text) > 9999)
                {
                    FocusManager.SetFocusedElement(this, this.txtFirst);
                    return;
                } 
                // Maximum darf nicht kleiner als 1 und nicht größer als 9999 sein
                if (Convert.ToInt32(this.txtSecond.Text) < 1 || Convert.ToInt32(this.txtSecond.Text) > 9999)
                {
                    FocusManager.SetFocusedElement(this, this.txtSecond);
                    return;
                }
            }
            catch
            {
                return;
            }
            e.Handled = true;
            this.DialogResult = true;
            this.Close();
        }

        private void Text_PreviewKeyDown(object sender, KeyEventArgs e)
        {
            // Leertaste nicht zulassen
            if (e.Key == Key.Space)
                e.Handled = true;
        }

        private void Text_PreviewTextInput(object sender, TextCompositionEventArgs e)
        {
            // Nur Ziffern zulassen
            if (!System.Text.RegularExpressions.Regex.IsMatch(e.Text, "[0-9]"))
                e.Handled = true;
        }

        internal int FirstValue { get { return Convert.ToInt32(this.txtFirst.Text); } }
        internal int SecondValue { get { return Convert.ToInt32(this.txtSecond.Text); } }

    }
}
