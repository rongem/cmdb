using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_AttributeType : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if(!IsPostBack)
        {
            IEnumerable<AttributeType> attributeTypes = MetaDataHandler.GetAttributeTypes();
            if (attributeTypes.Count() > 0)
            {
                divContent.Visible = false;
                lblLocalError.Text = "Es sind keine Attributtypen vorhanden. Bitte legen Sie neue an.";
                lblLocalError.Visible = true;
                return;
            }
            gvAttributeTypes.DataSource = attributeTypes;
            gvAttributeTypes.DataBind();
            gvAttributeTypes_SelectedIndexChanged(null, null);
        }
    }

    protected void gvAttributeTypes_SelectedIndexChanged(object sender, EventArgs e)
    {

    }
}