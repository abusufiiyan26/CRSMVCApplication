$(window).load(function () {

    //LOAD CUSTOMER
    var cQCName = $("#cQCName");
    cQCName.empty();
    cQCName.append($("<option></option").val("").html("Select Company"));

    var cQCPerson = $("#cQCPerson");
    cQCPerson.empty();
    cQCPerson.append($("<option></option").val("").html("Select Contact Person"));

    //LOAD MEDIA
    var MediaID = $("#MediaID");
    MediaID.empty();
    MediaID.append($("<option></option").val("").html("Select Media"));

    //LOAD PRODUCT
    var packID = $("#packID");
    packID.empty();
    packID.append($("<option></option").val("").html("Select Product"));

    $.ajax({
        url: '/NewQuotation/GeneralGetInfoData/',
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
            $.each(data.Media, function (i, val) {
                MediaID.append(
                    $("<option></option>").val(val.MediaID).html(val.MediaName)
                );
            });
            $.each(data.Product, function (i, val) {
                packID.append(
                    $("<option></option>").val(val.ProductName).html(val.ProductName)
                );
            });
        },
        error: function () {
        }
    });

    //LOAD PACKAGE
    var ddsPackage = $("#packID");
    ddsPackage.empty();
    ddsPackage.append($("<option></option").val("").html("Select Product"));

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

});

var linestart = function (txt, st) {
    var ls = txt.split("\n");
    var i = ls.length - 1;
    ls[i] = st + ls[i];
    return ls.join("\n");
};
$('textarea').on('keydown', function(e) {
    var t = $(this);
    if (e.which == 13) {
        t.val(linestart(t.val(), '• ') + "\n");
        return false;
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

$('#packQuantity').on('input', function () {

    var packID = parseInt($("#packID").val());
    var packQuantity = parseInt($("#packQuantity").val());
    var packUnitPrice = $("#packUnitPrice").val();

    if (!isNaN(packUnitPrice)) {
        $.ajax({
            url: '../NewQuotation/GeneralProductCalculate/',
            type: "POST",
            data: { ProductID: packID, Quantity: packQuantity, UnitPrice: packUnitPrice },
            dataType: "json",
            success: function (data) {
                //$('#packUnitPrice').val(data.UnitPrice);
                $('#packGSTPrice').val(data.GSTPrice);
                $('#packPrice').val(data.TotalPrice);
            },
            error: function () {
            }
        });
    }
});
$('#packUnitPrice').on('input', function () {

    var packID = parseInt($("#packID").val());
    var packQuantity = parseInt($("#packQuantity").val());
    var packUnitPrice = $("#packUnitPrice").val();

    if (!isNaN(packQuantity)) {
        $.ajax({
            url: '../NewQuotation/GeneralProductCalculate/',
            type: "POST",
            data: { ProductID: packID, Quantity: packQuantity, UnitPrice: packUnitPrice },
            dataType: "json",
            success: function (data) {
                //$('#packUnitPrice').val(data.UnitPrice);
                $('#packGSTPrice').val(data.GSTPrice);
                $('#packPrice').val(data.TotalPrice);
            },
            error: function () {
            }
        });
    }
});

$('#btnAddPackage').click(function () {

    if ($("#packPrice").val() == "") {
        alert("Please enter quantity");
        return false;
    }

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
        PackageName: $('#packID').val(),
        Quantity: $('#packQuantity').val(),
        UnitPrice: $('#packUnitPrice').val(),
        Price: $('#packPrice').val(),
        Remarks: $('#packRemarks').val(),
        isDBExist: $('#visDBExist').val()
    };

    $.ajax({
        url: '/NewQuotation/GeneralPackageAdd',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addScriptQuot),
        dataType: 'json',
        success: function (result) {
            deliveryTotal.val(result.TotalPrice);
            defineGridProject(result.Package);
            if ($("#packageGridTbl")[0].grid) {
                // grid is initialized
                var tGrid = jQuery("#packageGridTbl")[0];
                tGrid.addJSONData(result.Package);
            }
            else {
                defineGridProject(result.Package);
            }
            vPackQuantity.val(''); vPackRemarks.val(''); vPackUnitPrice.val(''); vPackGSTPrice.val(''); vPackPrice.val('');
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
        PackageName: $('#packID').val(),
        Quantity: $('#packQuantity').val(),
        UnitPrice: $('#packUnitPrice').val(),
        GSTPrice: $('#packGSTPrice').val(),
        Price: $('#packPrice').val(),
        Remarks: $('#packRemarks').val(),
        isDBExist: $('#visDBExist').val()
    };

    $.ajax({
        url: '/NewQuotation/GeneralPackageUpdate',
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
        colNames: ["", "", "Product Name", "Quantity", "Unit Price (RM)", "GST (RM)", "Price (RM)", "Remarks", "Edit", "Delete"],
        colModel: [
        { name: 'sNo', index: 'sNo', hidden: true, align: 'center', sorttype: 'int' },
        { name: 'packageID', index: 'packageID', hidden: true, align: 'center', sorttype: 'int' },
        { name: 'PackageName', index: 'PackageName', width: 170, cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
        { name: 'Quantity', index: 'Quantity', align: 'center', width: 70 },
        { name: 'UnitPrice', index: 'UnitPrice', align: 'right', width: 100 },
        { name: 'GSTPrice', index: 'GSTPrice', align: 'right', width: 70 },
        { name: 'Price', index: 'Price', align: 'right', width: 100 },
        { name: 'Remarks', index: 'Remarks', width: 170, cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
        { name: 'act', index: 'act', width: 55, align: 'center' },
        { name: 'act2', index: 'act2', width: 55, align: 'center' }
        ],
        rowNum: 50,
        gridview: true,
        rownumbers: true,
        sortname: 'PackageName',
        viewrecords: true,
        sortorder: 'desc',
        height: '100%',
        altRows: true,
        shrinkToFit: false,
        width: null,
        //pager: pagerFooter,
        caption: "List Of Product",
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
    //$("#packageGridTbl").closest('.ui-jqgrid-bdiv').width($("#packageGridTbl").closest('.ui-jqgrid-bdiv').width() + 1);
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
        url: "../NewQuotation/GeneralPackageGridValue?id=" + data.sNo,
        success: function (resp) {
            if (resp.Result == "OK") {
                vPackQuantity.val(""); vPackRemarks.val(""); vPackUnitPrice.val(""); vPackGSTPrice.val(""); vPackPrice.val("");
                //ids = resp.pVal[0].packageID;
                //vPackID.val(ids);
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
                url: "../NewQuotation/GeneralPackageDel?id=" + data.sNo,
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

$('#btnAddProduct').click(function (e) {
    e.preventDefault();

    $('#createProductModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
$('#btnSaveCreateProduct').click(function (e) {
    e.preventDefault();

    var addProductJson = {
        MediaID: $('#MediaID').val(),
        ProductName: $('#ProductName').val()
    };

    $.ajax({
        url: '/NewQuotation/GeneralCreateProduct',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addProductJson),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                var packID = $("#packID");
                packID.empty();
                packID.append($("<option></option").val("").html("Select Product"));
                $.each(data.Product, function (i, val) {
                    packID.append(
                        $("<option></option>").val(val.ProductName).html(val.ProductName)
                    );
                });
                $('#MediaID').val('');
                $('#ProductName').val('');
                toastr["success"]("New Product Created Successfully");
            } else {
                toastr["error"](data.Message);
            }
        },
        error: function (errorThrown) {
            toastr["error"](errorThrown);
        }
    });
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
$('#btnSaveNewQuotation').click(function (e) {
    e.preventDefault();

    bootbox.confirm("Are you sure CREATE NEW QUOTATION?", function (result) {
        if (result) {
            $.LoadingOverlay("show");

            var selectedGT = "";
            var GrandTotal = $("input[type='radio'][name='GrandTotal']:checked");
            if (GrandTotal.length > 0) {
                selectedGT = GrandTotal.val();
            }

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

                packID: $('#packID').val(),
                packRemarks: $('#packRemarks').val(),
                packUnitPrice: $('#packUnitPrice').val(),
                packGSTPrice: $('#packGSTPrice').val(),
                packPrice: $('#packPrice').val(),

                deliveryMethod: $('#deliveryMethod').val(),
                validityPeriod: $('#validityPeriod').val(),
                deliveryPayment: $('#deliveryPayment').val(),
                deliveryTotal: $('#deliveryTotal').val(),

                termsCondition: $('#termsCondition').val(),
                IsGrandPrice: selectedGT
            };
            $.ajax({
                url: '/NewQuotation/SaveNewGeneralQuotation',
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
        }
    });
});