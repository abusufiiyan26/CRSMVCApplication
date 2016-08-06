<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ReportCertificateReg.aspx.cs" Inherits="OneCRS.MVC.Reports.ReportCertificateReg" %>

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
                                                    <asp:Label ID="Label1" runat="server" Text="Start Date:"></asp:Label>
                                                    <asp:Label ID="lblMandr" runat="server" Text="*" ForeColor="Red"></asp:Label>

                                                </td>
                                                <td align="left">
                                                    <asp:TextBox ID="txtFromDate" runat="server" Width="171px"></asp:TextBox>
                                                    <asp:CalendarExtender ID="txtFromDate_CalendarExtender" runat="server" Enabled="True"
                                                        TargetControlID="txtFromDate" Format="dd-MM-yyyy">
                                                    </asp:CalendarExtender>
                                                </td>
                                                <td align="right">
                                                    <asp:Label ID="Label2" runat="server" Text="End Date:"></asp:Label>
                                                    <asp:Label ID="Label9" runat="server" Text="*" ForeColor="Red"></asp:Label>
                                                </td>
                                                <td align="left">
                                                    <asp:TextBox ID="txtToDate" runat="server" Width="171px"></asp:TextBox>
                                                    <asp:CalendarExtender ID="txtToDate_CalendarExtender" runat="server" Enabled="True"
                                                        TargetControlID="txtToDate" Format="dd-MM-yyyy">
                                                    </asp:CalendarExtender>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="right">
                                                    <asp:Label ID="Label3" runat="server" Text="Project: "></asp:Label>
                                                </td>
                                                <td align="left">
                                                    <asp:DropDownList ID="ddlProject" runat="server" AutoPostBack="false" Width="174px"
                                                        ErrorMessage="Please Select Project" CssClass="font">
                                                    </asp:DropDownList>
                                                </td>
                                                <td align="right">
                                                    <asp:Label ID="Label4" runat="server" Text="ICNO: "></asp:Label>
                                                </td>
                                                <td align="left">
                                                    <asp:TextBox ID="txtICNO" Text="" runat="server" Width="171px"></asp:TextBox>

                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="right">
                                                    <asp:Label ID="Label5" runat="server" Text="Media:   "></asp:Label>
                                                </td>
                                                <td align="left">
                                                    <asp:DropDownList ID="ddlMedia" runat="server" AutoPostBack="false" Width="174px"
                                                        ErrorMessage="Please Select Media" CssClass="font">
                                                    </asp:DropDownList>

                                                </td>
                                                <td align="right">
                                                    <asp:Label ID="Label6" runat="server" Text="Application Type: "></asp:Label>
                                                </td>
                                                <td align="left">
                                                    <asp:DropDownList ID="ddlApplicationType" runat="server" AutoPostBack="false" Width="174px"
                                                        ErrorMessage="Please Select Application Type" CssClass="font">

                                                        <asp:ListItem Value="0">All</asp:ListItem>
                                                        <asp:ListItem Value="1">NEW</asp:ListItem>
                                                        <asp:ListItem Value="2">RENEW</asp:ListItem>

                                                    </asp:DropDownList>

                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="right">
                                                    <asp:Label ID="Label7" runat="server" Text="Application Status: "></asp:Label>
                                                </td>
                                                <td align="left">
                                                    <asp:DropDownList ID="ddlApplicationStatus" runat="server" AutoPostBack="false" Width="174px"
                                                        ErrorMessage="Please Select Application Status" CssClass="font">
                                                    </asp:DropDownList>
                                                </td>
                                                <td align="right">
                                                    <asp:Label ID="Label8" runat="server" Text="Certificate Status: "></asp:Label>
                                                </td>
                                                <td align="left">

                                                    <asp:DropDownList ID="ddlCertificateStatus" runat="server" AutoPostBack="false" Width="174px"
                                                        ErrorMessage="Please Select Application Type" CssClass="font">
                                                        <asp:ListItem Value="0">All</asp:ListItem>
                                                        <asp:ListItem Value="1">ACTIVE</asp:ListItem>
                                                        <asp:ListItem Value="2">EXPIRED</asp:ListItem>
                                                        <asp:ListItem Value="3">REVOKED</asp:ListItem>

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
                            <rsweb:ReportViewer BackColor="AliceBlue" ID="RptViewer" runat="server" AsyncRendering="false" PageCountMode="Actual" Width="100%" Height="380px" />
                        </td>
                    </tr>
                </table>
            </center>
        </div>
    </form>
</body>
</html>
