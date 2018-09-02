using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

[ParseChildren(true)]
public partial class UserControls_HelpContent : System.Web.UI.UserControl
{
    private ITemplate _HelpContent;

    [PersistenceMode(PersistenceMode.InnerProperty)]
    public ITemplate HelpContentTemplate
    {
        get { return _HelpContent; }
        set { _HelpContent = value; }
    }

    protected override void OnInit(EventArgs e)
    {
        base.OnInit(e);
        if (_HelpContent != null)
            _HelpContent.InstantiateIn(htmlSpace);
    }

    protected void btnClose_Click(object sender, EventArgs e)
    {
        btnClose.Visible = false;
        divContent.Visible = false;
        btnOpen.Visible = true;
    }

    protected void btnOpen_Click(object sender, EventArgs e)
    {
        btnClose.Visible = true;
        divContent.Visible = true;
        btnOpen.Visible = false;
    }
}