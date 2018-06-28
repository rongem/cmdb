using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

/// <summary>
/// Schreibt Aufzählungen (ul-Tags in HTML) auf eine bestimmte Weise, so dass sie mit dem CSS-Design funktionieren
/// </summary>
public class BulletedListControlAdapter : System.Web.UI.WebControls.Adapters.WebControlAdapter
{
    public BulletedListControlAdapter()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    protected override void RenderBeginTag(HtmlTextWriter writer)
    {
        writer.WriteLine();
        writer.WriteBeginTag("ul");
        if (!string.IsNullOrEmpty(this.Control.CssClass))
            writer.WriteAttribute("class", this.Control.CssClass);
        writer.Write(HtmlTextWriter.TagRightChar);
        writer.Indent++;
    }

    protected override void RenderEndTag(HtmlTextWriter writer)
    {
        writer.WriteEndTag("ul");
        writer.Indent--;
        writer.WriteLine();
    }

    protected override void RenderContents(HtmlTextWriter writer)
    {
        writer.Indent++;
        BulletedList bl = Control as BulletedList;
        if (bl != null)
        {
            foreach (ListItem i in bl.Items)
            {
                writer.WriteBeginTag("li");
                writer.Write(HtmlTextWriter.TagRightChar);
                if (!string.IsNullOrWhiteSpace(i.Value))
                {
                    writer.WriteBeginTag("a");
                    writer.WriteAttribute("class", i.Value.StartsWith("~/") ? "intern" : "extern");
                    writer.WriteAttribute("href", i.Value.StartsWith("~/") ? VirtualPathUtility.ToAbsolute(i.Value) : i.Value);
                    if (!string.IsNullOrWhiteSpace(bl.Target))
                        writer.WriteAttribute("target", bl.Target);
                    writer.Write(HtmlTextWriter.TagRightChar);
                }
                writer.Write(i.Text);
                if (!string.IsNullOrWhiteSpace(i.Value))
                    writer.WriteEndTag("a");
                writer.WriteEndTag("li");
                writer.WriteLine();
            }
        } 
        writer.Indent--;
    }
}