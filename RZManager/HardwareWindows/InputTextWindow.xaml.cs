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

namespace RZManager.HardwareWindows
{
    /// <summary>
    /// Interaction logic for InputTextWindow.xaml
    /// </summary>
    public partial class InputTextWindow : Window
    {
        public InputTextWindow(string title, string explanation)
        {
            InitializeComponent();

            this.Title = title;

            lblExplanation.Text = explanation;

            this.PreviewKeyDown += new KeyEventHandler(CloseOnEscape);
        }

        public string InputText { get { return txtInput.Text; } }

        private void CloseOnEscape(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Escape)
                this.Close();
        }

        private void btnOK_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
            e.Handled = true;
            this.Close();
        }
    }
}
