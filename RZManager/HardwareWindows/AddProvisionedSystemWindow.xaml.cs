using RZManager.BusinessLogic;
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

namespace RZManager.HardwareWindows
{
    /// <summary>
    /// Interaction logic for AddProvisionedSystemWindow.xaml
    /// </summary>
    public partial class AddProvisionedSystemWindow : Window
    {
        private DataHub hub = DataHub.GetInstance();

        private Asset asset;

        public ProvisionedSystem Server { get; private set; }

        public AddProvisionedSystemWindow(IProvisioningSystem hardware)
        {
            InitializeComponent();

            asset = hardware as Asset;

            lblTargetSystem.Text = string.Format("{0} {1}", asset.TypeName, asset.Name);

        }

        private void btnCreate_Click(object sender, RoutedEventArgs e)
        {
            txtServername.Text = txtServername.Text.Trim();
            txtPurpose.Text = txtPurpose.Text.Trim();
            txtOS.Text = txtOS.Text.Trim();
            txtIP.Text = txtIP.Text.Trim();
            txtRAM.Text = txtRAM.Text.Trim();

            if (string.IsNullOrEmpty(txtServername.Text))
            {
                MessageBox.Show("Es muss ein Servername angegeben werden.");
                txtServername.Focus();
                return;
            }
            if (string.IsNullOrEmpty(txtPurpose.Text))
            {
                MessageBox.Show("Es muss eine Aufgabe angegeben werden.");
                txtPurpose.Focus();
                return;
            }
            if (string.IsNullOrEmpty(txtOS.Text))
            {
                MessageBox.Show("Es muss ein Betriebssystem angegeben werden.");
                txtOS.Focus();
                return;
            }
            if (string.IsNullOrEmpty(txtRAM.Text))
            {
                MessageBox.Show("Der Arbeitsspeicher muss angegeben werden.");
                txtRAM.Focus();
                return;
            }
            string hostname = string.Empty;
            if (!string.IsNullOrEmpty(txtIP.Text))
            {
                System.Net.IPAddress ip;
                if (!System.Net.IPAddress.TryParse(txtIP.Text, out ip))
                {
                    MessageBox.Show("Es muss eine gültige IP-Adresse eingegeben werden, oder das Feld muss frei bleiben.");
                    txtIP.Focus();
                    return;
                }
                try
                {
                    System.Net.IPHostEntry host = System.Net.Dns.GetHostEntry(ip);
                    if (host != null && !string.IsNullOrEmpty(host.HostName))
                        hostname = host.HostName;
                }
                catch { }
            }

            IEnumerable<ProvisionedSystem> ps = hub.GetProvisionedSystems().Where(p => p.Name.Equals(txtServername.Text, StringComparison.CurrentCultureIgnoreCase));
            if (ps.Count() > 0)
            {
                MessageBox.Show("Der Servername ist bereits in Verwendung.");
                txtServername.Focus();
                return;
            }

            string errorMessage;
            ProvisionedSystem server;
            if (!hub.CreateServer(txtServername.Text, txtPurpose.Text, txtOS.Text, txtIP.Text, hostname, valCPUs.Value.ToString(), txtRAM.Text, out errorMessage, out server))
            {
                MessageBox.Show(errorMessage + "\r\nDer Server konnte nicht angelegt werden.\r\nBitte prüfen Sie in assyst, ob der Server vielleicht schon existiert.", "Fehler beim Anlegen", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }
            Server = server;

            this.DialogResult = true;
            this.Close();
        }
    }
}
