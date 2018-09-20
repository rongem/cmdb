using RZManager.Objects;
using RZManager.Objects.Assets;
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

namespace RZManager.HardwareWindows.Blades
{
    /// <summary>
    /// Interaction logic for InstallRackMountableWindow.xaml
    /// </summary>
    public partial class BlockEnclosureSlotWindow : Window
    {
        private int slot;
        private BladeEnclosure enclosure;
        private bool internalChange;

        public BlockedUnit BlockedSlot
        {
            get
            {
                return new BlockedUnit()
                {
                    Enclosure = enclosure,
                    Unit = slot,
                    Reason = txtReason.Text.Trim(),
                    ForegroundColor = cpBlockedColor.SelectedColor.ToString(),
                };
            }
        }

        public BlockEnclosureSlotWindow(BladeEnclosure enc, int slot)
        {
            InitializeComponent();

            enclosure = enc;

            this.slot = slot;

            this.Title = string.Format("Belegung in Enclosure {0}", enc.Name);
            lblSlot.Text = string.Format("Enclosure {1}, Slot: {1}", enc.Name, slot);
            this.PreviewKeyDown += new KeyEventHandler(CloseOnEscape);
        }

        private void CloseOnEscape(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Escape)
                this.Close();
        }

        private void btnSave_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtReason.Text))
            {
                txtReason.BorderBrush = Brushes.Red;
                txtReason.BorderThickness = new Thickness(2);
                txtReason.Focus();
                return;
            }
            if (txtReason.Text.Length > 50)
                txtReason.Text = txtReason.Text.Substring(0, 50);
            e.Handled = true;
            this.DialogResult = true;
            this.Close();
        }

    }
}
