using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.BusinessLogic
{
    public static class WinHelper
    {
        public static void StartProcessInBackground(string filename)
        {
            IntPtr handle = Process.GetCurrentProcess().MainWindowHandle;
            Process process = StartProcess(filename);
            process.WaitForInputIdle();
            SetForegroundWindow(handle.ToInt32());
        }

        public static Process StartProcess(string filename)
        {
            string arguments = string.Empty;
            if (filename.StartsWith("http", StringComparison.CurrentCultureIgnoreCase))
            {
                Uri uri;
                if (Uri.TryCreate(filename, UriKind.Absolute, out uri))
                {
                    arguments = uri.AbsoluteUri;
                    filename = GetSystemDefaultBrowser();
                }
            }
            return Process.Start(filename, arguments);
        }

        [DllImport("User32.dll")]
        public static extern Int32 SetForegroundWindow(int hWnd);

        private static string GetSystemDefaultBrowser()
        {
            string name = string.Empty;
            Microsoft.Win32.RegistryKey regKey = null;

            try
            {
                //set the registry key we want to open
                regKey = Microsoft.Win32.Registry.ClassesRoot.OpenSubKey("HTTP\\shell\\open\\command", false);

                //get rid of the enclosing quotes
                name = regKey.GetValue(null).ToString().ToLower().Replace("" + (char)34, "");

                //check to see if the value ends with .exe (this way we can remove any command line arguments)
                if (!name.EndsWith("exe"))
                    //get rid of all command line arguments (anything after the .exe must go)
                    name = name.Substring(0, name.LastIndexOf(".exe") + 4);

            }
            catch (Exception ex)
            {
                name = string.Format("ERROR: An exception of type: {0} occurred in method: {1} in the following module: {2}", ex.GetType(), ex.TargetSite, ex.Message);
            }
            finally
            {
                //check and see if the key is still open, if so
                //then close it
                if (regKey != null)
                    regKey.Close();
            }
            //return the value
            return name;

        }
    }
}
