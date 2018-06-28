using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class HierarchicalGrid : System.Web.UI.UserControl
{
    public TreeNodeCollection Nodes = new TreeNodeCollection();

    public string Caption;

    protected void Page_Load(object sender, EventArgs e)
    {

    }

    public override void RenderControl(HtmlTextWriter writer)
    {
        base.RenderControl(writer);
        if (this.Nodes == null || this.Nodes.Count == 0)
            return;
        RenderCaption(writer);
        RenderContents(writer, Nodes);
    }

    protected void RenderCaption(HtmlTextWriter writer)
    {
        if (!string.IsNullOrWhiteSpace(this.Caption))
        {
            writer.WriteLine();
            writer.WriteBeginTag("h2");
            writer.Write(HtmlTextWriter.TagRightChar);
            writer.Write(this.Caption);
            writer.WriteEndTag("h2");
        }
    }

    protected void RenderContents(HtmlTextWriter writer, TreeNodeCollection nodes)
    {
        writer.WriteLine();
        writer.WriteBeginTag("div");
        writer.WriteAttribute("class", "hierarchicaltable");
        writer.Write(HtmlTextWriter.TagRightChar);
        writer.Indent++;
        writer.WriteLine();
        foreach(TreeNode tn in nodes)
        {
            writer.WriteLine();
            writer.WriteBeginTag("div");
            writer.WriteAttribute("class", "tr");
            writer.Write(HtmlTextWriter.TagRightChar);
            writer.Indent++;
            writer.WriteLine();
            writer.WriteBeginTag("div");
            writer.WriteAttribute("class", "td");
            writer.Write(HtmlTextWriter.TagRightChar);
            if (!string.IsNullOrWhiteSpace(tn.NavigateUrl))
            {
                writer.WriteBeginTag("a");
                writer.WriteAttribute("class", tn.NavigateUrl.StartsWith("~/") ? "intern" : "extern");
                writer.WriteAttribute("href", tn.NavigateUrl.StartsWith("~/") ? VirtualPathUtility.ToAbsolute(tn.NavigateUrl) : tn.NavigateUrl);
                writer.Write(HtmlTextWriter.TagRightChar);
            }
            if (!string.IsNullOrWhiteSpace(tn.ImageUrl))
            {
                writer.WriteBeginTag("img");
                writer.WriteAttribute("src", tn.NavigateUrl);
                if (!string.IsNullOrWhiteSpace(tn.ImageToolTip))
                    writer.WriteAttribute("alt", tn.ImageToolTip);
                writer.Write(HtmlTextWriter.TagRightChar);

            }
            writer.Write(tn.Text);
            if (!string.IsNullOrWhiteSpace(tn.NavigateUrl))
                writer.WriteEndTag("a");
            if (tn.ChildNodes != null && tn.ChildNodes.Count > 0)
                RenderContents(writer, tn.ChildNodes);
            writer.WriteEndTag("div");
            writer.Indent--;
            writer.WriteLine();
            writer.WriteEndTag("div");
        }
        writer.WriteLine();
        writer.Indent--;
        writer.WriteEndTag("div");
        writer.WriteLine();
    }

}