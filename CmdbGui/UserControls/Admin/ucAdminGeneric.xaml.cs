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
    /// Interaktionslogik für ucAdminGeneric.xaml
    /// </summary>
    public partial class ucAdminGeneric : UserControl
    {
        /// <summary>
        /// Tritt auf, wenn der Button zum Erzeugen eines neuen Elements geklickt wurde
        /// </summary>
        public event EventHandler<EventArgs> SetButtonNewClicked;

        /// <summary>
        /// Tritt auf, wenn der Button zum Umbenennen eines Elements geklickt wurde
        /// </summary>
        public event EventHandler<EventArgs> SetButtonRenameClicked;

        /// <summary>
        /// Tritt auf, wenn der Button zum Löschen eines Elements geklickt wurde
        /// </summary>
        public event EventHandler<EventArgs> SetButtonDeleteClicked;

        /// <summary>
        /// Tritt auf, wenn der zusätzliche Button geklickt wurde
        /// </summary>
        public event EventHandler<EventArgs> SetButtonExtraClicked;

        /// <summary>
        /// Textinhalt des Extra-Buttons. Ist der Textinhalt leer, bleibt der Button unsichtbar
        /// </summary>
        public string ExtraButtonContent
        {
            get { return btnExtra.Content.ToString(); }
            set
            {
                btnExtra.Content = value;
                btnExtra.Visibility = string.IsNullOrWhiteSpace(value) ? Visibility.Collapsed : Visibility.Visible;
            }
        }

        public ucAdminGeneric()
        {
            InitializeComponent();
            btnNew.Click += OnButtonNewClicked;
        }

        private void lstTypes_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {

            if (lstTypes.SelectedItems.Count > 1)
                return;
            if (e.OriginalSource.GetType() == typeof(ScrollViewer))
            {
                OnButtonNewClicked(sender, e);
            }
            else
            {
                if (lstTypes.SelectedItem != null)
                {
                    OnButtonRenameClicked(sender, e);
                }
            }
        }

        private void lstTypes_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.Key)
            {
                case Key.Delete: // Löschen
                    if (lstTypes.SelectedValue == null || btnDelete.IsEnabled == false)
                        return;
                    OnButtonDeleteClicked(sender, e);
                    break;
                case Key.F2: // Umbenennen = Editieren
                    OnButtonRenameClicked(sender, e);
                    break;
            }
        }

        private void btnCopyIdToClipBoard_Click(object sender, RoutedEventArgs e)
        {
             Clipboard.SetText(lstTypes.SelectedValue.ToString());
        }

        protected virtual void OnButtonNewClicked(object sender, RoutedEventArgs e)
        {
            SetButtonNewClicked?.Invoke(sender, EventArgs.Empty);
        }

        protected virtual void OnButtonRenameClicked(object sender, RoutedEventArgs e)
        {
            SetButtonRenameClicked?.Invoke(sender, EventArgs.Empty);
        }

        protected virtual void OnButtonDeleteClicked(object sender, RoutedEventArgs e)
        {
            SetButtonDeleteClicked?.Invoke(sender, EventArgs.Empty);
        }

        protected virtual void OnButtonExtraClicked(object sender, RoutedEventArgs e)
        {
            SetButtonExtraClicked?.Invoke(sender, EventArgs.Empty);
        }


    }
}
