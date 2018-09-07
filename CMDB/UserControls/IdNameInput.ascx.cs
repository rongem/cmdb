using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class UserControls_IdNameInput : System.Web.UI.UserControl
{
    public event EventHandler Save;
    public event EventHandler Cancel;

    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void btnOK_Click(object sender, EventArgs e)
    {
        txtName.Text = txtName.Text.Trim();
        if (string.IsNullOrEmpty(txtName.Text) || txtName.Text.Length < 2)
        {
            lblError.Text = "Bitte geben Sie einen Namen ein";
            lblError.Visible = true;
            txtName.Focus();
            return;
        }
        Save(this, new EventArgs());
    }

    protected void btnCancel_Click(object sender, EventArgs e)
    {
        Cancel(this, new EventArgs());
    }

    /// <summary>
    /// Legt den Inhalt der Textboxen fest
    /// </summary>
    /// <param name="guid">Guid-Inhalt</param>
    /// <param name="name">Textinhalt</param>
    public void SetContent(Guid guid, string name)
    {
        txtId.Text = guid.ToString();
        txtName.Text = name;
    }

    /// <summary>
    /// Gibt den Inhalt der Textboxen zurück
    /// </summary>
    /// <param name="guid">Guid-Inhalt</param>
    /// <param name="name">Textinhalt</param>
    public void GetContent(out Guid guid, out string name)
    {
        guid = Guid.Parse(txtId.Text);
        name = txtName.Text;
    }
}