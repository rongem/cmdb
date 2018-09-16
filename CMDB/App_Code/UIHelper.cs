using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;

/// <summary>
/// Zusammenfassungsbeschreibung für UIHelper
/// </summary>
public static class UIHelper
{
    /// <summary>
    /// Liefert alle Kindelemente rekursiv zurück
    /// </summary>
    /// <param name="parent">Control, ab dem gesucht wird</param>
    /// <returns></returns>
    public static IEnumerable<Control> GetAllControls(Control parent)
    {
        foreach (Control control in parent.Controls)
        {
            yield return control;
            foreach (Control descendant in GetAllControls(control))
            {
                yield return descendant;
            }
        }
    }

}