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
    /// Interaktionslogik für ItemTypeEditor.xaml
    /// </summary>
    public partial class ItemTypeEditor : Window
    {
        private Xceed.Wpf.Toolkit.ColorPicker cpBackground = new Xceed.Wpf.Toolkit.ColorPicker();

        public ItemTypeEditor(Guid idValue, string nameValue, string windowTitle, string nameLabel, string color)
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

            cpBackground.SelectedColorChanged+=cpBackground_SelectedColorChanged;
            cpBackground.Margin = new Thickness(10, 10, 10, 10);
            cpBackground.VerticalAlignment = System.Windows.VerticalAlignment.Center;
            cpBackground.HorizontalAlignment = System.Windows.HorizontalAlignment.Left;
            cpBackground.SelectedColor = (Color)ColorConverter.ConvertFromString(color);
            WpfHelper.placeGridContent(grContent, cpBackground, 2, 1);

        }

        private void cpBackground_SelectedColorChanged(object sender, RoutedPropertyChangedEventArgs<System.Windows.Media.Color?> e)
        {
            System.Diagnostics.Debug.WriteLine(this.Color);
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

        internal string Color
        {
            get
            {
                if (cpBackground.SelectedColor == null)
                    return "#000000";
                StringBuilder sb = new StringBuilder();
                sb.Append("#");
                sb.AppendFormat("{0:x2}", cpBackground.SelectedColor.Value.R);
                sb.AppendFormat("{0:x2}", cpBackground.SelectedColor.Value.G);
                sb.AppendFormat("{0:x2}", cpBackground.SelectedColor.Value.B);
                return sb.ToString().ToUpper();
            }
        }
    }
}
