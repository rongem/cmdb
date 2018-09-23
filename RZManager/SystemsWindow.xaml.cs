using RZManager.BusinessLogic;
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

namespace RZManager
{
    /// <summary>
    /// Interaction logic for SystemsWindow.xaml
    /// </summary>
    public partial class SystemsWindow : Window
    {
        private System.Collections.ObjectModel.ObservableCollection<SystemSelector.CmdbSystem> systems;

        private SystemSelector.CmdbSystem editedSystem = null;

        /// <summary>
        /// Konstruktor
        /// </summary>
        /// <param name="chooseButtonVisible">Gibt an, ob eine Auswahl möglich ist</param>
        public SystemsWindow(bool chooseButtonVisible)
        {
            InitializeComponent();

            MakeChooseVisibile(true);

            RefreshSystemsList();

            btnOk.Visibility = chooseButtonVisible ? Visibility.Visible : Visibility.Collapsed;
            btnQuit.Content = chooseButtonVisible ? "Abbrechen" : "Schließen";
        }

        /// <summary>
        /// Liest die Konfiguration aus und stellt sie als Liste dar
        /// </summary>
        private void RefreshSystemsList()
        {
            lstSystems.ItemsSource = null;
            systems = new System.Collections.ObjectModel.ObservableCollection<SystemSelector.CmdbSystem>(SystemSelector.GetConfiguredSystems());
            lstSystems.ItemsSource = systems;

            if (systems.Count > 0)
                lstSystems.SelectedIndex = 0;
            else
                btnAdd_Click(null, null);
        }

        /// <summary>
        /// Gibt das ausgewählte System zurück
        /// </summary>
        public SystemSelector.CmdbSystem SelectedSystem { get { return lstSystems.SelectedValue as SystemSelector.CmdbSystem; } }

        /// <summary>
        /// Sorgt dafür, dass das Auswahlfenster sichtbar und das Editorfenster unsichtbar ist, wenn true eingegeben wird, ansonsten umgekehrt
        /// </summary>
        /// <param name="val">True, wenn ausgewählt werden soll, false wenn editiert werden soll</param>
        private void MakeChooseVisibile(bool val)
        {
            spChoose.Visibility = val ? Visibility.Visible : Visibility.Collapsed;
            spEdit.Visibility = val ? Visibility.Collapsed : Visibility.Visible;
        }

        private void lstSystems_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            btnOk.IsEnabled = lstSystems.Items.Count > 0;
            btnDelete.IsEnabled = btnOk.IsEnabled;
            btnChange.IsEnabled = btnOk.IsEnabled;
        }

        private void lstSystems_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            btnOK_Click(sender, null);
        }

        private void btnOK_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
            this.Close();
        }

        private void btnDel_Click(object sender, RoutedEventArgs e)
        {
            if (MessageBox.Show("Sind Sie sicher, dass Sie das System löschen wollen?", "Sicherheitsprüfung", MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.Yes)
            {
                systems.Remove(lstSystems.SelectedItem as SystemSelector.CmdbSystem);
                SystemSelector.WriteConfiguredSystems(systems);
            }
        }

        private void btnChange_Click(object sender, RoutedEventArgs e)
        {
            MakeChooseVisibile(false);
            editedSystem = lstSystems.SelectedItem as SystemSelector.CmdbSystem;
            txtName.Text = editedSystem.Name;
            txtUrl.Text = editedSystem.Uri.ToString();
        }

        private void btnAdd_Click(object sender, RoutedEventArgs e)
        {
            MakeChooseVisibile(false);
            editedSystem = null;
            btnCancelSave.IsEnabled = lstSystems.Items.Count > 0;
            txtName.Text = string.Empty;
            txtUrl.Text = string.Empty;
            txtUser.Text = string.Empty;
            txtPassword.Password = string.Empty;
        }

        private void btnSave_Click(object sender, RoutedEventArgs e)
        {
            txtName.Text = txtName.Text.Trim();
            txtUrl.Text = txtUrl.Text.Trim();
            txtUser.Text = txtUser.Text.Trim();
            if (string.IsNullOrEmpty(txtName.Text))
            {
                txtName.Focus();
                MessageBox.Show("Die Bezeichnung darf nicht leer bleiben.");
                return;
            }
            if (string.IsNullOrEmpty(txtUrl.Text))
            {
                txtUrl.Focus();
                MessageBox.Show("Die URL darf nicht leer bleiben.");
                return;
            }
            Uri uri;
            if (!Uri.TryCreate(txtUrl.Text, UriKind.Absolute, out uri))
            {
                txtUrl.Focus();
                MessageBox.Show("Die URL entspricht keinem gültigen Format.");
                return;
            }
            SystemSelector.CmdbSystem system = new SystemSelector.CmdbSystem()
            {
                Name = txtName.Text,
                Uri = uri,
            };
            if (!SystemSelector.TryAssystSystemValues(system))
            {
                MessageBox.Show("Die angegebene Konfiguration funktioniert nicht. Bitte korrigieren.", "Fehler bei der Verbindung", MessageBoxButton.OK, MessageBoxImage.Error);
                txtUrl.Focus();
                return;
            }
            if (editedSystem != null)
            {
                systems.Remove(editedSystem);
                editedSystem = null;
            }
            systems.Add(system);
            SystemSelector.WriteConfiguredSystems(systems);
            RefreshSystemsList();
            MakeChooseVisibile(true);
        }

        private void btnCancelSave_Click(object sender, RoutedEventArgs e)
        {
            MakeChooseVisibile(true);
            editedSystem = null;
        }
    }
}
