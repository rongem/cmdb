using CmdbClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace CmdbGui
{
    /// <summary>
    /// Interaktionslogik für "App.xaml"
    /// </summary>
    public partial class App : Application
    {
        private void Application_Startup(object sender, StartupEventArgs e)
        {
            if (e.Args.Length == 0)
            {
                //new CmdbWindow(UserRole.Reader).Show();
            }
            else
            {
                switch (e.Args[0].ToLower())
                {
                    case "/admin":
                        new AdminWindow().Show();
                        break;
                    case "/edit":
                        //new CmdbWindow(UserRole.Editor).Show();
                        break;
                    case "/choose":
                        new MainWindow().Show();
                        break;
                    case "/export":
                    case "/import":
                        new ExportImportWindow().Show();
                        break;
                    default:
                        //new CmdbWindow(UserRole.Reader).Show();
                        break;
                }
            }
        }
    }
}
