using CmdbClient.CmsService;
using System.Windows;

namespace CmdbGui
{
    /// <summary>
    /// Interaktionslogik für MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        public MainWindow()
        {
            InitializeComponent();
            UpdatePermissions();
        }

        private void UpdatePermissions()
        {
            using (CmdbClient.DataWrapper wrapper = new CmdbClient.DataWrapper())
            {
                UserRole role = wrapper.GetRoleForUser();
                bool databaseNotEmpty = wrapper.GetItemTypesCount() > 0;
                IsAdminEnabled = role.Equals(UserRole.Administrator);
                IsEditEnabled = role >= UserRole.Editor && databaseNotEmpty;
                IsSearchEnabled = databaseNotEmpty;
            }
            WpfHelper.RefreshControlsBoundProperty(IsEnabledProperty, btnShowAdmin, btnEditItems, btnExportImport, btnShowItems);
        }

        public bool IsAdminEnabled { get; private set; }

        public bool IsSearchEnabled { get; private set; }

        public bool IsEditEnabled { get; private set; }

        #region Buttons

        private void btnShowAdmin_Click(object sender, RoutedEventArgs e)
        {
            new AdminWindow().ShowDialog();
            UpdatePermissions();
        }

        private void btnShowItems_Click(object sender, RoutedEventArgs e)
        {
            new Test().ShowDialog();
            //new CmdbWindow(UserRole.Reader).Show();
        }

        private void btnEditItems_Click(object sender, RoutedEventArgs e)
        {
            //new CmdbWindow(UserRole.Editor).Show();
        }

        private void btnExportImport_Click(object sender, RoutedEventArgs e)
        {
            new ExportImportWindow().ShowDialog();
        }
        #endregion
    }
}
