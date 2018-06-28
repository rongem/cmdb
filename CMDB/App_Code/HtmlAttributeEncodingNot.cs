using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Kodiert Text als HTML-Formularcode
/// </summary>
public class HtmlAttributeEncodingNot : System.Web.Util.HttpEncoder
{
    protected override void HtmlAttributeEncode(string value, System.IO.TextWriter output)
    {
        output.Write(value);
    }
}
