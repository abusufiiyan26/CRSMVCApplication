$(window).load(function () {

    $("#HidePOProject").show();

    if ($("#HideUploadCondition").val() == "Y") {
        $("#HideQuotationNoVal").hide();
    }

    $('#poDate').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true,
        showButtonPanel: true
    });

    var ReviseProjectID = $('#ReviseProjectID').val();
    var ReviseContactPersonID = $('#ReviseContactPersonID').val();
    var ReviseCustomerName = $('#ReviseCustomerName').val();
    var ReviseCustomerState = $('#ReviseCustomerState').val();
    var ReviseCustomerCountry = $('#ReviseCustomerCountry').val();

    var ReviseDeliveryMethod = $('#ReviseDeliveryMethod').val();
    var ReviseValidityPeriod = $('#ReviseValidityPeriod').val();

    //LOAD CUSTOMER
    var cQCPerson = $("#cQCPerson");
    cQCPerson.empty();
    cQCPerson.append($("<option></option").val("").html("Select Contact Person"));

    //LOAD CUSTOMER NAME
    var cQCName = $("#cQCName");
    cQCName.empty();
    cQCName.append($("<option></option").val("").html("Select Customer"));

    //LOAD VALIDITY PERIOD
    var ddsvalidityPeriod = $("#validityPeriod");
    ddsvalidityPeriod.empty();
    ddsvalidityPeriod.append($("<option></option").val("").html("Select Validity Period"));

    //LOAD VALIDITY PERIOD
    var ddsdeliveryMethod = $("#deliveryMethod");
    ddsdeliveryMethod.empty();
    ddsdeliveryMethod.append($("<option></option").val("").html("Select Delivery Method"));

    //LOAD PACKAGE
    var ddsPackage = $("#packID");
    ddsPackage.empty();
    ddsPackage.append($("<option></option").val("").html("Select Package"));

    //LOAD PROJECT
    var projectID = $("#poProID");
    projectID.empty();
    projectID.append($("<option></option").val("").html("Select Project"));

    var projIDJson = {
        ProjectID: ReviseProjectID
    }

    $.ajax({
        url: '/ManagePO/getAllDataList/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(projIDJson),
        dataType: "json",
        success: function (data) {
            //Package
            $.each(data.Package, function (i, val) {
                ddsPackage.append(
                    $("<option></option>").val(val.PackageId).html(val.PackageName)
                );
            });
            //Validity Period
            $.each(data.lstVP, function (i, val) {
                ddsvalidityPeriod.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            ddsvalidityPeriod.val(ReviseValidityPeriod);
            //Delivery Method
            $.each(data.lstDM, function (i, val) {
                ddsdeliveryMethod.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            ddsdeliveryMethod.val(ReviseDeliveryMethod);
            //Project
            $.each(data.Project, function (i, val) {
                projectID.append(
                    $("<option></option>").val(val.ProjectId).html(val.ProjectName)
                );
            });
            projectID.val(ReviseProjectID);
            //Contact Person & Name
            $.each(data.Customer, function (i, val) {
                cQCPerson.append(
                    $("<option></option>").val(val.User_ID).html(val.Name)
                );
                cQCName.append(
                    $("<option></option>").val(val.U_CompanyID).html(val.U_CompanyName)
                );
            });
            cQCPerson.val(ReviseContactPersonID);
            cQCName.val(ReviseCustomerName);
        },
        error: function () {
        }
    });

    //LOAD PACKAGE GRID
    $.ajax({
        url: '/Quotation/GetRevisePackageGrid',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(),
        dataType: 'json',
        success: function (result) {
            defineGridProject(result);
            if ($("#packageGridTbl")[0].grid) {
                // grid is initialized
                var tGrid = jQuery("#packageGridTbl")[0];
                tGrid.addJSONData(result);
            }
            else {
                defineGridProject(result);
            }
        },
        error: function (errorThrown) {
        }
    });

});

$("#poProID").change(function () {

    var PackageID = $("#packID");
    PackageID.empty();
    PackageID.append($("<option></option").val("").html("Select Package"));

    var projectID = $("#poProID").val();
    if (!isNaN(projectID)) {
        var ProjectJson = {
            ProjectID: projectID
        }
        $.ajax({
            url: '/Quotation/GetPackage/',
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ProjectJson),
            dataType: "json",
            success: function (data) {
                $.each(data.Package, function (i, val) {
                    PackageID.append(
                        $("<option></option>").val(val.PackageId).html(val.PackageName)
                    );
                });
            },
            error: function () {
            }
        });
    }
});

$('#btnAddPackage').click(function () {

    var btnAddPackage = $("#btnAddPackage");
    var btnUpdatePackage = $("#btnUpdatePackage");
    var vPackID = $("#packID");
    var vPackQuantity = $("#packQuantity");
    var vPackRemarks = $("#packRemarks");
    var vPackUnitPrice = $("#packUnitPrice");
    var vPackGSTPrice = $("#packGSTPrice");
    var vPackPrice = $("#packPrice");
    var visDBExist = $("#visDBExist");
    var deliveryTotal = $("#deliveryTotal");
    var vsNO = $("#vsNO");

    var addScriptQuot = {
        sNo: $('#vsNO').val(),
        packageID: $('#packID').val(),
        Quantity: $('#packQuantity').val(),
        UnitPrice: $('#packUnitPrice').val(),
        Price: $('#packPrice').val(),
        Remarks: $('#packRemarks').val(),
        isDBExist: $('#visDBExist').val()
    };

    $.ajax({
        url: '/Quotation/PackageAdd',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addScriptQuot),
        dataType: 'json',
        success: function (result) {
            defineGridProject(result.Package);
            if ($("#packageGridTbl")[0].grid) {
                // grid is initialized
                var tGrid = jQuery("#packageGridTbl")[0];
                tGrid.addJSONData(result.Package);
            }
            else {
                defineGridProject(result.Package);
            }
            deliveryTotal.val(result.TotalPrice);
            vPackQuantity.val("0"); vPackRemarks.val(""); vPackUnitPrice.val(""); vPackGSTPrice.val(""); vPackPrice.val("");
        },
        error: function (errorThrown) {
        }
    });
});
$('#btnUpdatePackage').click(function () {

    var btnAddPackage = $("#btnAddPackage");
    var btnUpdatePackage = $("#btnUpdatePackage");
    var vPackID = $("#packID");
    var vPackQuantity = $("#packQuantity");
    var vPackRemarks = $("#packRemarks");
    var vPackUnitPrice = $("#packUnitPrice");
    var vPackGSTPrice = $("#packGSTPrice");
    var vPackPrice = $("#packPrice");
    var visDBExist = $("#visDBExist");
    var deliveryTotal = $("#deliveryTotal");
    var vsNO = $("#vsNO");

    var addScriptQuot = {
        sNo: $('#vsNO').val(),
        packageID: $('#packID').val(),
        Quantity: $('#packQuantity').val(),
        UnitPrice: $('#packUnitPrice').val(),
        Price: $('#packPrice').val(),
        Remarks: $('#packRemarks').val(),
        isDBExist: $('#visDBExist').val()
    };

    $.ajax({
        url: '/Quotation/PackageUpdate',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addScriptQuot),
        dataType: 'json',
        success: function (result) {
            defineGridProject(result.Package);
            if ($("#packageGridTbl")[0].grid) {
                // grid is initialized
                var tGrid = jQuery("#packageGridTbl")[0];
                tGrid.addJSONData(result.Package);
            }
            else {
                defineGridProject(result.Package);
            }
            vPackQuantity.val("0"); vPackRemarks.val(""); vPackUnitPrice.val(""); vPackGSTPrice.val(""); vPackPrice.val("");
            deliveryTotal.val(result.TotalPrice);
            btnAddPackage.show();
            btnUpdatePackage.hide();
        },
        error: function (errorThrown) {
            alert(errorThrown)
        }
    });
});

// PACKAGE GRID
var defineGridProject = function (data) {
    var pagerFooter = "#packageGridFooter";
    grid = $("#packageGridTbl");
    grid.jqGrid({
        datatype: 'local',
        data: data,
        colNames: ["", "", "Package Name", "Quantity", "Unit Price(RM)", "Price(RM)", "Remarks", "Edit", "Delete"],
        colModel: [
        { name: 'sNo', index: 'sNo', hidden: true, align: 'center', sorttype: 'int' },
        { name: 'packageID', index: 'packageID', hidden: true },
        { name: 'PackageName', index: 'PackageName', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
        { name: 'Quantity', index: 'Quantity', align: 'center' },
        { name: 'UnitPrice', index: 'UnitPrice', align: 'right', width:110 },
        { name: 'Price', index: 'Price', align: 'right', width: 110 },
        { name: 'Remarks', index: 'Remarks', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
        { name: 'act', index: 'act', width: 80, align: 'center' },
        { name: 'act2', index: 'act2', width: 80, align: 'center' }
        ],
        rowNum: 50,
        gridview: true,
        rownumbers: true,
        sortname: 'PackageName',
        viewrecords: true,
        sortorder: 'desc',
        height: '100%',
        altRows: true,
        //pager: pagerFooter,
        caption: "List Of Package",
        search: true,
        jsonReader: { cell: "" },
        gridComplete: function () {
            var ids = jQuery("#packageGridTbl").jqGrid('getDataIDs');
            var rowData = jQuery("#packageGridTbl").jqGrid('getRowData');
            for (var i = 0; i < ids.length; i++) {
                me = "<button type='button' style='color:red' onclick=\"updatePackage('" + ids[i] + "')\">EDIT</button>"
                mo = "<button type='button' style='color:red' onclick=\"delPackage('" + ids[i] + "')\">DELETE</button>"
                jQuery("#packageGridTbl").jqGrid('setRowData', ids[i], { act2: mo });
                jQuery("#packageGridTbl").jqGrid('setRowData', ids[i], { act: me });
            }
        }
    });
    jQuery(".ui-jqgrid").removeClass("ui-widget ui-widget-content");
    jQuery(".ui-jqgrid").removeClass("ui-widget-content");
    $("#packageGridTbl").closest('.ui-jqgrid-bdiv').width($("#packageGridTbl").closest('.ui-jqgrid-bdiv').width() + 1);

}
function updatePackage(rowId) {
    var data = $("#packageGridTbl").jqGrid('getRowData', rowId);
    var btnAddPackage = $("#btnAddPackage");
    var btnUpdatePackage = $("#btnUpdatePackage");

    var vPackID = $("#packID");
    var vPackQuantity = $("#packQuantity");
    var vPackRemarks = $("#packRemarks");
    var vPackUnitPrice = $("#packUnitPrice");
    var vPackGSTPrice = $("#packGSTPrice");
    var vPackPrice = $("#packPrice");
    var visDBExist = $("#visDBExist");
    var vsNO = $("#vsNO");
    var ids = "";

    $.ajax({
        type: 'POST',
        url: "../Quotation/GetPackageGridValue?id=" + data.sNo,
        success: function (resp) {
            if (resp.Result == "OK") {
                vPackQuantity.val(""); vPackRemarks.val(""); vPackUnitPrice.val(""); vPackGSTPrice.val(""); vPackPrice.val("");
                ids = resp.pVal[0].packageID;
                vPackID.val(ids);
                vPackQuantity.val(resp.pVal[0].Quantity);
                vPackRemarks.val(resp.pVal[0].Remarks);
                vPackUnitPrice.val(resp.pVal[0].UnitPrice);
                vPackGSTPrice.val(resp.pVal[0].GST);
                vPackPrice.val(resp.pVal[0].Price);
                if (resp.pVal[0].isDBExist == "Y") {
                    visDBExist.val(resp.pVal[0].isDBExist);
                } else {
                    visDBExist.val("N");
                }
                vsNO.val(resp.pVal[0].sNo);
                btnAddPackage.hide();
                btnUpdatePackage.show();
                $("#packageGridTbl").jqGrid('delRowData', rowId);
            }
            else {
                alert("You're allowed to update only once at a time");
            }
        },
        error: function (error) {
        }
    });
}
function delPackage(rowId) {
    bootbox.confirm("Are You Sure?", function (result) {
        if (result) {
            var deliveryTotal = $("#deliveryTotal");
            var data = $("#packageGridTbl").jqGrid('getRowData', rowId);
            $.ajax({
                type: 'POST',
                url: "../Quotation/PackageDel?id=" + data.sNo,
                success: function (resp) {
                    defineGridProject(resp.QList);
                    if ($("#packageGridTbl")[0].grid) {
                        var tGrid = jQuery("#packageGridTbl")[0];
                        tGrid.addJSONData(resp.QList);
                    }
                    else {
                        defineGridProject(resp.QList);
                    }
                    deliveryTotal.val(resp.TotalPrice);
                },
                error: function (error) {
                }
            });
        }
    });
}

// ADD DELIVERY METHOD
$('#btnAddDelivery').click(function (e) {
    e.preventDefault();

    $('#AddDeliveryModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
$('#saveNewDelivery').click(function (e) {
    e.preventDefault();

    var addNewDM = {
        newDM: $('#newDM').val()
    };

    $.ajax({
        url: '/Quotation/NewDeliveryMethod',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addNewDM),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                //LOAD DELIVERY METHOD
                var ddsdeliveryMethod = $("#deliveryMethod");
                ddsdeliveryMethod.empty();
                ddsdeliveryMethod.append($("<option></option").val("").html("Select Delivery Method"));

                $.ajax({
                    url: '/Quotation/GetDeliveryMethod/',
                    type: "POST",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(),
                    dataType: "json",
                    success: function (data) {
                        $.each(data.lstDM, function (i, val) {
                            ddsdeliveryMethod.append(
                                $("<option></option>").val(val.Value).html(val.Value)
                            );
                        });
                    },
                    error: function () {
                    }
                });

                toastr["success"]("New Delivery Method SAVED");
                $('#AddDeliveryModal').modal('hide');
            } else {
                toastr["error"]("Error while save");
            }
        },
        error: function (errorThrown) {
        }
    });
});

// ADD VALIDITY PERIOD
$('#btnAddValidity').click(function (e) {
    e.preventDefault();

    $('#AddValidityModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
$('#saveNewValidity').click(function (e) {
    e.preventDefault();

    var addnewVP = {
        newVP: $('#newVP').val()
    };

    $.ajax({
        url: '/Quotation/NewValidityPeriod',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addnewVP),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                //LOAD VALIDITY PERIOD
                var ddsvalidityPeriod = $("#validityPeriod");
                ddsvalidityPeriod.empty();
                ddsvalidityPeriod.append($("<option></option").val("").html("Select Validity Period"));

                $.ajax({
                    url: '/Quotation/GetValidityPeriod/',
                    type: "POST",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(),
                    dataType: "json",
                    success: function (data) {
                        $.each(data.lstVP, function (i, val) {
                            ddsvalidityPeriod.append(
                                $("<option></option>").val(val.Value).html(val.Value)
                            );
                        });
                    },
                    error: function () {
                    }
                });

                toastr["success"]("New Validity Period SAVED");
                $('#AddValidityModal').modal('hide');
            } else {
                toastr["error"]("Error while save");
            }
        },
        error: function (errorThrown) {
        }
    });
});

$("#cQCName").change(function () {

    var cQCName = parseInt($("#cQCName").val());
    if (!isNaN(cQCName)) {
        $.ajax({
            url: '../Quotation/GetCustomerDetails/',
            type: "POST",
            data: { CustomerID: cQCName },
            dataType: "json",
            success: function (data) {
                $('#cQAdd').val(data.Company[0].U_Addr);
                $('#cQCity').val(data.Company[0].U_City);
                $('#cQPCode').val(data.Company[0].U_Postcode);
                $('#cQState').val(data.Company[0].U_State);
                $('#cQCountry').val(data.Company[0].U_Country);
                $('#cQTelO').val(data.Company[0].U_Mobile_No);
                $('#cQTelM').val(data.Company[0].U_Fax_No);
            },
            error: function () {
            }
        });
    }
});
$("#btnCalculate").click(function () {

    if ($("#packQuantity").val() == "") {
        bootbox.alert("Insert Quantity");
        return false;
    }
    var packID = parseInt($("#packID").val());
    var packQuantity = parseInt($("#packQuantity").val());
    if (!isNaN(packID)) {
        $.ajax({
            url: '../Quotation/GetPackageDetails/',
            type: "POST",
            data: { PackageID: packID, Quantity: packQuantity },
            dataType: "json",
            success: function (data) {
                $('#packUnitPrice').val(data.UnitPrice);
                $('#packGSTPrice').val(data.GSTPrice);
                $('#packPrice').val(data.TotalPrice);
            },
            error: function () {
            }
        });
    }
});

//SAVE CREATE NEW QUOTATION
$('#btnReviseQuotation').click(function (e) {
    e.preventDefault();

    var invoiceVal = "";
    var selectedInv = $("input[type='radio'][name='radio1']:checked");
    if (selectedInv.length > 0) {
        invoiceVal = selectedInv.val();
    }

    var proProjectID = $('#poProID').val();
    var ReviseProjectID = $('#ReviseProjectID').val();

    if ($("#HideUploadCondition").val() == "Y") {
        ReviseProjectID = proProjectID;
    }

    var r = confirm("Are you sure UPLOAD PURCHASE ORDER?");
    if (r == true) {

        $.LoadingOverlay("show");

        var quotationJson = {
            projectID: ReviseProjectID,

            poNumber: $('#poNumber').val(),
            poTitle: $('#poTitle').val(),
            poDate: $('#poDate').val(),

            cQNo: $('#cQNo').val(),
            cQCPerson: $('#cQCPerson').val(),
            cQCName: $('#cQCName').val(),
            cQAdd: $('#cQAdd').val(),
            cQCity: $('#cQCity').val(),
            cQPCode: $('#cQPCode').val(),
            cQState: $('#cQState').val(),
            cQCountry: $('#cQCountry').val(),
            cQTelO: $('#cQTelO').val(),

            packID: $('#packID').val(),
            packRemarks: $('#packRemarks').val(),
            packUnitPrice: $('#packUnitPrice').val(),
            packGSTPrice: $('#packGSTPrice').val(),
            packPrice: $('#packPrice').val(),

            deliveryMethod: $('#deliveryMethod').val(),
            validityPeriod: $('#validityPeriod').val(),
            deliveryPayment: $('#deliveryPayment').val(),
            deliveryTotal: $('#deliveryTotal').val(),

            quotationID: $('#ReviseQuotationID').val(),
            invoiceType: invoiceVal
        };
        $.ajax({
            url: '/ManagePO/saveReviseQuotation',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(quotationJson),
            dataType: 'json',
            success: function (data) {
                if (data.Result == "OK") {
                    $.LoadingOverlay("hide");
                    bootbox.dialog({
                        message: data.Message,
                        title: "<i class='fa fa-info-circle'></i>" + "Info",
                        buttons: {
                            ok: {
                                label: "OK",
                                className: "btn-success",
                                callback: function () {
                                    window.location.replace("../ManagePO/QuotationList");
                                }
                            }
                        }
                    });
                }
                else if ((data.Result == "ERROR")) {
                    $.LoadingOverlay("hide");
                    toastr["error"](data.Message);
                }
                else {
                    $.LoadingOverlay("hide");
                    toastr["warning"]("Invalid ERROR");
                }
            },
            error: function (errorThrown) {
                $.LoadingOverlay("hide");
                toastr["error"]("Record failed to save by AJAX")
            }
        });
    } else {
    }
});
$('#poFileUpload').on('change', function (e) {
    var files = e.target.files;
    var type = "";
    var myID = "PO Files"; //uncomment this to make sure the ajax URL works
    if (files.length > 0) {
        if (window.FormData !== undefined) {
            var data = new FormData();
            for (var x = 0; x < files.length; x++) {
                data.append("file" + x, files[x]);
                if (files[x].size > 1000000) {
                    toastr["error"]("File size is more than 1MB");
                    return false;
                }
                type = files[x].type;
                if (type == "application/pdf" || type == "image/jpeg" || type == "image/png") {

                }
                else {
                    toastr["error"]("File type allowed only pdf,png,jpg");
                    $('#poFileUpload').val("");
                    return false;
                }
            }

            $.ajax({
                type: "POST",
                url: '/ManagePO/POFiles?id=' + myID,
                contentType: false,
                processData: false,
                data: data,
                success: function (result) {
                    if (result.status == "Failed") {
                        $('#poFileUpload').val("");
                        toastr["error"]("Failed to upload PO");
                    }
                    else {
                        toastr["success"]("PO Upload Success");
                    }
                },
                error: function (xhr, status, p3, p4) {
                    var err = "Error " + " " + status + " " + p3 + " " + p4;
                    if (xhr.responseText && xhr.responseText[0] == "{")
                        err = JSON.parse(xhr.responseText).Message;
                    console.log(err);
                }
            });
        } else {
            alert("This browser doesn't support HTML5 file uploads!");
        }
    }
});