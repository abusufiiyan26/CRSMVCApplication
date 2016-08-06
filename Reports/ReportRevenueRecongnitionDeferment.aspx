<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ReportRevenueRecongnitionDeferment.aspx.cs" Inherits="OneCRS.MVC.Reports.ReportRevenueRecongnitionDeferment" %>


<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91"
    Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:ScriptManager ID="ScriptManager1" runat="server">
            </asp:ScriptManager>
            <center>
                <asp:UpdatePanel runat="server" ID="upnltab" UpdateMode="Conditional">
                    <ContentTemplate>
                        <table style="width: 100%" cellpadding="0" cellspacing="0">
                            <tr align="left">
                                <td>
                                    <rsweb:ReportViewer BackColor="AliceBlue" ID="RptViewer" runat="server" AsyncRendering="false" PageCountMode="Actual" Width="100%" Height="680px" />
                                </td>
                            </tr>
                            <tr align="center" style="margin-left: 600px">
                                <td colspan="2">
                                    <asp:Panel ID="Panel1" runat="server">
                                        <asp:UpdateProgress runat="server" ID="UpdateProgress2" AssociatedUpdatePanelID="upnltab"
                                            DynamicLayout="true">
                                            <ProgressTemplate>
                                                <img alt="please wait" src="../Images/Progress.gif" />
                                            </ProgressTemplate>
                                        </asp:UpdateProgress>
                                    </asp:Panel>
                                </td>
                            </tr>
                        </table>
                    </ContentTemplate>
                </asp:UpdatePanel>

            </center>
        </div>
    </form>
</body>
</html>
