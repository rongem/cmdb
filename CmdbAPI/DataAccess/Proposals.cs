using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    /// <summary>
    /// Stellt Datenabfragen für Autocomplete-Vorschläge bereit
    /// </summary>
    public static class Proposals
    {
        /// <summary>
        /// Gibt zu einem gewählten Text die passenden gespeicherten Werte aus Items und Attributen in der Datenbank als Vorschläge zurück
        /// </summary>
        /// <param name="text">Text, nach dem gesucht werden soll</param>
        /// <returns></returns>
        public static CMDBDataSet.Value_ProposalsDataTable GetProposalsForText(string text)
        {
            using (CMDBDataSetTableAdapters.Value_ProposalsTableAdapter proposalsTableAdapter = new CMDBDataSetTableAdapters.Value_ProposalsTableAdapter())
            {
                return proposalsTableAdapter.GetData(text);
            }
        }
    }
}
