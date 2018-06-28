using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI
{
    /// <summary>
    /// Interne Klasse zum Messen von Laufzeiten beim Datenzugriff
    /// </summary>
    public class Timer
    {
        private DateTime start;

        private DateTime end;

        public Timer() : this(false)
        { }

        public Timer(bool startImmediate)
        {
            start = DateTime.Now;
        }

        public void Start()
        {
            start = DateTime.Now;
        }

        public double Stop()
        {
            end = DateTime.Now;
            return end.Subtract(start).TotalMilliseconds;
        }

        public double Restart()
        {
            end = DateTime.Now;
            double ret = end.Subtract(start).TotalMilliseconds;
            start = end;
            return ret;
        }
    }
}
