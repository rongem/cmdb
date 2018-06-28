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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace CmdbGui
{
    /// <summary>
    /// Interaktionslogik für ucNameIdEditor.xaml
    /// </summary>
    public partial class NameIdEditor : Window
    {
        public NameIdEditor(Guid idValue, string nameValue, string windowTitle, string nameLabel)
        {
            InitializeComponent();
            this.Title = windowTitle;
            txtId.Text = idValue.ToString();
            if (!string.IsNullOrEmpty(nameLabel))
                lblName.Text = nameLabel + ":";
            txtName.Text = nameValue;
            txtName.SelectionStart = 0;
            txtName.SelectionLength = nameValue.Length;
            FocusManager.SetFocusedElement(this, txtName);
            this.PreviewKeyDown += new KeyEventHandler(CloseOnEscape);
        }

        private void CloseOnEscape(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Escape)
                this.Close();
        }

        private void btnSave_Click(object sender, RoutedEventArgs e)
        {
            txtName.Text = txtName.Text.Trim();
            e.Handled = true;
            if (string.IsNullOrEmpty(txtName.Text))
            {
                FocusManager.SetFocusedElement(this, txtName);
                return;
            }
            this.DialogResult = true;
            this.Close();
        }

        internal string NameText
        {
            get { return this.txtName.Text; }
        }

        internal string GuidText
        {
            get { return this.txtId.Text; }
        }
    }
}
