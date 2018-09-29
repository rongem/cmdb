using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public class AssetConnection
    {
        /// <summary>
        /// Assyst-Id der Verbindung
        /// </summary>
        public Guid id;

        /// <summary>
        /// Erstes Item der Verbindung
        /// </summary>
        public Asset FirstItem;

        /// <summary>
        /// Zweites Item der Verbindung
        /// </summary>
        public Asset SecondItem;

        /// <summary>
        /// Inhalt der Verbindung (Text)
        /// </summary>
        public string Content
        {
            get { return string.Format("{0}: {1}", unit, slot); }
            set
            {
                if (value == null)
                    value = string.Empty;
                if (value.StartsWith("HE:") || value.StartsWith("Slot:"))
                {
                    string[] x = value.Split(':');
                    unit = x[0];
                    Slot = x[1].Trim();
                }
            }
        }

        /// <summary>
        /// assyst-relationTypeId
        /// </summary>
        public Guid ConnectionType;

        /// <summary>
        /// HE oder Slot
        /// </summary>
        private string unit;

        private string slot;

        /// <summary>
        /// Slots oder HEs der Verbindung
        /// </summary>
        public string Slot
        {
            get { return slot; }
            set
            {
                if (!Regex.IsMatch(value, "^[0-9][0-9]?(-[0-9][0-9]?)?$"))
                {
                    slot = "1";
                    MinSlot = 1;
                    MaxSlot = 1;
                    return;
                }
                slot = value;
                if (value.Contains("-"))
                {
                    string[] x = value.Split('-');
                    MinSlot = int.Parse(x[0]);
                    MaxSlot = int.Parse(x[1]);
                    if (MinSlot > MaxSlot)
                        MinSlot = MaxSlot;
                }
                else
                {
                    MinSlot = int.Parse(value);
                    MaxSlot = MinSlot;
                }
            }
        }

        /// <summary>
        /// Untere HE oder kleinster Slot
        /// </summary>
        public int MinSlot { get; private set; }

        /// <summary>
        /// Obere HE oder größter Slot
        /// </summary>
        public int MaxSlot { get; private set; }

        /// <summary>
        /// Prüft, ob der angegebene Slot belegt wird
        /// </summary>
        /// <param name="findSlot">Slot, nach dem gesucht wird</param>
        /// <returns></returns>
        public bool IsInSlot(int findSlot)
        {
            return (findSlot >= MinSlot && findSlot <= MaxSlot);
        }
    }
}
