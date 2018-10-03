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

namespace RZManager.HardwareWindows.Racks
{
    /// <summary>
    /// Interaction logic for InstallRackMountableWindow.xaml
    /// </summary>
    public partial class BlockRackUnitWindow : Window
    {
        private int LowerBoundary, UpperBoundary, currentHeightUnit, totalHeightUnits;
        private bool internalChange;

        private Rack rack;

        public int TotalHeightUnits
        {
            get { return totalHeightUnits; }
            private set
            {
                internalChange = true;
                if (value > UpperBoundary - CurrentHeightUnit + 1)
                    value = UpperBoundary - CurrentHeightUnit + 1;
                if (value < 1)
                    value = 1;
                totalHeightUnits = value;
                if (!valHeightUnits.Value.Equals(totalHeightUnits))
                    valHeightUnits.Value = totalHeightUnits;
                SetSlider();
                internalChange = false;
            }
        }

        public int CurrentHeightUnit
        {
            get { return currentHeightUnit; }
            private set
            {
                internalChange = true;
                if (value + TotalHeightUnits > UpperBoundary + 1)
                    value = UpperBoundary + 1 - TotalHeightUnits;
                if (value < LowerBoundary)
                    value = LowerBoundary;
                currentHeightUnit = value;
                if (!valBuildIntoUnit.Value.Equals(currentHeightUnit))
                    valBuildIntoUnit.Value = currentHeightUnit;
                SetSlider();
                internalChange = false;
            }
        }

        public IEnumerable<BlockedUnit> BlockedUnits
        {
            get
            {
                for (int i = 0; i < valHeightUnits.Value; i++)
                {
                    yield return new BlockedUnit()
                    {
                        Rack = rack,
                        Reason = txtReason.Text.Trim(),
                        Unit = (int)valBuildIntoUnit.Value + i,
                        ForegroundColor = cpBlockedColor.CurrentColor.ToString(),
                    };
                }
            }
        }

        public BlockRackUnitWindow(Rack rack, int heightUnit, int lowerBoundary, int upperBoundary)
        {
            InitializeComponent();

            for (int i = 0; i < rack.MaxHeight; i++)
            {
                grdRack.RowDefinitions.Add(new RowDefinition());
            }

            LowerBoundary = lowerBoundary;
            UpperBoundary = upperBoundary;
            CurrentHeightUnit = heightUnit;

            this.rack = rack;

            this.Title = string.Format("Belegung in Rack {0}", rack.Name);
            lblRoom.Text = string.Format("Freier Bereich: HE {0} - HE {1}", lowerBoundary, upperBoundary);
            SetSlider();
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

        private void sliderHeight_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            if (internalChange || valBuildIntoUnit == null)
                return;
            if (!valBuildIntoUnit.Value.Equals(sliderHeight.Value))
                valBuildIntoUnit.Value = (int)sliderHeight.Value;
        }

        private void valHeightUnits_ValueChanged(object sender, Gu.Wpf.NumericInput.ValueChangedEventArgs<int?> e)
        {
            if (internalChange)
                return;
            TotalHeightUnits = (int)valHeightUnits.Value;
        }

        private void valBuildIntoUnit_ValueChanged(object sender, Gu.Wpf.NumericInput.ValueChangedEventArgs<int?> e)
        {
            if (internalChange)
                return;
            CurrentHeightUnit = (int)valBuildIntoUnit.Value;
        }

        private void SetSlider()
        {
            sliderHeight.Maximum = UpperBoundary + 1 - TotalHeightUnits;
            sliderHeight.Value = CurrentHeightUnit;
            sliderHeight.Minimum = LowerBoundary;
            valHeightUnits.MaxValue = UpperBoundary + 1 - TotalHeightUnits;

            valHeightUnits.MaxValue = UpperBoundary + 1 - TotalHeightUnits;

            if (valBuildIntoUnit != null)
            {
                valBuildIntoUnit.MinValue = LowerBoundary;
                valBuildIntoUnit.MaxValue = UpperBoundary + 1 - TotalHeightUnits;
            }

            if (grdRack.RowDefinitions.Count() > 0)
            {
                Grid.SetRow(sliderHeight, grdRack.RowDefinitions.Count() - UpperBoundary + TotalHeightUnits - 1);
                Grid.SetRowSpan(sliderHeight, UpperBoundary - LowerBoundary + 2 - TotalHeightUnits);
            }
        }
    }
}
