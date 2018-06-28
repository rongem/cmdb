using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Input;

namespace CmdbGui
{
    /// <summary>
    /// Interaktionslogik für ConfigItemListEditor.xaml
    /// </summary>
    public partial class ConfigItemListEditor : Window
    {
        internal ConfigItemListEditor(IEnumerable<CmdbClient.CmsService.ConfigurationItem> dt, string WindowTitle)
        {
            InitializeComponent();
            lstCIs.ItemsSource = dt;
            this.Title = WindowTitle;
            this.PreviewKeyDown += new KeyEventHandler(CloseOnEscape);
        }

        private void CloseOnEscape(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Escape)
                this.Close();
        }

        private void btnSave_Click(object sender, RoutedEventArgs e)
        {
            e.Handled = true;
            this.DialogResult = true;
            this.Close();
        }

        internal Guid SelectedValue
        {
            get { return (Guid)lstCIs.SelectedValue; }
        }
    }
}
