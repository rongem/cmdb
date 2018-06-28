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
    /// Interaktionslogik für LinkEditor.xaml
    /// </summary>
    public partial class LinkEditor : Window
    {
        public LinkEditor(string path, string description, string windowTitle)
        {
            InitializeComponent();
            this.Title = windowTitle;
            this.PreviewKeyDown += new KeyEventHandler(CloseOnEscape);
            txtDescription.Text = description;
            txtDescription.SelectionStart = 0;
            txtDescription.SelectionLength = description.Length;
            txtPathName.Text = this.getFileNameFromPath(path);
            txtPathName.SelectionStart = 0;
            txtPathName.SelectionLength = txtPathName.Text.Length;
            txtPathName.Focus();
        }

        private void CloseOnEscape(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Escape)
                this.Close();
        }

        private string getFileNameFromPath(string path)
        {
            string fileName = path;
            if (fileName.StartsWith("file:"))
            {
                fileName = fileName.Substring(5);
                if (fileName.StartsWith("////"))
                    fileName = fileName.Substring(2);
                fileName = fileName.Replace('/', '\\');
            }
            return fileName;
        }

        private string getPathFromFileName(string fileName)
        {
            string path = fileName.Replace('\\', '/');
            if (!this.checkPrefixes(path, "http", "https", "ftp", "sftp", "ftps", "scp", "afs", "ntp"))
            {
                path = string.Concat("file://", path);
            }
            return path;
        }

        private bool checkPrefixes(string target, params string[] prefix)
        {
            for (int i = 0; i < prefix.Length; i++)
            {
                if (target.StartsWith(prefix[i], StringComparison.InvariantCultureIgnoreCase))
                    return true;
            }
            return false;
        }
        private void btnSave_Click(object sender, RoutedEventArgs e)
        {
            txtPathName.Text = txtPathName.Text.Trim();
            txtDescription.Text = txtDescription.Text.Trim();
            e.Handled = true;
            if (string.IsNullOrEmpty(txtPathName.Text))
            {
                FocusManager.SetFocusedElement(this, txtPathName);
                return;
            }
            if (!this.checkPrefixes(txtPathName.Text, "http", "https", "ftp", "sftp", "ftps", "scp", "afs", "ntp") && !System.IO.File.Exists(txtPathName.Text))
            {
                FocusManager.SetFocusedElement(this, txtPathName);
                return;
            }
            if (string.IsNullOrEmpty(txtDescription.Text))
            {
                FocusManager.SetFocusedElement(this, txtDescription);
                return;
            }
            this.DialogResult = true;
            this.Close();
        }

        internal string Path
        { get { return this.getPathFromFileName(txtPathName.Text); } }

        internal string Description
        { get { return txtDescription.Text; } }

        private void btnOpenDialog_Click(object sender, RoutedEventArgs e)
        {
            Microsoft.Win32.OpenFileDialog dlg = new Microsoft.Win32.OpenFileDialog();
            dlg.CheckPathExists = true;
            dlg.Multiselect = false;
            dlg.CheckFileExists = true;
            if (!this.checkPrefixes(txtPathName.Text, "http", "https", "ftp", "sftp", "ftps", "scp", "afs", "ntp"))
            {
                if (System.IO.Directory.Exists(txtPathName.Text))
                {
                    dlg.InitialDirectory = txtPathName.Text;
                }
                else if (System.IO.File.Exists(txtPathName.Text))
                {
                    dlg.InitialDirectory = System.IO.Path.GetDirectoryName(txtPathName.Text);
                }
                else
                {
                    try
                    {
                        dlg.InitialDirectory = System.IO.Path.GetDirectoryName(System.IO.Path.GetFullPath(txtPathName.Text));
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                    }
                }
            }
            if (dlg.ShowDialog() == true)
            {
                txtPathName.Text = dlg.FileName;
            }
        }
    }
}
