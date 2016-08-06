$(window).load(function () {

    //LOAD CUSTOMER
    var cQCName = $("#cQCName");
    cQCName.empty();
    cQCName.append($("<option></option").val("").html("Select Company"));

    var cQCPerson = $("#cQCPerson");
    cQCPerson.empty();
    cQCPerson.append($("<option></option").val("").html("Select Contact Person"));

    //$('cQCName').select2({
    //    placeholder: 'Select an option'
    //});

    $.ajax({
        url: '/NewQuotation/GetCustomer/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: "json",
        success: function (data) {
            $.each(data.Customer, function (i, val) {
                cQCName.append(
                    $("<option></option>").val(val.U_CompanyID).html(val.U_CompanyName)
                );
            });
        },
        error: function () {
        }
    });

    //LOAD Description Title
    var ddsTitles = $("#TitleID");
    ddsTitles.empty();
    ddsTitles.append($("<option></option").val("").html("Select Title"));

    $.ajax({
        url: '/NewQuotation/GetTitle/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: "json",
        success: function (data) {
            $.each(data.Titles, function (i, val) {
                ddsTitles.append(
                    $("<option></option>").val(val.TitleID).html(val.TitleName)
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
        url: '/NewQuotation/GetProject/',
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
        url: '/NewQuotation/GetPackage/',
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
        url: '/NewQuotation/GetDeliveryMethod/',
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
        url: '/NewQuotation/GetValidityPeriod/',
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

var linestart = function (txt, st) {
    var ls = txt.split("\n");
    var i = ls.length - 1;
    ls[i] = st + ls[i];
    return ls.join("\n");
};
$('textarea').on('keydown', function (e) {
    var t = $(this);
    if (e.which == 13) {
        t.val(linestart(t.val(), '• ') + "\n");
        return false;
    }
});

$('#packQuantity').on('input', function () {

    if ($("#packID").val() == "") {
        toastr["error"]("Pacakage / service name is required. Please enter first");
        return false;
    }

    var packUnitPrice = $("#packUnitPrice").val();
    var packQuantity = $("#packQuantity").val();
    if (!isNaN(packUnitPrice)) {
        $.ajax({
            url: '../NewQuotation/GetTotalPriceDetails/',
            type: "POST",
            data: { UnitPrice: packUnitPrice, Quantity: packQuantity },
            dataType: "json",
            success: function (data) {
                $('#packPrice').val(data.TotalPrice);
            },
            error: function () {
            }
        });
    }
});

$("#projectID").change(function () {

    var vPackQuantity = $("#packQuantity");
    var vPackRemarks = $("#packRemarks");
    var vPackUnitPrice = $("#packUnitPrice");
    var vPackGSTPrice = $("#packGSTPrice");
    var vPackPrice = $("#packPrice");

    var PackageID = $("#packID");
    PackageID.empty();
    PackageID.append($("<option></option").val("").html("Select Package"));

    var projectID = $("#projectID").val();
    if (!isNaN(projectID)) {
        var ProjectJson = {
            ProjectID: projectID
        }
        $.ajax({
            url: '/NewQuotation/GetPackage/',
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
                vPackQuantity.val("0"); vPackRemarks.val(""); vPackUnitPrice.val(""); vPackGSTPrice.val(""); vPackPrice.val("");
            },
            error: function () {
            }
        });
    }
});

$("#cQCName").change(function () {
    var cQCName = parseInt($("#cQCName").val());
    if (!isNaN(cQCName)) {
        var cQCPerson = $("#cQCPerson");
        cQCPerson.empty();
        cQCPerson.append($("<option></option").val("").html("Select Contact Person"));

        $.ajax({
            url: '../Project/GetContactPerson/',
            type: "POST",
            data: { CustomerID: cQCName },
            dataType: "json",
            success: function (data) {
                $.each(data.User, function (i, val) {
                    cQCPerson.append(
                        $("<option></option>").val(val.User_ID).html(val.Name)
                    );
                });
            },
            error: function () {
            }
        });
    }
});

$('#btnAddPackage').click(function () {

    if ($("#TitleID").val() == "") {
        alert("Title name is required. Please Select Title");
        return false;
    }

    if ($("#packID").val() == "") {
        alert("Pacakge or Service name is required.");
        return false;
    }



    if ($("#packUnitPrice").val() == "") {
        alert("Unit Price / Quantity cannot be 0");
        return false;
    }

    var btnAddPackage = $("#btnAddPackage");
    var btnUpdatePackage = $("#btnUpdatePackage");
    var vTitleID = $("#TitleID");
    var vPackID = $("#packID");
    var vPackQuantity = $("#packQuantity");
    var vPackRemarks = $("#packRemarks");
    var vPackUnitPrice = $("#packUnitPrice");
    var vPackPrice = $("#packPrice");
    var visDBExist = $("#visDBExist");
    var vsNO = $("#vsNO");
    var selectedGT = "";
    var IsOthers = $("input[type='radio'][name='IsOthers']:checked");
    if (IsOthers.length > 0) {
        selectedGT = IsOthers.val();
    }

    var addScriptQuot = {
        sNo: $('#vsNO').val(),
        TitleID: $('#TitleID').val(),
        isOthers: selectedGT,
        PackageName: $('#packID').val(),
        Quantity: $('#packQuantity').val(),
        UnitPrice: $('#packUnitPrice').val(),
        Price: $('#packPrice').val(),
        Remarks: $('#packRemarks').val(),
        isDBExist: $('#visDBExist').val()
    };

    $.ajax({
        url: '/NewQuotation/ProjectPackageAdd',
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
            vPackID.val(''); vPackQuantity.val(''); vPackRemarks.val(''); vPackUnitPrice.val(''); vPackPrice.val('');
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
        GSTPrice: $('#packGSTPrice').val(),
        Price: $('#packPrice').val(),
        Remarks: $('#packRemarks').val(),
        isDBExist: $('#visDBExist').val()
    };

    $.ajax({
        url: '/NewQuotation/PackageUpdate',
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
                tGrid.addJSOND1ata(result.Package);
            }
            else {
                defineGridProject(result.Package);
            }
            vPackQuantity.val(''); vPackRemarks.val(''); vPackUnitPrice.val(''); vPackGSTPrice.val(''); vPackPrice.val('');
            deliveryTotal.val(result.TotalPrice);
            btnAddPackage.show();
            btnUpdatePackage.hide();
        },
        error: function (errorThrown) {
        }
    });
});

var defineGridProject = function (data) {
    grid = $("#packageGridTbl");
    grid.jqGrid({
        datatype: 'local',
        data: data,
        colNames: ["", "","Title Name", "Package Name", "Quantity", "Unit Price (RM)", "GST (RM)", "Price (RM)", "Remarks", "Edit", "Delete"],
        colModel: [
        { name: 'sNo', index: 'sNo', hidden: true, align: 'center', sorttype: 'int' },
        { name: 'TitleID', index: 'TitleID', hidden: true, align: 'center', sorttype: 'int' },
        { name: 'TitleName', index: 'TitleName', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
        { name: 'PackageName', index: 'PackageName', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
        { name: 'Quantity', index: 'Quantity', align: 'center', width: 80 },
        { name: 'UnitPrice', index: 'UnitPrice', align: 'right', width: 110 },
        { name: 'GSTPrice', index: 'GSTPrice',hidden: true, align: 'right', width: 110 },
        { name: 'Price', index: 'Price', align: 'right', width: 110 },
        { name: 'Remarks', index: 'Remarks', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
        { name: 'act', index: 'act', width: 80 },
        { name: 'act2', index: 'act2', width: 80 }
        ],
        rowNum: 50,
        gridview: true,
        rownumbers: true,
        sortname: 'TitleName',
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
        url: "../NewQuotation/GetPackageGridValue?id=" + data.sNo,
        success: function (resp) {
            if (resp.Result == "OK") {
                vPackQuantity.val(""); vPackRemarks.val(""); vPackUnitPrice.val(""); vPackGSTPrice.val(""); vPackPrice.val("");
                ids = resp.pVal[0].packageID;
                vPackID.val(ids);
                vPackQuantity.val(resp.pVal[0].Quantity);
                vPackRemarks.val(resp.pVal[0].Remarks);
                vPackUnitPrice.val(resp.pVal[0].UnitPrice);
                vPackGSTPrice.val(resp.pVal[0].GSTPrice);
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
                url: "../NewQuotation/PackageDel?id=" + data.sNo,
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

// ADD Title METHOD
$('#btnAddTitle').click(function (e) {
    e.preventDefault();

    $('#createTitleModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});

$('#btnSaveCreateTitle').click(function (e) {
    e.preventDefault();

    if ($("#TitleName").val() == "") {
        bootbox.alert("Insert Title Name");
        return false;
    }

    var addNewTitleName = {
        TitleName: $('#TitleName').val()
    };

    $.ajax({
        url: '/NewQuotation/InsertNewTitleName',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addNewDM),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                //LOAD title METHOD
                var ddsTitles = $("#TitleID");
                ddsTitles.empty();
                ddsTitles.append($("<option></option").val("").html("Select Title"));

                $.ajax({
                    url: '/NewQuotation/GetTitle/',
                    type: "POST",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(),
                    dataType: "json",
                    success: function (data) {
                        $.each(data.Titles, function (i, val) {
                            ddsTitles.append(
                                $("<option></option>").val(val.TitleID).html(val.TitleName)
                            );
                        });
                    },
                    error: function () {
                    }
                });

                toastr["success"]("New Delivery Method SAVED");
                $('#createTitleModal').modal('hide');
            } else {
                toastr["error"]("Error while save");
            }
        },
        error: function (errorThrown) {
        }
    });
});



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
        url: '/NewQuotation/NewDeliveryMethod',
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
                    url: '/NewQuotation/GetDeliveryMethod/',
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
        url: '/NewQuotation/NewValidityPeriod',
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
                    url: '/NewQuotation/GetValidityPeriod/',
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
            url: '../NewQuotation/GetCustomerDetails/',
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

                $('#ContactPersonName').val(data.Company[0].Name);
                $('#cQCPerson').val(data.Company[0].User_ID);
            },
            error: function () {
            }
        });
    }
});

$("#packUnitPrice").change(function () {

   
    var packUnitPrice = $("#packUnitPrice").val();
    var packQuantity = $("#packQuantity").val();
    if (!isNaN(packQuantity)) {
        $.ajax({
            url: '../NewQuotation/GetTotalPriceDetails/',
            type: "POST",
            data: { UnitPrice: packUnitPrice, Quantity: packQuantity },
            dataType: "json",
            success: function (data) {
                $('#packPrice').val(data.TotalPrice);
            },
            error: function () {
            }
        });
    }

});
$("#packQuantity").change(function () {

    if ($("#packUnitPrice").val() == "") {
        bootbox.alert("Unit Price is required.");
        return false;
    }
    var packUnitPrice = $("#packUnitPrice").val();
    var packQuantity = $("#packQuantity").val();
    if (!isNaN(packUnitPrice)) {
        $.ajax({
            url: '../NewQuotation/GetTotalPriceDetails/',
            type: "POST",
            data: { UnitPrice: packUnitPrice, Quantity: packQuantity },
            dataType: "json",
            success: function (data) {
                $('#packPrice').val(data.TotalPrice);
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
            url: '../NewQuotation/GetPackageDetails/',
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

$('#btnAddCustomer').click(function (e) {
    e.preventDefault();

    $('#createusermodal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});

$('#GrandTotalY').on('ifChecked', function (event) {
    $("#GrandTotalDisplay").show();
});
$('#GrandTotalN').on('ifChecked', function (event) {
    $("#GrandTotalDisplay").hide();
});

//SAVE CREATE NEW QUOTATION
$('#btnSaveNewProjectQuotation').click(function (e) {
    e.preventDefault();

    bootbox.confirm("Are you sure CREATE NEW QUOTATION?", function (result) {
        if (result) {
            $.LoadingOverlay("show");

            
            //var selectedGT = "";
            //var GrandTotal = $("input[type='radio'][name='GrandTotal']:checked");
            //if (GrandTotal.length > 0) {
            //    selectedGT = GrandTotal.val();
            //}

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


                TitleID: $("#TitleID").val,
                packID: $('#packID').val(),
                packRemarks: $('#packRemarks').val(),
                packUnitPrice: $('#packUnitPrice').val(),
                packPrice: $('#packPrice').val(),

               
            };
            $.ajax({
                url: '/NewQuotation/saveNewProjectQuotation',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(quotationJson),
                dataType: 'json',
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
                                        window.location.replace("../NewQuotation/ListOfQuotation");
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
            alert("Unit Price / Quantity cannot be 00 43");
        }
    });
});