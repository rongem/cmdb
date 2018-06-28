using System;
using System.Data;
using System.Configuration;
using System.IO;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

namespace CSSFriendly
{
    public abstract class CompositeDataBoundControlAdapter : System.Web.UI.WebControls.Adapters.DataBoundControlAdapter
    {
        private WebControlAdapterExtender _extender = null;
        private WebControlAdapterExtender Extender
        {
            get
            {
                if (((_extender == null) && (Control != null)) ||
                    ((_extender != null) && (Control != _extender.AdaptedControl)))
                {
                    _extender = new WebControlAdapterExtender(Control);
                }

                System.Diagnostics.Debug.Assert(_extender != null, "CSS Friendly adapters internal error", "Null extender instance");
                return _extender;
            }
        }

        protected string _classMain = "";
        protected string _classHeader = "";
        protected string _classData = "";
        protected string _classFooter = "";
        protected string _classPagination = "";
        protected string _classOtherPage = "";
        protected string _classActivePage = "";

        protected CompositeDataBoundControl View
        {
            get { return Control as CompositeDataBoundControl; }
        }

        protected DetailsView ControlAsDetailsView
        {
            get { return Control as DetailsView; }
        }

        protected bool IsDetailsView
        {
            get { return ControlAsDetailsView != null; }
        }

        protected FormView ControlAsFormView
        {
            get { return Control as FormView; }
        }

        protected bool IsFormView
        {
            get { return ControlAsFormView != null; }
        }

        protected abstract string HeaderText { get; }
        protected abstract string FooterText { get; }
        protected abstract ITemplate HeaderTemplate { get; }
        protected abstract ITemplate FooterTemplate { get; }
        protected abstract TableRow HeaderRow { get; }
        protected abstract TableRow FooterRow { get; }
        protected abstract bool AllowPaging { get; }
        protected abstract int DataItemCount { get; }
        protected abstract int DataItemIndex { get; }
        protected abstract PagerSettings PagerSettings { get; }

        /// ///////////////////////////////////////////////////////////////////////////////
        /// METHODS

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            if (Extender.AdapterEnabled)
            {
                RegisterScripts();
            }
        }

        protected override void RenderBeginTag(HtmlTextWriter writer)
        {
            if (Extender.AdapterEnabled)
            {
                Extender.RenderBeginTag(writer, _classMain);
            }
            else
            {
                base.RenderBeginTag(writer);
            }
        }

        protected override void RenderEndTag(HtmlTextWriter writer)
        {
            if (Extender.AdapterEnabled)
            {
                Extender.RenderEndTag(writer);
            }
            else
            {
                base.RenderEndTag(writer);
            }
        }

        protected override void RenderContents(HtmlTextWriter writer)
        {
            if (Extender.AdapterEnabled)
            {
                if (View != null)
                {
                    writer.Indent++;

                    BuildRow(HeaderRow, _classHeader, writer);
                    BuildItem(writer);
                    BuildRow(FooterRow, _classFooter, writer);
                    BuildPaging(writer);

                    writer.Indent--;
                    writer.WriteLine();
                }
            }
            else
            {
                base.RenderContents(writer);
            }
        }

        protected virtual void BuildItem(HtmlTextWriter writer)
        {
        }

        protected virtual void BuildRow(TableRow row, string cssClass, HtmlTextWriter writer)
        {
            if ((row != null) && row.Visible)
            {
                // If there isn't any content, don't render anything.

                bool bHasContent = false;
                TableCell cell = null;
                for (int iCell = 0; iCell < row.Cells.Count; iCell++)
                {
                    cell = row.Cells[iCell];
                    if ((!String.IsNullOrEmpty(cell.Text)) || (cell.Controls.Count > 0))
                    {
                        bHasContent = true;
                        break;
                    }
                }

                if (bHasContent)
                {
                    writer.WriteLine();
                    writer.WriteBeginTag("div");
                    writer.WriteAttribute("class", cssClass);
                    writer.Write(HtmlTextWriter.TagRightChar);
                    writer.Indent++;
                    writer.WriteLine();

                    for (int iCell = 0; iCell < row.Cells.Count; iCell++)
                    {
                        cell = row.Cells[iCell];
                        if (!String.IsNullOrEmpty(cell.Text))
                        {
                            writer.Write(cell.Text);
                        }
                        foreach (Control cellChildControl in cell.Controls)
                        {
                            cellChildControl.RenderControl(writer);
                        }
                    }

                    writer.Indent--;
                    writer.WriteLine();
                    writer.WriteEndTag("div");
                }
            }
        }

        protected virtual void BuildPaging(HtmlTextWriter writer)
        {
            if (AllowPaging && (DataItemCount > 0))
            {
                writer.WriteLine();
                writer.WriteBeginTag("div");
                writer.WriteAttribute("class", _classPagination);
                writer.Write(HtmlTextWriter.TagRightChar);
                writer.Indent++;

                int iStart = 0;
                int iEnd = DataItemCount;
                int nPages = iEnd - iStart + 1;
                bool bExceededPageButtonCount = nPages > PagerSettings.PageButtonCount;

                if (bExceededPageButtonCount)
                {
                    iStart = (DataItemIndex / PagerSettings.PageButtonCount) * PagerSettings.PageButtonCount;
                    iEnd = Math.Min(iStart + PagerSettings.PageButtonCount, DataItemCount);
                }

                writer.WriteLine();

                if (bExceededPageButtonCount && (iStart > 0))
                {
                    writer.WriteBeginTag("a");
                    writer.WriteAttribute("class", _classOtherPage);
                    writer.WriteAttribute("href", Page.ClientScript.GetPostBackClientHyperlink(Control, "Page$" + iStart.ToString(), true));
                    writer.Write(HtmlTextWriter.TagRightChar);
                    writer.Write("...");
                    writer.WriteEndTag("a");
                }

                for (int iDataItem = iStart; iDataItem < iEnd; iDataItem++)
                {
                    string strPage = (iDataItem + 1).ToString();
                    if (DataItemIndex == iDataItem)
                    {
                        writer.WriteBeginTag("span");
                        writer.WriteAttribute("class", _classActivePage);
                        writer.Write(HtmlTextWriter.TagRightChar);
                        writer.Write(strPage);
                        writer.WriteEndTag("span");
                    }
                    else
                    {
                        writer.WriteBeginTag("a");
                        writer.WriteAttribute("class", _classOtherPage);
                        writer.WriteAttribute("href", Page.ClientScript.GetPostBackClientHyperlink(Control, "Page$" + strPage, true));
                        writer.Write(HtmlTextWriter.TagRightChar);
                        writer.Write(strPage);
                        writer.WriteEndTag("a");
                    }
                }

                if (bExceededPageButtonCount && (iEnd < DataItemCount))
                {
                    writer.WriteBeginTag("a");
                    writer.WriteAttribute("class", _classOtherPage);
                    writer.WriteAttribute("href", Page.ClientScript.GetPostBackClientHyperlink(Control, "Page$" + (iEnd + 1).ToString(), true));
                    writer.Write(HtmlTextWriter.TagRightChar);
                    writer.Write("...");
                    writer.WriteEndTag("a");
                }

                writer.Indent--;
                writer.WriteLine();
                writer.WriteEndTag("div");
            }
        }

        protected virtual void RegisterScripts()
        {
        }
    }
}
