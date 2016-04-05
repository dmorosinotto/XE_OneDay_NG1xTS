using System;
using System.Linq;
using System.Net.Http.Formatting;

using umbraco.BusinessLogic.Actions;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Web.Models.Trees;
using Umbraco.Web.Mvc;
using Umbraco.Web.Trees;
using umbraco.businesslogic;
using umbraco.interfaces;
using xedotnet.website;

[Application("xeCustom", "XE CUSTOM", "icon-presentation", 11)]
class xeCustomApplication : IApplication
{ //DEFINE CUSTOM SECTION IN UMBRACO
}


[PluginController("xeCustom")]
[Umbraco.Web.Trees.Tree("xeCustom", "xeCustomTree", title: "XE Subscriptions", iconClosed: "icon-calendar")]
public class xeCustomTreeController : TreeController
{ //DEFINE NAVIGATION TREE IN UMBRACO
    protected override MenuItemCollection GetMenuForNode(string id, FormDataCollection queryStrings) {
        var menu = new MenuItemCollection();
        menu.DefaultMenuAlias = "barcode";
        menu.Items.Add(new MenuItem("barcode", "Stampa Lista Partecipanti"));
        return menu;
    }

    protected override TreeNodeCollection GetTreeNodes(string id, FormDataCollection queryStrings) {
        var nodes = new TreeNodeCollection();
        if (id == "-1") {
            //FAKE qui dovrei scorrere lista eventi, ma invece creo puntamento a 2 eventi fissati CUSTOM con dati caricati nel DB
            nodes.Add(this.CreateTreeNode("9999|XE Cartoons", "-1", queryStrings, "XE Cartoons", "icon-calendar", false));
            nodes.Add(this.CreateTreeNode("8888|XE Evento|5", "-1", queryStrings, "Evento XE", "icon-calendar", false));
        }
        return nodes;
    }
}
