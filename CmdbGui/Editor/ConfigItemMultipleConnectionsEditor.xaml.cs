using CmdbClient.CmsService;
using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace CmdbGui
{
    /// <summary>
    /// Interaktionslogik für ConfigItemMultipleConnectionsEditor.xaml
    /// </summary>
    partial class ConfigItemMultipleConnectionsEditor : Window
    {
        internal ConfigItemMultipleConnectionsEditor(IEnumerable<ConfigurationItem> dt, string WindowTitle)
        {
            InitializeComponent();
            this.Title = WindowTitle;
            foreach (ConfigurationItem r in dt)
            {
                lstCIs.Children.Add(new CheckBox() { Tag = r.ItemId, Content = r.ItemName });
            }
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

        internal Guid[] SelectedValues
        {
            get
            {
                List<Guid> ret = new List<Guid>();
                foreach (CheckBox cb in WpfHelper.GetChildrenOfType<CheckBox>(lstCIs))
                {
                    if (cb.IsChecked == true)
                    {
                        ret.Add((Guid)cb.Tag);
                    }
                }
                return ret.ToArray();
            }
        }
    }
}
