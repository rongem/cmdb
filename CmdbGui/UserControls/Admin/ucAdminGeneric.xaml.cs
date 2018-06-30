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
    [System.Windows.Markup.ContentProperty("AdditionalContent")]
    public partial class ucAdminGeneric : UserControl
    {
        /// <summary>
        /// Statusfarben
        /// </summary>
        public enum StatusColor
        {
            Green,
            Yellow,
            Red,
            Gray,
        }

        #region EventHandler

        /// <summary>
        /// Tritt auf, wenn der Button zum Erzeugen eines neuen Elements geklickt wurde
        /// </summary>
        public event EventHandler<EventArgs> ButtonNewClicked;

        /// <summary>
        /// Tritt auf, wenn der Button zum Umbenennen eines Elements geklickt wurde
        /// </summary>
        public event EventHandler<EventArgs> ButtonRenameClicked;

        /// <summary>
        /// Tritt auf, wenn der Button zum Löschen eines Elements geklickt wurde
        /// </summary>
        public event EventHandler<EventArgs> ButtonDeleteClicked;

        /// <summary>
        /// Tritt auf, wenn der zusätzliche Button geklickt wurde
        /// </summary>
        public event EventHandler<EventArgs> ButtonExtraClicked;

        /// <summary>
        /// Tritt auf, wenn sich die Auswahl im Listenfeld geändert hat
        /// </summary>
        public event SelectionChangedEventHandler ListSelectionChanged;

        #endregion

        #region Properties

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

        /// <summary>
        /// Gibt einen zusätzlichen Container frei, in dem Inhalte platziert werden können
        /// </summary>
        public object AdditionalContent
        {
            get { return GetValue(AdditionalContentProperty); }
            set { SetValue(AdditionalContentProperty, value); }
        }

        public static readonly DependencyProperty AdditionalContentProperty =
            DependencyProperty.Register("AdditionalContent", typeof(object), typeof(ucAdminGeneric),
                new PropertyMetadata(null));

        /// <summary>
        /// Liefert die gewählte Guid zurück
        /// </summary>
        public Guid? SelectedId { get { return lstTypes.SelectedValue as Guid?; } }

        private StatusColor status;

        /// <summary>
        /// Gibt die Farbe des kleinen Punkts unten links an
        /// </summary>
        public StatusColor Status
        {
            get { return status; }
            set
            {
                status = value;
                switch (value)
                {
                    case StatusColor.Green:
                        circleStatus.Fill = new RadialGradientBrush(Colors.Green, Colors.ForestGreen);
                        lblStatus.Text = "Bereit";
                        break;
                    case StatusColor.Red:
                        circleStatus.Fill = Brushes.Red;
                        lblStatus.Text = "Fehler";
                        break;
                    case StatusColor.Yellow:
                        circleStatus.Fill = Brushes.Yellow;
                        lblStatus.Text = "Arbeite...";
                        break;
                    default:
                        circleStatus.Fill = Brushes.DarkGray;
                        lblStatus.Text = string.Empty;
                        break;
                }
            }
        }

        #endregion

        public ucAdminGeneric()
        {
            InitializeComponent();
            Status = StatusColor.Gray;
        }

        #region Interne Funktionen zum Umgang mit den Events

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
            if (lstTypes.SelectedValue == null)
                return;
            Clipboard.SetText(lstTypes.SelectedValue.ToString());
        }

        protected virtual void OnButtonNewClicked(object sender, RoutedEventArgs e)
        {
            ButtonNewClicked?.Invoke(sender, EventArgs.Empty);
        }

        protected virtual void OnButtonRenameClicked(object sender, RoutedEventArgs e)
        {
            ButtonRenameClicked?.Invoke(sender, EventArgs.Empty);
        }

        protected virtual void OnButtonDeleteClicked(object sender, RoutedEventArgs e)
        {
            ButtonDeleteClicked?.Invoke(sender, EventArgs.Empty);
        }

        protected virtual void OnButtonExtraClicked(object sender, RoutedEventArgs e)
        {
            ButtonExtraClicked?.Invoke(sender, EventArgs.Empty);
        }

        protected virtual void OnListSelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            ListSelectionChanged?.Invoke(sender, e);
        }

        #endregion

    }
}
