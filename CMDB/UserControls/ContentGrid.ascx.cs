using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ContentGrid : System.Web.UI.UserControl
{
    private DataTable dt;
    private string[] headers;
    private string caption;

    public string Caption
    {
        get { return caption; }
        set { caption = value; }
    }

    public string[] Headers
    {
        get { return headers; }
        set { headers = value; }
    }

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
        if (!string.IsNullOrWhiteSpace(this.Caption))
        {
            writer.WriteLine();
            writer.WriteBeginTag("h2");
            writer.Write(HtmlTextWriter.TagRightChar);
            writer.Write(this.Caption);
            writer.WriteEndTag("h2");
        }
        writer.WriteLine();
        writer.WriteBeginTag("div");
        writer.WriteAttribute("class", "table");
        writer.Write(HtmlTextWriter.TagRightChar);
        writer.Indent++;
    }

    protected void RenderEndTag(HtmlTextWriter writer)
    {
        writer.WriteLine();
        writer.Indent--;
        writer.WriteEndTag("div");
        writer.WriteLine();
    }

    protected void RenderContents(HtmlTextWriter writer)
    {
        writer.WriteLine();
        writer.WriteBeginTag("div");
        writer.WriteAttribute("class", "tr");
        writer.Write(HtmlTextWriter.TagRightChar);
        writer.Indent++;
        for (int i = 0; i < this.Headers.Length; i++)
        {
            writer.WriteLine();
            writer.WriteBeginTag("div");
            writer.WriteAttribute("class", "th");
            writer.Write(HtmlTextWriter.TagRightChar);
            writer.Write(this.Headers[i]);
            writer.WriteEndTag("div");
        }
        writer.Indent--;
        writer.WriteLine();
        writer.WriteEndTag("div");
        for (int row = 0; row < this.Table.Rows.Count; row++)
        {
            writer.WriteLine();
            writer.WriteBeginTag("div");
            writer.WriteAttribute("class", "tr");
            writer.Write(HtmlTextWriter.TagRightChar);
            writer.Indent++;
            for (int col = 0; col < this.Table.Columns.Count; col++)
            {
                writer.WriteLine();
                writer.WriteBeginTag("div");
                writer.WriteAttribute("class", "td");
                writer.Write(HtmlTextWriter.TagRightChar);
                writer.Write(this.Table.Rows[row][col].ToString());
                writer.WriteEndTag("div");
            }
            writer.Indent--;
            writer.WriteLine();
            writer.WriteEndTag("div");
        }
    }
}