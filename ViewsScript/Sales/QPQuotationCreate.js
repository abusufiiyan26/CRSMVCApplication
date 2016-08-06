$(window).load(function () {

    //LOAD CUSTOMER
    var cQCPerson = $("#cQCPerson");
    cQCPerson.empty();
    cQCPerson.append($("<option></option").val("").html("Select Contact Person"));

    var cQCName = $("#cQCName");
    cQCName.empty();
    cQCName.append($("<option></option").val("").html("Select Customer"));

    $.ajax({
        url: '/Quotation/GetCustomer/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: "json",
        success: function (data) {
            $.each(data.User, function (i, val) {
                cQCPerson.append(
                    $("<option></option>").val(val.User_ID).html(val.Name)
                );
                cQCName.append(
                    $("<option></option>").val(val.User_ID).html(val.Name)
                );
            });
        },
        error: function () {
        }
    });

    //LOAD PROJECT
    var projectID = $("#projectID");
    projectID.empty();
    projectID.append($("<option></option").val("").html("Select Project"));

    $.ajax({
        url: '/Quotation/GetProject/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: "json",
        success: function (data) {
            $.each(data.Project, function (i, val) {
                projectID.append(
                    $("<option></option>").val(val.ProjectId).html(val.ProjectName)
                );
            });
        },
        error: function () {
        }
    });

    //LOAD PACKAGE
    var ddsPackage = $("#packID");
    ddsPackage.empty();
    ddsPackage.append($("<option></option").val("").html("Select Package"));

    $.ajax({
        url: '/Quotation/GetPackage/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: "json",
        success: function (data) {
            $.each(data.Package, function (i, val) {
                ddsPackage.append(
                    $("<option></option>").val(val.PackageId).html(val.PackageName)
                );
            });
        },
        error: function () {
        }
    });

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
});

$("#projectID").blur(function () {

    var PackageID = $("#packID");
    PackageID.empty();
    PackageID.append($("<option></option").val("").html("Select Package"));

    var projectID = parseInt($("#projectID").val());
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
$("#cQCName").change(function () {

    var cQCName = parseInt($("#cQCName").val());
    if (!isNaN(cQCName)) {
        $.ajax({
            url: '../Quotation/GetCustomerDetails/',
            type: "POST",
            data: { CustomerID: cQCName },
            dataType: "json",
            success: function (data) {
                $('#cQAdd').val(data.User[0].Address);
                $('#cQCity').val(data.User[0].City);
                $('#cQPCode').val(data.User[0].Postcode);
                $('#cQState').val(data.User[0].State);
                $('#cQCountry').val(data.User[0].Country);
                $('#cQTelO').val(data.Company[0].Mobile_No);
                $('#cQTelM').val(data.User[0].Mobile_No);
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

var defineGridProject = function (data) {
    grid = $("#packageGridTbl");
    grid.jqGrid({
        datatype: 'local',
        data: data,
        colNames: ["", "", "Package Name", "Quantity", "Unit Price", "Price", "Remarks", "Edit", "Delete"],
        colModel: [
        { name: 'sNo', index: 'sNo', hidden: true, align: 'center', sorttype: 'int' },
        { name: 'packageID', index: 'packageID', hidden: true, align: 'center', sorttype: 'int' },
        { name: 'PackageName', index: 'PackageName' },
        { name: 'Quantity', index: 'Quantity' },
        { name: 'UnitPrice', index: 'UnitPrice' },
        { name: 'Price', index: 'Price' },
        { name: 'Remarks', index: 'Remarks' },
        { name: 'act', index: 'act', width: 80 },
        { name: 'act2', index: 'act2', width: 80 }
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
$('#btnSaveNewQuotation').click(function (e) {
    e.preventDefault();

    var r = confirm("Are you sure to CREATE NEW PROJECT QUOTATION?");
    if (r == true) {

        $.LoadingOverlay("show");

        var quotationJson = {
            projectID: $('#projectID').val(),

            cQNo: $('#cQNo').val(),
            cQCPerson: $('#cQCPerson').val(),
            cQCName: $('#cQCName').val(),
            cQAdd: $('#cQAdd').val(),
            cQCity: $('#cQCity').val(),
            cQPCode: $('#cQPCode').val(),
            cQState: $('#cQState').val(),
            cQCountry: $('#cQCountry').val(),
            cQTelO: $('#cQTelO').val(),

            deliveryMethod: $('#deliveryMethod').val(),
            validityPeriod: $('#validityPeriod').val(),
            deliveryPayment: $('#deliveryPayment').val(),
            deliveryTotal: $('#deliveryTotal').val()
        };
        $.ajax({
            url: '/Quotation/saveQPQuotationCreate',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(quotationJson),
            dataType: 'json',
            cache: false,
            success: function (data) {
                if (data.Result == "OK") {
                    $.LoadingOverlay("hide");
                    bootbox.dialog({
                        message: "New Quotation Successfully Created",
                        title: "<i class='fa fa-info-circle'></i>" + "Info",
                        buttons: {
                            ok: {
                                label: "OK",
                                className: "btn-success",
                                callback: function () {
                                    window.location.replace("../Quotation/QuotationProject");
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