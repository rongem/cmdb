using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ContentTable : System.Web.UI.UserControl
{
    private DataTable dt;

    public string Caption { get; set; }

    public string CssClassTable { get; set; }

    public string CssClassCaption { get; set; }

    public string CssClassTHead { get; set; }

    public string CssClassTr { get; set; }

    public string CssClassTh { get; set; }

    public string CssClassTd { get; set; }

    public string[] Headers { get; set; }

    public DataTable Table
    {
        get { return dt; }
        set
        {
            dt = value;
            this.Headers = new string[dt.Columns.Count];
            for (int i = 0; i < dt.Columns.Count; i++)
            {
                this.Headers[i] = dt.Columns[i].Caption;
            }
        }
    }

    protected void Page_Load(object sender, EventArgs e)
    {

    }

    public void AddArray(string[] headers, string[][] array)
    {
        if (headers.Length != array[0].Length)
            throw new ArgumentException("Anzahl der Spalten in den beiden Arrays muss übereinstimmen");
        DataTable t = new DataTable();
        for (int j = 0; j < array[0].Length; j++)
        {
            t.Columns.Add(headers[j]);
        }
        for (int i = 0; i < array.Length; i++)
        {
            t.Rows.Add(array[i]);
        }
        this.Table = t;
    }

    public override void RenderControl(HtmlTextWriter writer)
    {
        base.RenderControl(writer);
        if (this.Table == null || this.Table.Rows.Count == 0)
            return;
        RenderBeginTag(writer);
        RenderContents(writer);
        RenderEndTag(writer);
    }

    protected void RenderBeginTag(HtmlTextWriter writer)
    {
        writer.WriteLine();
        writer.WriteBeginTag("table");
        if (!string.IsNullOrEmpty(CssClassTable))
            writer.WriteAttribute("class", CssClassTable);
        writer.Write(HtmlTextWriter.TagRightChar);
        writer.WriteLine();
        writer.Indent++;
        if (!string.IsNullOrWhiteSpace(this.Caption))
        {
            writer.WriteLine();
            writer.WriteBeginTag("caption");
            if (!string.IsNullOrEmpty(CssClassCaption))
                writer.WriteAttribute("class", CssClassCaption);
            writer.Write(HtmlTextWriter.TagRightChar);
            writer.Write(this.Caption);
            writer.WriteEndTag("caption");
        }
    }

    protected void RenderEndTag(HtmlTextWriter writer)
    {
        writer.WriteLine();
        writer.Indent--;
        writer.WriteEndTag("table");
        writer.WriteLine();
    }

    protected void RenderContents(HtmlTextWriter writer)
    {
        writer.WriteLine();
        writer.WriteBeginTag("thead");
        if (!string.IsNullOrEmpty(CssClassTHead))
            writer.WriteAttribute("class", CssClassTHead);
        writer.Write(HtmlTextWriter.TagRightChar);
        writer.Indent++;
        for (int i = 0; i < this.Headers.Length; i++)
        {
            writer.WriteLine();
            writer.WriteBeginTag("th");
            if (!string.IsNullOrEmpty(CssClassTh))
                writer.WriteAttribute("class", CssClassTh);
            writer.Write(HtmlTextWriter.TagRightChar);
            writer.Write(this.Headers[i]);
            writer.WriteEndTag("th");
        }
        writer.Indent--;
        writer.WriteLine();
        writer.WriteEndTag("thead");
        for (int row = 0; row < this.Table.Rows.Count; row++)
        {
            writer.WriteLine();
            writer.WriteBeginTag("tr");
            if (!string.IsNullOrEmpty(CssClassTr))
                writer.WriteAttribute("class", CssClassTr);
            writer.Write(HtmlTextWriter.TagRightChar);
            writer.Indent++;
            for (int col = 0; col < this.Table.Columns.Count; col++)
            {
                writer.WriteLine();
                writer.WriteBeginTag("td");
                if (!string.IsNullOrEmpty(CssClassTd))
                    writer.WriteAttribute("class", CssClassTd);
                writer.Write(HtmlTextWriter.TagRightChar);
                writer.Write(this.Table.Rows[row][col].ToString());
                writer.WriteEndTag("td");
            }
            writer.Indent--;
            writer.WriteLine();
            writer.WriteEndTag("tr");
        }
    }
}