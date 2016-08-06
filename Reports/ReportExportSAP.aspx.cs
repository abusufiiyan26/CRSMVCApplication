using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using OneCRS.MVC.Models;
using System.Text;
using Microsoft.Reporting.WebForms;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Threading;
using OneCRS.Common;
using OneCRS.Common.BO;
using OneCRS.BLL;
using System.IO;
using OfficeOpenXml; // Third party dll (EPPlus for Excel)
using Microsoft.Office.Interop.Excel;

// //readme
//                    1. Comment on GL code PK 40 & PK 50 for column Doc Header Text “Revenue recognition”.
//Column Acc No GL for PK50 -> GL Code
//Column Acc No GL for PK40 -> Fix to 510301

//2. Comment on PK 40 & PK 50 for doc header text “deferred income”.
//Column Acc No GL for PK40 -> GL Code
//Column Acc No GL for PK50 -> Fix to 510301


//
namespace OneCRS.MVC.Reports
{
    public partial class ReportExportSAP : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                if (!IsPostBack)
                {
                    //LoadExcelEdit();
                    //ConvertToPdf();
                    if (ViewState["ExportSAP"] != null)
                    {
                        LoadReport();
                    }
                }
            }
            catch (Exception ex)
            {

            }
        }

        protected void btnSearch_Click(object sender, EventArgs e)
        {
            string scriptText = string.Empty;
            try
            {
               
                LblError.Visible = false;
                LblError.Text = string.Empty;

                if (txtFromDate.Text != string.Empty && txtToDate.Text != string.Empty)
                {
                    string sRetString = string.Empty;

                    if (string.IsNullOrEmpty(sRetString) && ddlCashCredit.SelectedItem.Value == "3")
                    {
                        sRetString = Common.Common1.CompareStartEndDateCurrentMonth(txtFromDate.Text, txtToDate.Text);
                    }
                    else if (string.IsNullOrEmpty(sRetString) && ddlCashCredit.SelectedItem.Value != "3")
                    {
                        sRetString = Common.Common1.CompareStartEndDate(txtFromDate.Text, txtToDate.Text);
                    }
                    if (string.IsNullOrEmpty(sRetString))
                    {
                        
                        ViewState["ExportSAP"] = "True";
                        // ExportToExcel();
                        //  LoadExcelDataExport();
                        //ExportToExcel1();
                        LoadReport();
                        
                    }
                    else
                    {
                        scriptText = "alert('" + sRetString + "');";
                        ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alertMessage", scriptText, true);

                        //LblError.Visible = true;
                        //LblError.Text = sRetString;
                    }

                }
                else
                {
                    LblError.Visible = true;
                    LblError.Text = "* All fields are required.";
                }


            }
            catch (Exception ex)
            {

                scriptText = "alert('" + ex.Message.ToString() + "');";
                ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alertMessage", scriptText, true);

            }

        }

        protected void LoadReport()
        {

            try
            {
                string sFromDate = string.Empty;
                string SToDate = string.Empty;

                if (!string.IsNullOrEmpty(txtFromDate.Text))
                    sFromDate = Convert.ToDateTime(txtFromDate.Text).ToString("yyyy-MM-dd");
                if (!string.IsNullOrEmpty(txtToDate.Text))
                    SToDate = Convert.ToDateTime(txtToDate.Text).ToString("yyyy-MM-dd");

                SToDate = SToDate + " 23:59:59";
                sFromDate = sFromDate + " 00:00:00";
                #region Add to Credit sales and income for seletcted date for this session
                //Get Pacakage count based on valid years for selected date range
                ReportsBLL bll = new ReportsBLL();
                FinanceBLL bllFinance = new FinanceBLL();
                List<DefaultDataCollectionBO> lstCollection = new List<DefaultDataCollectionBO>();
                List<TotalRevenueAdvanceIncomeBO> lstAdvanceIncomebo = new List<TotalRevenueAdvanceIncomeBO>();
                List<TotalRevenueSalesBO> lstSalesIncomebo = new List<TotalRevenueSalesBO>();
                List<View_RevenueRecongnition_ExportSalesAdvanceIncomeBO> boRevenuePackage = new List<View_RevenueRecongnition_ExportSalesAdvanceIncomeBO>();
                List<View_RevenueRecongnition_ExportSalesAdvanceIncomeBO> boPreRevenuePackage = new List<View_RevenueRecongnition_ExportSalesAdvanceIncomeBO>();
                //Credit sales
                List<View_RevenueExportCreditIncomeBO> ViewlstCreditAdvanceIncomebo = new List<View_RevenueExportCreditIncomeBO>();
                List<View_RevenueExportCreditSalesBO> ViewlstCreditSalesIncomebo = new List<View_RevenueExportCreditSalesBO>();
                List<View_RevenueExportCreditGrpInvoiceBO> boCreditSalesGrp = new List<View_RevenueExportCreditGrpInvoiceBO>();
                List<TotalCreditAdvanceIncomeBO> lstCreditAdvanceIncomebo = new List<TotalCreditAdvanceIncomeBO>();
                List<TotalCreditSalesBO> lstCreditSalesIncomebo = new List<TotalCreditSalesBO>();

                //

                string sPackageFilter = string.Empty;
                string sDocumentType = string.Empty;
                string sTaxCode = string.Empty;
                string sAccnoFixed = string.Empty;
                //Get  Default value
                lstCollection = bllFinance.GetAllFinanceDefaultvalues();
                if (lstCollection.Count > 0)
                {
                    foreach (DefaultDataCollectionBO boDe in lstCollection)
                    {

                        if (boDe.KeyValue.ToLower() == "revenue" && boDe.KeyData.ToLower() == "docty")
                        {
                            sDocumentType = boDe.Value;
                        }
                        else if (boDe.KeyValue.ToLower() == "revenue" && boDe.KeyData.ToLower() == "taxco")
                        {
                            sTaxCode = boDe.Value;
                        }
                        else if (boDe.KeyValue.ToLower() == "revenue" && boDe.KeyData.ToLower() == "accno")
                        {
                            sAccnoFixed = boDe.Value;
                        }
                    }
                }
                if (ddlCashCredit.SelectedItem.Value == "2")
                {
                    sPackageFilter = "InvoiceDate >= '" + sFromDate + "' and InvoiceDate <= '" + SToDate + "'";
                    ViewlstCreditSalesIncomebo = bll.GetInvoiceCreditSales(sPackageFilter);
                    ViewlstCreditAdvanceIncomebo = bll.GetInvoiceCreditAdvIncome(sPackageFilter);
                    if (ViewlstCreditSalesIncomebo.Count > 0 && ViewlstCreditAdvanceIncomebo.Count > 0)
                    {
                        //for 01 Income Advance
                        TotalCreditAdvanceIncomeBO boRevenueCreditIncomebo = new TotalCreditAdvanceIncomeBO();
                        string sInvoiceId = null;
                        int iRowCount = 0;
                        foreach (View_RevenueExportCreditIncomeBO boRevenueCreditIncome in ViewlstCreditAdvanceIncomebo)
                        {
                            #region//For Insert the Credit Sales Income PK code is 01
                            int iPos;
                            if (string.IsNullOrEmpty(sInvoiceId))
                            {
                                iPos = 0;
                            }
                            else
                            {
                                iPos = sInvoiceId.IndexOf(boRevenueCreditIncome.InvoiceNo + boRevenueCreditIncome.InvoiceDate.ToString("dd-MM-yyyy") + "|");
                            }
                            if (iPos <= 0)
                            {
                                boRevenueCreditIncomebo = new TotalCreditAdvanceIncomeBO();
                                sPackageFilter = "InvoiceNo ='" + boRevenueCreditIncome.InvoiceNo + "' and InvoiceDate ='" + boRevenueCreditIncome.InvoiceDate.ToString("dd-MM-yyyy") + "'";
                                boCreditSalesGrp = bll.GetInvoiceCountCredit(sPackageFilter);
                                //Added on 23 Jun 2016
                                iRowCount = iRowCount + 1;
                                boRevenueCreditIncomebo.IRowCount = iRowCount;
                                boRevenueCreditIncomebo.DocDate = Convert.ToDateTime(boRevenueCreditIncome.DocDate);
                                boRevenueCreditIncomebo.PostDate = Convert.ToDateTime(boRevenueCreditIncome.PostDate);
                                boRevenueCreditIncomebo.DocumentType = boRevenueCreditIncome.DocumentType;
                                boRevenueCreditIncomebo.Currency = boRevenueCreditIncome.Currency;
                                boRevenueCreditIncomebo.RefrenceNo = boRevenueCreditIncome.RefrenceNo;
                                boRevenueCreditIncomebo.DocHeaderText = boRevenueCreditIncome.DocHeaderText;
                                boRevenueCreditIncomebo.PK = boRevenueCreditIncome.PK;
                                int iInvoiceCount = 0;
                                if (boCreditSalesGrp.Count > 0)
                                {
                                    if (boCreditSalesGrp[0].InvoiceCount > 1)
                                    {
                                        iInvoiceCount = Convert.ToInt32(boCreditSalesGrp[0].InvoiceCount);
                                        foreach (View_RevenueExportCreditGrpInvoiceBO boGrp in boCreditSalesGrp)
                                        {
                                            boRevenueCreditIncomebo.Amount = boGrp.TotalAmount;
                                        }
                                    }
                                    else
                                    {
                                        boRevenueCreditIncomebo.Amount = boRevenueCreditIncome.Amount;
                                    }


                                }
                                else
                                {
                                    boRevenueCreditIncomebo.Amount = boRevenueCreditIncome.Amount;
                                }

                                boRevenueCreditIncomebo.AcctNo_GL = boRevenueCreditIncome.AcctNoGL;
                                boRevenueCreditIncomebo.Profitcenter_costcenter = boRevenueCreditIncome.Profitcentercostcenter;
                                boRevenueCreditIncomebo.TaxCode = boRevenueCreditIncome.TaxCode;
                                boRevenueCreditIncomebo.Assignment = boRevenueCreditIncome.Assignment;
                                boRevenueCreditIncomebo.Text = boRevenueCreditIncome.Text;
                                boRevenueCreditIncomebo.SessionID = Session.SessionID;

                                TotalCreditAdvanceIncomeBO NewboRevenueCreditIncomebo = new TotalCreditAdvanceIncomeBO();
                                if (iInvoiceCount > 0)
                                {
                                    for (int iNewRow = 1; iNewRow <= iInvoiceCount; iNewRow++)
                                    {
                                        if (iNewRow > 1)
                                        {
                                            NewboRevenueCreditIncomebo = new TotalCreditAdvanceIncomeBO();
                                            NewboRevenueCreditIncomebo.DocDate = Convert.ToDateTime(boRevenueCreditIncome.DocDate);
                                            NewboRevenueCreditIncomebo.PostDate = Convert.ToDateTime(boRevenueCreditIncome.PostDate);
                                            NewboRevenueCreditIncomebo.DocumentType = boRevenueCreditIncome.DocumentType;
                                            NewboRevenueCreditIncomebo.Currency = boRevenueCreditIncome.Currency;
                                            NewboRevenueCreditIncomebo.RefrenceNo = boRevenueCreditIncome.RefrenceNo;
                                            NewboRevenueCreditIncomebo.DocHeaderText = boRevenueCreditIncome.DocHeaderText;
                                            NewboRevenueCreditIncomebo.PK = boRevenueCreditIncome.PK;
                                            NewboRevenueCreditIncomebo.Amount = boRevenueCreditIncome.Amount;

                                            NewboRevenueCreditIncomebo.AcctNo_GL = boRevenueCreditIncome.AcctNoGL;
                                            NewboRevenueCreditIncomebo.Profitcenter_costcenter = boRevenueCreditIncome.Profitcentercostcenter;
                                            NewboRevenueCreditIncomebo.TaxCode = boRevenueCreditIncome.TaxCode;
                                            NewboRevenueCreditIncomebo.Assignment = boRevenueCreditIncome.Assignment;
                                            NewboRevenueCreditIncomebo.Text = boRevenueCreditIncome.Text;
                                            NewboRevenueCreditIncomebo.SessionID = "";
                                            lstCreditAdvanceIncomebo.Add(NewboRevenueCreditIncomebo);
                                        }
                                        else
                                        {
                                            lstCreditAdvanceIncomebo.Add(boRevenueCreditIncomebo);

                                        }


                                    }
                                }
                                else
                                {
                                    lstCreditAdvanceIncomebo.Add(boRevenueCreditIncomebo);
                                }
                                sInvoiceId = sInvoiceId + "|" + boRevenueCreditIncome.InvoiceNo.ToString() + boRevenueCreditIncome.InvoiceDate.ToString("dd-MM-yyyy") + "|";
                            }
                            #endregion //PK 01
                        }
                        if (lstCreditAdvanceIncomebo.Count > 0)
                        {
                            int iRetCreditAdv = bll.InsertCreditAdvance(lstCreditAdvanceIncomebo);
                        }
                        //50 Sales
                        TotalCreditSalesBO RevenueCreditSalesbo = new TotalCreditSalesBO();
                        foreach (View_RevenueExportCreditSalesBO boRevenueCreditSales in ViewlstCreditSalesIncomebo)
                        {
                            #region//For Insert the Credit Sales Income PK code is 50

                            RevenueCreditSalesbo = new TotalCreditSalesBO();
                            RevenueCreditSalesbo.IRowCount = 0;
                            RevenueCreditSalesbo.DocDate = Convert.ToDateTime(boRevenueCreditSales.DocDate);
                            RevenueCreditSalesbo.PostDate = Convert.ToDateTime(boRevenueCreditSales.PostDate);
                            RevenueCreditSalesbo.DocumentType = boRevenueCreditSales.DocumentType;
                            RevenueCreditSalesbo.Currency = boRevenueCreditSales.Currency;
                            RevenueCreditSalesbo.RefrenceNo = boRevenueCreditSales.RefrenceNo;
                            RevenueCreditSalesbo.DocHeaderText = boRevenueCreditSales.DocHeaderText;
                            RevenueCreditSalesbo.PK = boRevenueCreditSales.PK;
                            RevenueCreditSalesbo.Amount = boRevenueCreditSales.Amount;
                            RevenueCreditSalesbo.AcctNo_GL = boRevenueCreditSales.AcctNoGL;
                            RevenueCreditSalesbo.Profitcenter_costcenter = boRevenueCreditSales.Profitcentercostcenter;
                            RevenueCreditSalesbo.TaxCode = boRevenueCreditSales.TaxCode;
                            RevenueCreditSalesbo.Assignment = boRevenueCreditSales.Assignment;
                            RevenueCreditSalesbo.Text = boRevenueCreditSales.Text;
                            RevenueCreditSalesbo.SessionID = Session.SessionID;

                            lstCreditSalesIncomebo.Add(RevenueCreditSalesbo);



                            #endregion //PK 01
                        }
                        if (lstCreditSalesIncomebo.Count > 0)
                        {
                            int iRetSales = bll.InsertCreditSales(lstCreditSalesIncomebo);
                        }

                    }
                }
                #endregion
                #region Add to Revenue sales and income for seletcted date for this session

                else if (ddlCashCredit.SelectedItem.Value == "3")
                {


                    int iCurrentMonth = Convert.ToDateTime(sFromDate).Month;
                    int iCurrentYr = Convert.ToDateTime(sFromDate).Year;
                    string sMonthName = "JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|";
                    string[] aMonthNames;
                    aMonthNames = sMonthName.Split('|');
                    int iPackageYr = 0;
                    sPackageFilter = "Month ='" + iCurrentMonth + "' and Year = '" + iCurrentYr + "'";
                    List<View_RevenueRecongnitionBO> boDeferred = new List<View_RevenueRecongnitionBO>();
                    //For deferred details
                    int iRevenueCurrentMonth = 0;
                    boDeferred = bll.GetDeferredIncomeDetails(iCurrentMonth, iCurrentYr, 0);
                    //
                    bool bNoSales = false;
                    bool bNoAdvSales = false;
                    bool bNoDeferred = false;
                    boRevenuePackage = bll.GetPackageCountWithYear(sPackageFilter);
                    if (boRevenuePackage.Count > 0)
                    {
                        foreach (View_RevenueRecongnition_ExportSalesAdvanceIncomeBO boRevenue in boRevenuePackage)
                        {

                            iPackageYr = boRevenue.No_Year / 12;
                            #region//For Insert the Sales Income PK code is 50
                            lstSalesIncomebo = new List<TotalRevenueSalesBO>();
                            TotalRevenueSalesBO RevenueSalebo = new TotalRevenueSalesBO();
                            int iSalesYr = iCurrentYr;
                            int iPackageYrSales = iPackageYr;
                            decimal dDeferredIncome = 0;

                            for (int iSalesCount = 0; iSalesCount <= 0; iSalesCount = iSalesCount + 1)
                            {
                                bNoSales = false;
                                iSalesYr = iSalesYr - iPackageYrSales;
                                RevenueSalebo = new TotalRevenueSalesBO();
                                RevenueSalebo.DocDate = Convert.ToDateTime(SToDate);
                                RevenueSalebo.PostDate = Convert.ToDateTime(SToDate);
                                RevenueSalebo.DocumentType = sDocumentType;
                                RevenueSalebo.Currency = "MYR";
                                RevenueSalebo.RefrenceNo = "";
                                RevenueSalebo.DocHeaderText = "REVENUE RECONGNITION " + aMonthNames[iCurrentMonth - 1].ToString() + " " + iCurrentYr;
                                RevenueSalebo.PK = "50";
                                RevenueSalebo.AcctNo_GL = boRevenue.GeneralLedger;
                                #region Get Revenue Amount based on package validity
                                boPreRevenuePackage = new List<View_RevenueRecongnition_ExportSalesAdvanceIncomeBO>();
                                int iPreviousRevenueMonth = 0;
                                int iPreviousRevenueYr = 0;
                                int iPacakgeValidity = 0;
                                DateTime dGetCurrentRevenueDate = new DateTime();
                                DateTime dPreviousRevenueDate = new DateTime();
                                string sConvertedDate = string.Empty;
                                decimal dRevenueTotal = 0;
                                if (boRevenue.No_Year >= 12)
                                {
                                    iPacakgeValidity = boRevenue.No_Year;
                                    //to include current month
                                    iPacakgeValidity = iPacakgeValidity - 1;
                                    sConvertedDate = "01/" + iCurrentMonth + "/" + iCurrentYr;
                                    dGetCurrentRevenueDate = Convert.ToDateTime(sConvertedDate);
                                    dPreviousRevenueDate = dGetCurrentRevenueDate.AddMonths(-1); //iPacakgeValidity

                                    //iRevenueCurrentMonth = iCurrentMonth - 1;
                                    iPreviousRevenueMonth = dPreviousRevenueDate.Month;
                                    iPreviousRevenueYr = dPreviousRevenueDate.Year;
                                    //sPackageFilter = "(Year between '" + iPreviousRevenueYr + "' and '" + iCurrentYr + "') and PackageID='" + boRevenue.PackageID + "'";
                                    sPackageFilter = "Month <='" + iCurrentMonth + "' and Year <= '" + iCurrentYr + "' and PackageID='" + boRevenue.PackageID + "'";
                                    boPreRevenuePackage = bll.GetPackageCountWithYear(sPackageFilter);

                                    if (boPreRevenuePackage.Count > 0)
                                    {
                                        dRevenueTotal = 0;
                                        foreach (View_RevenueRecongnition_ExportSalesAdvanceIncomeBO boRevenueCalculation in boPreRevenuePackage)
                                        {
                                            DateTime dRevenueCalDateTime = Convert.ToDateTime("01/" + boRevenueCalculation.Month + "/" + boRevenueCalculation.Year);
                                            if ((dRevenueCalDateTime < dGetCurrentRevenueDate) && (dRevenueCalDateTime >= dPreviousRevenueDate))
                                            {
                                                dRevenueTotal = Convert.ToDecimal(boRevenueCalculation.TotalAmount);

                                            }
                                           

                                        }
                                        if (dRevenueTotal != 0)
                                        {
                                            RevenueSalebo.Amount = dRevenueTotal;
                                        }
                                        else
                                        {
                                            bNoSales = true;
                                            RevenueSalebo.Amount = Convert.ToDecimal("0.00");
                                        }





                                    }
                                    else
                                    {
                                        bNoSales = true;
                                        RevenueSalebo.Amount = Convert.ToDecimal("0.00");
                                    }


                                }
                                else if (boRevenue.No_Year < 12 && boRevenue.No_Year != 1)
                                {
                                    iPacakgeValidity = boRevenue.No_Year;
                                    //to include current month
                                    iPacakgeValidity = iPacakgeValidity - 1;
                                    sConvertedDate = "01/" + iCurrentMonth + "/" + iCurrentYr;
                                    dGetCurrentRevenueDate = Convert.ToDateTime(sConvertedDate);
                                    dPreviousRevenueDate = dGetCurrentRevenueDate.AddMonths(-1);

                                    iRevenueCurrentMonth = iCurrentMonth - 1;
                                    iPreviousRevenueMonth = dPreviousRevenueDate.Month;
                                    iPreviousRevenueYr = dPreviousRevenueDate.Year;
                                    //sPackageFilter = "(Year between '" + iPreviousRevenueYr + "' and '" + iCurrentYr + "') and PackageID='" + boRevenue.PackageID + "'";
                                    sPackageFilter = "Month <='" + iCurrentMonth + "' and Year <= '" + iCurrentYr + "' and PackageID='" + boRevenue.PackageID + "'";
                                    boPreRevenuePackage = bll.GetPackageCountWithYear(sPackageFilter);

                                    if (boPreRevenuePackage.Count > 0)
                                    {
                                         dRevenueTotal = 0;
                                        foreach (View_RevenueRecongnition_ExportSalesAdvanceIncomeBO boRevenueCalculation in boPreRevenuePackage)
                                        {
                                            DateTime dRevenueCalDateTime = Convert.ToDateTime("01/" + boRevenueCalculation.Month + "/" + boRevenueCalculation.Year);
                                            if ((dRevenueCalDateTime < dGetCurrentRevenueDate ) && (dRevenueCalDateTime >= dPreviousRevenueDate ))
                                            {
                                                dRevenueTotal = Convert.ToDecimal(boRevenueCalculation.TotalAmount);

                                            }
                                           
                                            
                                        }
                                        if (dRevenueTotal != 0)
                                        {
                                            RevenueSalebo.Amount = dRevenueTotal;
                                        }
                                        else
                                        {
                                            bNoSales = true;
                                            RevenueSalebo.Amount = Convert.ToDecimal("0.00");
                                        }

                                    }
                                    else
                                    {
                                        bNoSales = true;
                                        RevenueSalebo.Amount = Convert.ToDecimal("0.00");
                                    }
                                }
                                else if (boRevenue.No_Year == 1)
                                {
                                    iRevenueCurrentMonth = iCurrentMonth - 1;
                                    //
                                    sConvertedDate = "01/" + iCurrentMonth + "/" + iCurrentYr;
                                    dGetCurrentRevenueDate = Convert.ToDateTime(sConvertedDate);
                                    dPreviousRevenueDate = dGetCurrentRevenueDate.AddMonths(-1);

                                    iPreviousRevenueMonth = dPreviousRevenueDate.Month;
                                    iPreviousRevenueYr = dPreviousRevenueDate.Year;

                                    sPackageFilter = "Month ='" + iPreviousRevenueMonth + "' and Year = '" + iPreviousRevenueYr + "' and PackageID='" + boRevenue.PackageID + "'";
                                    boPreRevenuePackage = bll.GetPackageCountWithYear(sPackageFilter);

                                    if (boPreRevenuePackage.Count > 0)
                                    {
                                         dRevenueTotal = 0;
                                        foreach (View_RevenueRecongnition_ExportSalesAdvanceIncomeBO boRevenueCalculation in boPreRevenuePackage)
                                        {
                                            dRevenueTotal = Convert.ToDecimal(boRevenueCalculation.TotalAmount);
                                        }
                                        if (dRevenueTotal != 0)
                                        {
                                            RevenueSalebo.Amount = dRevenueTotal;
                                        }
                                        else
                                        {
                                            bNoSales = true;
                                            RevenueSalebo.Amount = Convert.ToDecimal("0.00");
                                        }

                                    }
                                    else
                                    {
                                        bNoSales = true;
                                        RevenueSalebo.Amount = Convert.ToDecimal("0.00");
                                    }
                                }


                               
                                #endregion
                                //if (iSalesYr == iCurrentYr)
                                //{
                                //    RevenueSalebo.Amount = Convert.ToDecimal(boRevenue.TotalAmount);
                                //}
                                //else
                                //{
                                //    boPreRevenuePackage = new List<View_RevenueRecongnition_ExportSalesAdvanceIncomeBO>();

                                //    sPackageFilter = "Month ='" + iCurrentMonth + "' and Year = '" + iSalesYr + "' and PackageID='" + boRevenue.PackageID + "'";
                                //    boPreRevenuePackage = bll.GetPackageCountWithYear(sPackageFilter);

                                //    if (boPreRevenuePackage.Count > 0)
                                //    {
                                //        RevenueSalebo.Amount = Convert.ToDecimal(boPreRevenuePackage[0].TotalAmount);
                                //    }
                                //    else
                                //    {
                                //        bNoSales = true;
                                //        RevenueSalebo.Amount = Convert.ToDecimal("0.00");
                                //    }

                                //}

                                RevenueSalebo.Profitcenter_costcenter = boRevenue.ProfitCenter;
                                RevenueSalebo.TaxCode = sTaxCode;
                                RevenueSalebo.Assignment = boRevenue.ProjectName;
                                RevenueSalebo.Text = "INCOME RECONGNITION-" + boRevenue.ProjectName + " " + aMonthNames[iCurrentMonth - 1].ToString() + "'" + iSalesYr;
                                RevenueSalebo.SessionID = Session.SessionID;
                                if (bNoSales == false)
                                {
                                    lstSalesIncomebo.Add(RevenueSalebo);
                                }

                                iSalesYr = iCurrentYr;
                                iPackageYrSales = iPackageYrSales - 1;
                            }
                            if (boDeferred.Count > 0)
                            {
                                foreach (View_RevenueRecongnitionBO boDeferredMonth in boDeferred)
                                {
                                    if (boRevenue.PackageID == boDeferredMonth.PackageID)
                                    {
                                        dDeferredIncome = dDeferredIncome + boDeferredMonth.Deferred;
                                    }

                                }
                                //no need of deferred record if is zero. added on 15 jun 2016 by abu
                                if (dDeferredIncome <= 0)
                                {
                                    bNoDeferred = true;
                                }
                                else
                                {
                                    bNoDeferred = false;
                                }
                            }
                            if (lstSalesIncomebo.Count >= 0)
                            {
                                if (bNoDeferred == false)
                                {
                                    RevenueSalebo = new TotalRevenueSalesBO();
                                    RevenueSalebo.DocDate = Convert.ToDateTime(SToDate);
                                    RevenueSalebo.PostDate = Convert.ToDateTime(SToDate);
                                    RevenueSalebo.DocumentType = sDocumentType;
                                    RevenueSalebo.Currency = "MYR";
                                    RevenueSalebo.RefrenceNo = "";
                                    RevenueSalebo.DocHeaderText = "DEFERRED INCOME. " + aMonthNames[iCurrentMonth - 1].ToString() + " " + iCurrentYr;
                                    RevenueSalebo.PK = "50";
                                    RevenueSalebo.AcctNo_GL = sAccnoFixed; //Fixed code by finance team// boRevenue.GeneralLedger;
                                    RevenueSalebo.Amount = dDeferredIncome;// Convert.ToDecimal(boRevenue.TotalAmount);
                                    RevenueSalebo.Profitcenter_costcenter = boRevenue.ProfitCenter;
                                    RevenueSalebo.TaxCode = sTaxCode;
                                    RevenueSalebo.Assignment = boRevenue.ProjectName;
                                    RevenueSalebo.Text = "DEFERRED INCOME -" + boRevenue.ProjectName + " " + aMonthNames[iCurrentMonth - 1].ToString() + "'" + iSalesYr;
                                    RevenueSalebo.SessionID = Session.SessionID;
                                    lstSalesIncomebo.Add(RevenueSalebo);

                                }//no deferred condition
                                int iRetSales = bll.InsertRevenueSales(lstSalesIncomebo);
                            }
                            #endregion //PK 50

                            #region//For Insert the Advance Income PK code is 40
                            lstAdvanceIncomebo = new List<TotalRevenueAdvanceIncomeBO>();
                            TotalRevenueAdvanceIncomeBO RevenueAdvancebo = new TotalRevenueAdvanceIncomeBO();
                            int iAdvanceYr = iCurrentYr;
                            int iPackageYrAdvance = iPackageYr;
                            for (int iAdvanceCount = 0; iAdvanceCount <= 0; iAdvanceCount = iAdvanceCount + 1)
                            {
                                bNoAdvSales = false;
                                iAdvanceYr = iAdvanceYr - iPackageYrAdvance;
                                RevenueAdvancebo = new TotalRevenueAdvanceIncomeBO();
                                RevenueAdvancebo.DocDate = Convert.ToDateTime(SToDate);
                                RevenueAdvancebo.PostDate = Convert.ToDateTime(SToDate);
                                RevenueAdvancebo.DocumentType = sDocumentType;
                                RevenueAdvancebo.Currency = "MYR";
                                RevenueAdvancebo.RefrenceNo = "";
                                RevenueAdvancebo.DocHeaderText = "REVENUE RECONGNITION " + aMonthNames[iCurrentMonth - 1].ToString() + " " + iCurrentYr;
                                RevenueAdvancebo.PK = "40";
                                RevenueAdvancebo.AcctNo_GL = sAccnoFixed;//Fixed code by finance team // GetCustomerCode(boRevenue.ProjectPrefix);// "510302";// boRevenue.GeneralLedger;

                                #region Get Revenue Amount based on package validity
                                boPreRevenuePackage = new List<View_RevenueRecongnition_ExportSalesAdvanceIncomeBO>();
                                int iPreviousRevenueMonth = 0;
                                int iPreviousRevenueYr = 0;
                                int iPacakgeValidity = 0;
                                DateTime dGetCurrentRevenueDate = new DateTime();
                                DateTime dPreviousRevenueDate = new DateTime();
                                string sConvertedDate = string.Empty;
                                decimal dRevenueTotal = 0;
                                if (boRevenue.No_Year >= 12)
                                {
                                    iPacakgeValidity = boRevenue.No_Year;
                                    //to include current month
                                    iPacakgeValidity = iPacakgeValidity - 1;
                                    sConvertedDate = "01/" + iCurrentMonth + "/" + iCurrentYr;
                                    dGetCurrentRevenueDate = Convert.ToDateTime(sConvertedDate);
                                    dPreviousRevenueDate = dGetCurrentRevenueDate.AddMonths(-1);

                                    iPreviousRevenueMonth = dPreviousRevenueDate.Month;
                                    iPreviousRevenueYr = dPreviousRevenueDate.Year;
                                    //sPackageFilter = "(Year between '" + iPreviousRevenueYr + "' and '" + iCurrentYr + "') and PackageID='" + boRevenue.PackageID + "'";
                                    sPackageFilter = "Month <='" + iCurrentMonth + "' and Year <= '" + iCurrentYr + "' and PackageID='" + boRevenue.PackageID + "'";

                                    boPreRevenuePackage = bll.GetPackageCountWithYear(sPackageFilter);

                                    if (boPreRevenuePackage.Count > 0)
                                    {
                                        dRevenueTotal = 0;
                                        foreach (View_RevenueRecongnition_ExportSalesAdvanceIncomeBO boRevenueCalculation in boPreRevenuePackage)
                                        {
                                            DateTime dRevenueCalDateTime = Convert.ToDateTime("01/" + boRevenueCalculation.Month + "/" + boRevenueCalculation.Year);
                                            if ((dRevenueCalDateTime < dGetCurrentRevenueDate) && (dRevenueCalDateTime >= dPreviousRevenueDate))
                                            {
                                                dRevenueTotal = Convert.ToDecimal(boRevenueCalculation.TotalAmount);

                                            }


                                        }
                                        if (dRevenueTotal != 0)
                                        {
                                            RevenueAdvancebo.Amount = dRevenueTotal;
                                        }
                                        else
                                        {
                                            bNoAdvSales = true;
                                            RevenueAdvancebo.Amount = Convert.ToDecimal("0.00");
                                        }

                                    }
                                    else
                                    {
                                        bNoAdvSales = true;
                                        RevenueAdvancebo.Amount = Convert.ToDecimal("0.00");
                                    }


                                }
                                else if (boRevenue.No_Year < 12 && boRevenue.No_Year != 1)
                                {
                                    iPacakgeValidity = boRevenue.No_Year;
                                    //to include current month
                                    iPacakgeValidity = iPacakgeValidity - 1;
                                    sConvertedDate = "01/" + iCurrentMonth + "/" + iCurrentYr;
                                    dGetCurrentRevenueDate = Convert.ToDateTime(sConvertedDate);
                                    dPreviousRevenueDate = dGetCurrentRevenueDate.AddMonths(-1);

                                    iRevenueCurrentMonth = iCurrentMonth - 1;
                                    iPreviousRevenueMonth = dPreviousRevenueDate.Month;
                                    iPreviousRevenueYr = dPreviousRevenueDate.Year;
                                   // sPackageFilter = "(Year between '" + iPreviousRevenueYr + "' and '" + iCurrentYr + "') and PackageID='" + boRevenue.PackageID + "'";
                                    sPackageFilter = "Month <='" + iCurrentMonth + "' and Year <= '" + iCurrentYr + "' and PackageID='" + boRevenue.PackageID + "'";

                                    boPreRevenuePackage = bll.GetPackageCountWithYear(sPackageFilter);

                                    if (boPreRevenuePackage.Count > 0)
                                    {
                                        dRevenueTotal = 0;
                                        foreach (View_RevenueRecongnition_ExportSalesAdvanceIncomeBO boRevenueCalculation in boPreRevenuePackage)
                                        {
                                            DateTime dRevenueCalDateTime = Convert.ToDateTime("01/" + boRevenueCalculation.Month + "/" + boRevenueCalculation.Year);
                                            if ((dRevenueCalDateTime < dGetCurrentRevenueDate) && (dRevenueCalDateTime >= dPreviousRevenueDate))
                                            {
                                                dRevenueTotal = Convert.ToDecimal(boRevenueCalculation.TotalAmount);

                                            }


                                        }
                                        if (dRevenueTotal != 0)
                                        {
                                            RevenueAdvancebo.Amount = dRevenueTotal;
                                        }
                                        else
                                        {
                                            bNoAdvSales = true;
                                            RevenueAdvancebo.Amount = Convert.ToDecimal("0.00");
                                        }

                                    }
                                    else
                                    {
                                        bNoAdvSales = true;
                                        RevenueAdvancebo.Amount = Convert.ToDecimal("0.00");
                                    }
                                }
                                else if (boRevenue.No_Year == 1)
                                {
                                    iRevenueCurrentMonth = iCurrentMonth - 1;
                                    //
                                    sConvertedDate = "01/" + iCurrentMonth + "/" + iCurrentYr;
                                    dGetCurrentRevenueDate = Convert.ToDateTime(sConvertedDate);
                                    dPreviousRevenueDate = dGetCurrentRevenueDate.AddMonths(-1);
                                                                       
                                    iPreviousRevenueMonth = dPreviousRevenueDate.Month;
                                    iPreviousRevenueYr = dPreviousRevenueDate.Year;


                                    sPackageFilter = "Month ='" + iPreviousRevenueMonth + "' and Year = '" + iPreviousRevenueYr + "' and PackageID='" + boRevenue.PackageID + "'";
                                    boPreRevenuePackage = bll.GetPackageCountWithYear(sPackageFilter);

                                    if (boPreRevenuePackage.Count > 0)
                                    {
                                        dRevenueTotal = 0;
                                        foreach (View_RevenueRecongnition_ExportSalesAdvanceIncomeBO boRevenueCalculation in boPreRevenuePackage)
                                        {
                                            dRevenueTotal = Convert.ToDecimal(boRevenueCalculation.TotalAmount);
                                        }
                                        if (dRevenueTotal != 0)
                                        {
                                            RevenueAdvancebo.Amount = dRevenueTotal;
                                        }
                                        else
                                        {
                                            bNoAdvSales = true;
                                            RevenueAdvancebo.Amount = Convert.ToDecimal("0.00");
                                        }

                                    }
                                    else
                                    {
                                        bNoAdvSales = true;
                                        RevenueAdvancebo.Amount = Convert.ToDecimal("0.00");
                                    }
                                }



                                #endregion




                                //if (iAdvanceYr == iCurrentYr)
                                //{
                                //    RevenueAdvancebo.Amount = Convert.ToDecimal(boRevenue.TotalAmount);
                                //}
                                //else
                                //{
                                //    boPreRevenuePackage = new List<View_RevenueRecongnition_ExportSalesAdvanceIncomeBO>();

                                //    sPackageFilter = "Month ='" + iCurrentMonth + "' and Year = '" + iAdvanceYr + "' and PackageID='" + boRevenue.PackageID + "'";
                                //    boPreRevenuePackage = bll.GetPackageCountWithYear(sPackageFilter);

                                //    if (boPreRevenuePackage.Count > 0)
                                //    {
                                //        RevenueAdvancebo.Amount = Convert.ToDecimal(boPreRevenuePackage[0].TotalAmount);
                                //    }
                                //    else
                                //    {
                                //        bNoAdvSales = true;
                                //        RevenueAdvancebo.Amount = Convert.ToDecimal("0.00");
                                //    }

                                //}
                                RevenueAdvancebo.Profitcenter_costcenter = boRevenue.ProfitCenter;
                                RevenueAdvancebo.TaxCode = sTaxCode;
                                RevenueAdvancebo.Assignment = boRevenue.ProjectName;
                                RevenueAdvancebo.Text = "INCOME RECONGNITION-" + boRevenue.ProjectName + " " + aMonthNames[iCurrentMonth - 1].ToString() + "'" + iAdvanceYr;
                                RevenueAdvancebo.SessionID = Session.SessionID;

                                if (bNoAdvSales == false)
                                {
                                    lstAdvanceIncomebo.Add(RevenueAdvancebo);

                                }

                                iAdvanceYr = iCurrentYr;
                                iPackageYrAdvance = iPackageYrAdvance - 1;
                            }
                            if (lstAdvanceIncomebo.Count >= 0)
                            {
                                if (bNoDeferred == false)
                                {
                                    RevenueAdvancebo = new TotalRevenueAdvanceIncomeBO();
                                    RevenueAdvancebo.DocDate = Convert.ToDateTime(SToDate);
                                    RevenueAdvancebo.PostDate = Convert.ToDateTime(SToDate);
                                    RevenueAdvancebo.DocumentType = sDocumentType;
                                    RevenueAdvancebo.Currency = "MYR";
                                    RevenueAdvancebo.RefrenceNo = "";
                                    RevenueAdvancebo.DocHeaderText = "DEFERRED INCOME. " + aMonthNames[iCurrentMonth - 1].ToString() + " " + iCurrentYr;
                                    RevenueAdvancebo.PK = "40";
                                    RevenueAdvancebo.AcctNo_GL = boRevenue.GeneralLedger;// GetCustomerCode(boRevenue.ProjectPrefix); //"510302";// boRevenue.GeneralLedger;
                                    RevenueAdvancebo.Amount = dDeferredIncome;// Convert.ToDecimal(boRevenue.TotalAmount);
                                    RevenueAdvancebo.Profitcenter_costcenter = boRevenue.ProfitCenter;
                                    RevenueAdvancebo.TaxCode = sTaxCode;
                                    RevenueAdvancebo.Assignment = boRevenue.ProjectName;
                                    RevenueAdvancebo.Text = "DEFERRED INCOME -" + boRevenue.ProjectName + " " + aMonthNames[iCurrentMonth - 1].ToString() + "'" + iSalesYr;
                                    RevenueAdvancebo.SessionID = Session.SessionID;
                                    lstAdvanceIncomebo.Add(RevenueAdvancebo);

                                } //no deferred condition
                                int iRetAdvance = bll.InsertRevenueAdvance(lstAdvanceIncomebo);

                            }
                            #endregion //PK 40


                        }//End for main loop
                    }//End if main packae count





                    // int ret = bll.InsertRevenueAdvance(bo);
                }
                #endregion
                string urlReportServer = ConfigurationManager.AppSettings["SSRSBaseUrl"].ToString();
                string UserNameReportServer = ConfigurationManager.AppSettings["SSRSUserName"].ToString();
                string PwdReportServer = ConfigurationManager.AppSettings["SSRSPWD"].ToString();
                string DomainReportServer = ConfigurationManager.AppSettings["SSRSDomin"].ToString();

                RptViewer.ProcessingMode = ProcessingMode.Remote;
                // ProcessingMode will be Either Remote or Local
                RptViewer.ServerReport.ReportServerUrl = new Uri(urlReportServer);
                //Set the ReportServer Url
                RptViewer.ServerReport.ReportPath = "/ReportOneCRS/Finance_ExportSAP";
                //Passing the Report Path   


                Microsoft.Reporting.WebForms.ReportParameter[] Params = new Microsoft.Reporting.WebForms.ReportParameter[4];
                Params[0] = new Microsoft.Reporting.WebForms.ReportParameter("FromDate", sFromDate, Visible);
                Params[1] = new Microsoft.Reporting.WebForms.ReportParameter("ToDate", SToDate, Visible);
                Params[2] = new Microsoft.Reporting.WebForms.ReportParameter("IsCash", ddlCashCredit.SelectedItem.Value, Visible);
                Params[3] = new Microsoft.Reporting.WebForms.ReportParameter("SessionID", Session.SessionID, Visible);



                // pass crendentitilas
                RptViewer.ServerReport.ReportServerCredentials = new ReportServerCredentials(UserNameReportServer, PwdReportServer, DomainReportServer);
                //'"report", "123456", "sonicmaster")

                //pass parmeters to report
                RptViewer.ServerReport.SetParameters(Params);
                //Set Report Parameters
                RptViewer.ServerReport.Refresh();
                
                string mimeType;
                string encoding;
                string extension;
                string[] streams;
                Warning[] warnings;
                byte[] pdfBytes = RptViewer.ServerReport.Render("Excel", string.Empty, out mimeType, out encoding, out extension, out streams, out warnings);
                string sFilename = string.Empty;
                if (ddlCashCredit.SelectedItem.Value == "1")
                {
                    sFilename = Session["UserID"].ToString() + "_Cash_ExportSAP." + extension;
                }
                else if (ddlCashCredit.SelectedItem.Value == "2")
                {
                    sFilename = Session["UserID"].ToString() + "_Credit_ExportSAP." + extension;
                }
                else if (ddlCashCredit.SelectedItem.Value == "3")
                {
                    sFilename = Session["UserID"].ToString() + "_Revenue_ExportSAP." + extension;
                }
                string sfileNamePath = Server.MapPath("~/UploadFiles/" + sFilename);
                // save the file
                using (FileStream fs = new FileStream(sfileNamePath, FileMode.Create))
                {
                    fs.Write(pdfBytes, 0, pdfBytes.Length);
                    fs.Close();
                    //Response.Buffer = true;
                    //Response.ContentType = "application/pdf";
                    //Response.AddHeader("content-disposition", "attachment;filename=" + sFilename);
                    //Response.Cache.SetCacheability(HttpCacheability.NoCache);
                    //Response.Write(fs);
                    //Response.End();
                }
                Response.Clear();
                Response.Buffer = false;
                Response.ContentType = "application/Excel";
                Response.AppendHeader("Content-Disposition", "attachment; filename=" + sFilename);
                Response.TransmitFile(sfileNamePath, 0, -1);
                Response.Close();
            }

            catch (Exception ex)
            {
            }

        }
        //addded on 21 May 2015 gt customer code

        public string GetCustomerCode(string sProjectPrefix)
        {
            string sRet = string.Empty;
            try
            {
                string sFilter = string.Empty;
                ReportsBLL bll = new ReportsBLL();
                List<View_GetCustomerCodeBO> boCustomerCode = new List<View_GetCustomerCodeBO>();

                sFilter = " ProjectPrefix ='" + sProjectPrefix + "' order by CustomerCode desc";
                boCustomerCode = bll.GetCustomerCodewithFilter(sFilter);
                if (boCustomerCode.Count > 0)
                {
                    sRet = boCustomerCode[0].CustomerCode;
                }


            }
            catch (Exception ex)
            {
                sRet = "";
            }
            return sRet;
        }
        public void LoadExcelEdit()
        {
            Microsoft.Office.Interop.Excel.Application objExcel = new Microsoft.Office.Interop.Excel.Application();
            Microsoft.Office.Interop.Excel.Workbook objworkbook;
            Microsoft.Office.Interop.Excel.Worksheet objworksheet;
            string sfileName = @"E:\Abu\Project\\1CRSNew_Server\OneCRS.MVC\UploadFiles\Sample_Quotation.xlsx";
            string sfileNameSA = @"E:\Abu\Project\\1CRSNew_Server\OneCRS.MVC\UploadFiles\Sample_Quotation8.xlsx";
            string sfileNameO = @"E:\Abu\Project\\1CRSNew_Server\OneCRS.MVC\UploadFiles\Sample_Quotation8.pdf";

            try
            {

                objExcel.DisplayAlerts = false;
                objExcel.Visible = false;
                Range objRange = null;
                int row = 4, col = 4;
                objworkbook = objExcel.Workbooks.Open(sfileName, true, false,
                                                      Type.Missing, Type.Missing, Type.Missing, Type.Missing,
                                                      Type.Missing, Type.Missing, true, Type.Missing,
                                                      Type.Missing, Type.Missing, Type.Missing, Type.Missing);
                objworksheet = (Microsoft.Office.Interop.Excel.Worksheet)objworkbook.Sheets.get_Item("Quotation");
                int j = col;
                int iRowBdy = 16;
                string sLength = string.Empty;
                string sRowHt = string.Empty;
                int iTotal = 4, iInsertTotal = 0;
                if (iTotal > 2)
                {
                    iInsertTotal = iTotal - 2;
                    for (int iNewRow = 1; iNewRow <= iInsertTotal; iNewRow++)
                    {
                        objExcel.Range["A16:L16"].Select(); // for insert new row
                        objExcel.Range["A16:L16"].EntireRow.Insert(XlInsertShiftDirection.xlShiftToRight, XlInsertFormatOrigin.xlFormatFromLeftOrAbove);

                        //Selection.EntireRow.Insert , CopyOrigin:=xlFormatFromLeftOrAbove

                    }


                }
                objRange = (Range)objworksheet.Cells[row, j];
                objRange.Value2 = "Ansharah Tech Sdn Bhd";
                for (int i = 0; i < iTotal; i++)
                {
                    //objRange = (Range)objworksheet.Cells[row, j];
                    //objRange.Value2 = "Ansharah Tech Sdn Bhd";
                    if (i >= 1)
                    {


                        if (iRowBdy >= 16)
                        {
                            ////sLength = "B" + iRowBdy + ":H" + iRowBdy;
                            ////objExcel.Range[sLength].Select();
                            ////objExcel.Range[sLength].HorizontalAlignment = Constants.xlLeft;
                            ////objExcel.Range[sLength].VerticalAlignment = Constants.xlTop;
                            ////objExcel.Range[sLength].WrapText = true;
                            ////objExcel.Range[sLength].Orientation = 0;
                            ////objExcel.Range[sLength].AddIndent = false;
                            ////objExcel.Range[sLength].IndentLevel = 0;
                            ////objExcel.Range[sLength].ShrinkToFit = false;
                            ////objExcel.Range[sLength].MergeCells = true;
                            objExcel.Range["A15:L15"].Select(); // formating
                            objExcel.Range["A15:L15"].Copy(); // formating
                            sLength = "A" + iRowBdy + ":L" + iRowBdy;
                            objExcel.Range[sLength].Select();
                            objExcel.Range[sLength].PasteSpecial(XlPasteType.xlPasteFormats, XlPasteSpecialOperation.xlPasteSpecialOperationNone, Type.Missing, Type.Missing);



                        }
                        objRange = (Range)objworksheet.Cells[iRowBdy, 2];
                        objRange.Value2 = "ANSHARAH" + ((char)10) + "" + ((char)10) + "• Hi this for ansharah" + ((char)10) + "• Hi this for ansharah Athatha \u2022" + ((char)10) + "• Hi this for ansharah Amma \u2022" + ((char)10) + "• Hi Ansharah Chellam \u2022" + ((char)10) + "• Hi Ansharah Chellam kutty \u2022";
                        objRange = (Range)objworksheet.Cells[iRowBdy, 9];
                        objRange.Value2 = "100";
                        objRange = (Range)objworksheet.Cells[iRowBdy, 10];
                        objRange.Value2 = "1";
                        objRange = (Range)objworksheet.Cells[iRowBdy, 11];
                        objRange.Value2 = "6";
                        objRange = (Range)objworksheet.Cells[iRowBdy, 12];
                        objRange.Value2 = "106";
                        sLength = "B" + iRowBdy + ":H" + iRowBdy;
                        objExcel.Range[sLength].Select();

                        sRowHt = iRowBdy + ":" + iRowBdy;
                        objExcel.Rows[sRowHt].RowHeight = 117.75;
                        // objExcel.Rows["16:16"].RowHeight = 129.75

                        objExcel.ActiveCell.Characters[1, 8].Font.Name = "Calibri";
                        objExcel.ActiveCell.Characters[1, 8].Font.FontStyle = "Bold";
                        objExcel.ActiveCell.Characters[1, 8].Font.Size = 11;

                        objExcel.ActiveCell.Characters[9, 250].Font.Name = "Calibri";
                        objExcel.ActiveCell.Characters[9, 250].Font.FontStyle = "Italic";
                        objExcel.ActiveCell.Characters[9, 250].Font.Size = 11;
                        iRowBdy++;
                    }
                    //objRange.Font.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.Color.White);
                    //objRange.Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.Color.DarkBlue);
                    // j++;
                }
                row++;

                objworksheet.Name = "Quotation";
                object objOpt = System.Reflection.Missing.Value;
                //
                objworksheet = (Microsoft.Office.Interop.Excel.Worksheet)objworkbook.Sheets.get_Item("term&condition");
                int row2 = 15, col2 = 3;
                j = col2;
                for (int i = 0; i < 8; i++)
                {
                    objRange = (Range)objworksheet.Cells[row2, j];

                    if (row2 == 15)
                    {
                        objRange.Value2 = "ANSHARAH";
                    }
                    if (row2 == 20)
                    {
                        objRange.Value2 = "MANAGING DIRECTOR";
                    }
                    if (row2 == 21)
                    {
                        objRange.Value2 = "APPLICATION DEPeARTMENTT";
                    }
                    //objRange.Font.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.Color.White);
                    //objRange.Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.Color.DarkBlue);
                    row2++;
                }
                // row++;

                objworksheet.Name = "term&condition";

                //objworkbook.Save();
                objworkbook.SaveAs(sfileNameSA, Microsoft.Office.Interop.Excel.XlFileFormat.xlWorkbookDefault, Type.Missing, Type.Missing,
            false, false, Microsoft.Office.Interop.Excel.XlSaveAsAccessMode.xlNoChange,
            Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing);

                objworkbook.ExportAsFixedFormat(XlFixedFormatType.xlTypePDF, sfileNameO);

                objworkbook.Close(Microsoft.Office.Interop.Excel.XlSaveAction.xlSaveChanges, Type.Missing, Type.Missing);
                // Cleanup
                GC.Collect();
                GC.WaitForPendingFinalizers();

                System.Runtime.InteropServices.Marshal.FinalReleaseComObject(objRange);
                System.Runtime.InteropServices.Marshal.FinalReleaseComObject(objworksheet);

                //objworkbook.Close(Type.Missing, Type.Missing, Type.Missing);
                //objworkbook.Close(Microsoft.Office.Interop.Excel.XlSaveAction.xlSaveChanges, Type.Missing, Type.Missing);
                System.Runtime.InteropServices.Marshal.FinalReleaseComObject(objworkbook);

                objExcel.Quit();
                System.Runtime.InteropServices.Marshal.FinalReleaseComObject(objExcel);

                // objExcel.Quit();
                System.Diagnostics.Process process = new System.Diagnostics.Process();
                process.StartInfo.UseShellExecute = true;
                process.StartInfo.FileName = sfileNameO;
                process.Start();
                //System.Diagnostics.Process.Start(sfileNameO);
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            finally
            {


                objExcel = null;
                objworkbook = null;
                objworksheet = null;
                //ReleaseComObject(objExcel);
                //ReleaseComObject(objworkbook);
                //ReleaseComObject(objworksheet);
            }

        }
        //Release COM objects from memory
        public void ReleaseComObject(object reference)
        {
            try
            {
                while (System.Runtime.InteropServices.Marshal.ReleaseComObject(reference) <= 0)
                {
                }
            }
            catch
            {
            }
        }
        public void ConvertToPdf()
        {
            string sfileName = @"E:\Abu\Project\\1CRSNew_Server\OneCRS.MVC\UploadFiles\Sample_Quotation.xlsx";
            string sfileNameO = @"E:\Abu\Project\\1CRSNew_Server\OneCRS.MVC\UploadFiles\Sample_Quotation.pdf";

            // string sfileNamePath = Server.MapPath("~/UploadFiles/" + sfileName);

            Application app = new Application();
            Workbook wkb = app.Workbooks.Open(sfileName);
            wkb.ExportAsFixedFormat(XlFixedFormatType.xlTypePDF, sfileNameO);
            wkb.Close();

        }
        public void LoadExcelDataExport()
        {
            // DataTable dt1 = new DataTable();

            try
            {

                const int iStartRow = 1;

                string sfileName = string.Empty;
                sfileName = "Sample_Quotation.xlsx";

                string sfileNamePath = Server.MapPath("~/UploadFiles/" + sfileName);


                //Reading Excel file.
                #region Creating datatable.
                int iSNCount = 0;

                int iDivisionID = 0;
                string iMobileNo = string.Empty;
                int iMaxCount = 8;
                string sNRIC = string.Empty;
                string sRank = string.Empty;
                string sName = string.Empty;


                #endregion
                // Get the file we are going to process
                var existingFile = new FileInfo(sfileNamePath);
                // Open and read the XlSX file.

                using (var package = new ExcelPackage(existingFile))
                {
                    // Get the work book in the file
                    ExcelWorkbook workBook = package.Workbook;

                    if (workBook != null)
                    {
                        if (workBook.Worksheets.Count > 0)
                        {
                            // Get the first worksheet
                            ExcelWorksheet currentWorksheet = workBook.Worksheets.First();

                            // read header data
                            object col1Header = currentWorksheet.Cells[iStartRow, 1].Value;
                            object col2Header = currentWorksheet.Cells[iStartRow, 2].Value;
                            object col3Header = currentWorksheet.Cells[iStartRow, 3].Value;
                            object col4Header = currentWorksheet.Cells[iStartRow, 4].Value;
                            object col5Header = currentWorksheet.Cells[iStartRow, 5].Value;
                            object col6Header = currentWorksheet.Cells[iStartRow, 6].Value;

                        }


                    }

                    package.Dispose();
                }

                Response.Clear();
                Response.Buffer = true;



                Response.ContentType = "application/Pdf";
                Response.AppendHeader("Content-Disposition", "attachment; filename=AdhocSMSTemplate.pdf");
                Response.TransmitFile(sfileNamePath);


                Response.Flush();

                Response.End();

            }
            catch (Exception ex)
            {



            }

        }

        private ArrayList ReportDefaultPatam()
        {
            ArrayList arrLstDefaultParam = new ArrayList();
            arrLstDefaultParam.Add(CreateReportParameter("ReportTitle", "Title of Report"));
            arrLstDefaultParam.Add(CreateReportParameter("ReportSubTitle", "Sub Title of Report"));
            return arrLstDefaultParam;
        }

        private ReportParameter CreateReportParameter(string paramName, string pramValue)
        {
            ReportParameter aParam = new ReportParameter(paramName, pramValue);
            return aParam;
        }

        protected void ddlCashCredit_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                if (ddlCashCredit.SelectedItem.Value == "3")
                {
                    DateTime tFromDate = Convert.ToDateTime(txtFromDate.Text);
                    tFromDate = new DateTime(tFromDate.Year, tFromDate.Month, 1);
                    txtFromDate.Text = tFromDate.ToString("dd-MM-yyyy");
                    txtToDate.Text = tFromDate.AddMonths(1).AddDays(-1).ToString("dd-MM-yyyy");
                }

            }
            catch (Exception ex)
            {

            }
        }

        protected void txtFromDate_TextChanged(object sender, EventArgs e)
        {
            try
            {
                if (ddlCashCredit.SelectedItem.Value == "3")
                {
                    DateTime tFromDate = Convert.ToDateTime(txtFromDate.Text);
                    tFromDate = new DateTime(tFromDate.Year, tFromDate.Month, 1);
                    txtFromDate.Text = tFromDate.ToString("dd-MM-yyyy");
                    txtToDate.Text = tFromDate.AddMonths(1).AddDays(-1).ToString("dd-MM-yyyy");
                }

            }
            catch (Exception ex)
            {

            }
        }

        protected void txtToDate_TextChanged(object sender, EventArgs e)
        {
            try
            {
                if (ddlCashCredit.SelectedItem.Value == "3")
                {
                    DateTime tFromDate = Convert.ToDateTime(txtFromDate.Text);
                    tFromDate = new DateTime(tFromDate.Year, tFromDate.Month, 1);
                    txtFromDate.Text = tFromDate.ToString("dd-MM-yyyy");
                    txtToDate.Text = tFromDate.AddMonths(1).AddDays(-1).ToString("dd-MM-yyyy");
                }

            }
            catch (Exception ex)
            {

            }
        }
    }
}