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
    /// Interaction logic for MoveAttributeToGroup.xaml
    /// </summary>
    public partial class MoveAttributeToGroupEditor : Window
    {
        public MoveAttributeToGroupEditor(string attributeName, IEnumerable<CmdbClient.CmsService.AttributeGroup> targetAttributeGroups)
        {
            InitializeComponent();
            this.Title = string.Format("Attributtyp {0} in andere Gruppe verschieben", attributeName);
            lstGroups.ItemsSource = targetAttributeGroups;
            lstGroups.SelectedIndex = 0;
            this.PreviewKeyDown += new KeyEventHandler(CloseOnEscape);
        }

        private void CloseOnEscape(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Escape)
                this.Close();
        }

        private void ButtonMove_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
            this.Close();
        }

        public Guid TargetGroupId
        {
            get { return (Guid)lstGroups.SelectedValue; }
        }
    }
}
