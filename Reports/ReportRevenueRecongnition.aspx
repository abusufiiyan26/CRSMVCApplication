<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ReportRevenueRecongnition.aspx.cs" Inherits="OneCRS.MVC.Reports.ReportRevenueRecongnition" %>

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
        <div style="background-color: #006699">
            <table style="width: 100%" cellpadding="2" cellspacing="2">
                <tr>
                    <td>
                        <asp:Panel ID="Panel1" runat="server" GroupingText="Select Date:" ForeColor="White">
                            <table style="width: 100%">
                                <tr>
                                    <td align="right" style="width: 100%; height: 28px;">
                                        <table style="width: 100%">
                                            <tr>
                                                <td align="right">
                                                    <asp:Label ID="Label1" runat="server" Text="Month:"></asp:Label>
                                                    <asp:Label ID="lblMandr" runat="server" Text="*" ForeColor="Red"></asp:Label>

                                                </td>
                                                <td align="left">
                                                    <asp:DropDownList ID="ddlMonth" runat="server" AutoPostBack="false" Width="174px"
                                                        ErrorMessage="Please Select Month" CssClass="font">
                                                        <asp:ListItem Value="0">Select Month</asp:ListItem>
                                                        <asp:ListItem Value="1">JAN</asp:ListItem>
                                                        <asp:ListItem Value="2">FEB</asp:ListItem>
                                                        <asp:ListItem Value="3">MAR</asp:ListItem>
                                                        <asp:ListItem Value="4">APR</asp:ListItem>
                                                        <asp:ListItem Value="5">MAY</asp:ListItem>
                                                        <asp:ListItem Value="6">JUN</asp:ListItem>
                                                        <asp:ListItem Value="7">JUL</asp:ListItem>
                                                        <asp:ListItem Value="8">AUG</asp:ListItem>
                                                        <asp:ListItem Value="9">SEP</asp:ListItem>
                                                        <asp:ListItem Value="10">OCT</asp:ListItem>
                                                        <asp:ListItem Value="11">NOV</asp:ListItem>
                                                        <asp:ListItem Value="12">DEC</asp:ListItem>

                                                    </asp:DropDownList>
                                                </td>
                                                <td align="right">
                                                    <asp:Label ID="Label2" runat="server" Text="Year:"></asp:Label>
                                                    <asp:Label ID="Label9" runat="server" Text="*" ForeColor="Red"></asp:Label>
                                                </td>
                                                <td align="left">
                                                    <asp:DropDownList ID="ddlYear" runat="server" AutoPostBack="false" Width="174px"
                                                        ErrorMessage="Please Select Year" CssClass="font" >
                                                    </asp:DropDownList>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="4">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">&nbsp;</td>
                                                <td colspan="2" align="left">
                                                    <asp:Button ID="btnSearch" OnClick="btnSearch_Click" runat="server" Text="Search" />
                                                    <asp:Label ID="LblError" runat="server" ForeColor="Red" Text=""></asp:Label>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>


                            </table>
                        </asp:Panel>
                    </td>
                </tr>

            </table>
        </div>
        <div>
            <asp:ScriptManager ID="ScriptManager1" runat="server">
            </asp:ScriptManager>
            <center>
                <table style="width: 100%" cellpadding="0" cellspacing="0">
                    <tr align="left">
                        <td>
                            <rsweb:ReportViewer BackColor="AliceBlue" ID="RptViewer" runat="server" AsyncRendering="false" PageCountMode="Actual" Width="100%" Height="680px" />
                        </td>
                    </tr>
                </table>
            </center>
        </div>
    </form>
</body>
</html>
