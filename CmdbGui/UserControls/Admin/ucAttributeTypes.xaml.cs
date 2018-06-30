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

namespace CmdbGui.UserControls.Admin
{
    /// <summary>
    /// Interaktionslogik für ucAttributeTypes.xaml
    /// </summary>
    public partial class ucAttributeTypes : UserControl
    {
        public ucAttributeTypes()
        {
            InitializeComponent();
        }

        private void ucAdminGeneric_ButtonDeleteClicked(object sender, EventArgs e)
        {
            ag.Status = ucAdminGeneric.StatusColor.Yellow;
        }

        private void ucAdminGeneric_ButtonNewClicked(object sender, EventArgs e)
        {
            ag.Status = ucAdminGeneric.StatusColor.Green;
        }

        private void ucAdminGeneric_ButtonRenameClicked(object sender, EventArgs e)
        {
            ag.Status = ucAdminGeneric.StatusColor.Red;
        }

        private void ucAdminGeneric_ButtonExtraClicked(object sender, EventArgs e)
        {

        }
    }
}
