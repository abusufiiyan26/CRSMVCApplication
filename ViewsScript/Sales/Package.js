var vMethod = 1;

$(document).ready(function () {

    $('#DateFrom').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true
    });

    $('#DateTo').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true
    });

    //Get all List of Package for Create
    var ProjectID = $("#ProjectID");
    ProjectID.empty();
    ProjectID.append($("<option></option").val("").html("Select Project"));

    var MediaID = $("#MediaID");
    MediaID.empty();
    MediaID.append($("<option></option").val("").html("Select Media"));

    var PackageTypeID = $("#PackageTypeID");
    PackageTypeID.empty();
    PackageTypeID.append($("<option></option").val("").html("Select Package Type"));

    var CertTypeID = $("#CertTypeID");
    CertTypeID.empty();
    CertTypeID.append($("<option></option").val("").html("Select Cert Type"));

    var P_Product = $("#P_Product");
    P_Product.empty();
    var P_Validity = $("#P_Validity");
    P_Validity.empty();
    var P_CertLength = $("#P_CertLength");
    P_CertLength.empty();
    var P_Hardware = $("#P_Hardware");
    P_Hardware.empty();
    var P_Packaging = $("#P_Packaging");
    P_Packaging.empty();
    var P_API = $("#P_API");
    P_API.empty();
    var P_Guide = $("#P_Guide");
    P_Guide.empty();
    var P_AccessibleBy = $("#P_AccessibleBy");
    P_AccessibleBy.empty();

    $.ajax({
        url: '/Package/GetAllList/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: "json",
        success: function (data) {
            $.each(data.Project, function (i, val) {
                ProjectID.append(
                    $("<option></option>").val(val.ProjectId).html(val.ProjectName)
                );
            });
            $.each(data.CertType, function (i, val) {
                CertTypeID.append(
                    $("<option></option>").val(val.KeyData).html(val.Value)
                );
            });
            //$.each(data.Media, function (i, val) {
            //    MediaID.append(
            //        $("<option></option>").val(val.MediaID).html(val.MediaName)
            //    );
            //});
            $.each(data.PackageType, function (i, val) {
                PackageTypeID.append(
                    $("<option></option>").val(val.PackageTypeID).html(val.PackageTypeName)
                );
            });
            $.each(data.Product, function (i, val) {
                P_Product.append(
                    $("<option></option>").val(val.ProductCode).html(val.ProductName)
                );
            });
            $.each(data.Validity, function (i, val) {
                P_Validity.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            $.each(data.CertificateLength, function (i, val) {
                P_CertLength.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            $.each(data.Hardware, function (i, val) {
                P_Hardware.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            $.each(data.Packaging, function (i, val) {
                P_Packaging.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            $.each(data.API, function (i, val) {
                P_API.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            $.each(data.Guide, function (i, val) {
                P_Guide.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            $.each(data.Accessible, function (i, val) {
                P_AccessibleBy.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
        },
        error: function () {
        }
    });

    //Get all List of Package for Update
    var UpdateProjectID = $("#UpdateProjectID");
    UpdateProjectID.empty();
    UpdateProjectID.append($("<option></option").val("").html("Select Project"));

    var UpdateMediaID = $("#UpdateMediaID");
    UpdateMediaID.empty();
    UpdateMediaID.append($("<option></option").val("").html("Select Media"));

    var UpdatePackageTypeID = $("#UpdatePackageTypeID");
    UpdatePackageTypeID.empty();
    UpdatePackageTypeID.append($("<option></option").val("").html("Select Package Type"));

    var UpdateCertTypeID = $("#UpdateCertTypeID");
    UpdateCertTypeID.empty();
    UpdateCertTypeID.append($("<option></option").val("").html("Select Cert Type"));

    var UpdateP_Product = $("#UpdateP_Product");
    UpdateP_Product.empty();
    var UpdateP_Validity = $("#UpdateP_Validity");
    UpdateP_Validity.empty();
    var UpdateP_CertLength = $("#UpdateP_CertLength");
    UpdateP_CertLength.empty();
    var UpdateP_Hardware = $("#UpdateP_Hardware");
    UpdateP_Hardware.empty();
    var UpdateP_Packaging = $("#UpdateP_Packaging");
    UpdateP_Packaging.empty();
    var UpdateP_API = $("#UpdateP_API");
    UpdateP_API.empty();
    var UpdateP_Guide = $("#UpdateP_Guide");
    UpdateP_Guide.empty();
    var UpdateP_AccessibleBy = $("#UpdateP_AccessibleBy");
    UpdateP_AccessibleBy.empty();

    $.ajax({
        url: '/Package/GetAllList/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: "json",
        success: function (data) {
            $.each(data.Project, function (i, val) {
                UpdateProjectID.append(
                    $("<option></option>").val(val.ProjectId).html(val.ProjectName)
                );
            });
            $.each(data.Media, function (i, val) {
                UpdateMediaID.append(
                    $("<option></option>").val(val.MediaID).html(val.MediaName)
                );
            });
            $.each(data.CertType, function (i, val) {
                UpdateCertTypeID.append(
                    $("<option></option>").val(val.KeyData).html(val.Value)
                );
            });
            $.each(data.PackageType, function (i, val) {
                UpdatePackageTypeID.append(
                    $("<option></option>").val(val.PackageTypeID).html(val.PackageTypeName)
                );
            });
            $.each(data.Product, function (i, val) {
                UpdateP_Product.append(
                    $("<option></option>").val(val.ProductCode).html(val.ProductName)
                );
            });
            $.each(data.Validity, function (i, val) {
                UpdateP_Validity.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            $.each(data.CertificateLength, function (i, val) {
                UpdateP_CertLength.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            $.each(data.Hardware, function (i, val) {
                UpdateP_Hardware.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            $.each(data.Packaging, function (i, val) {
                UpdateP_Packaging.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            $.each(data.API, function (i, val) {
                UpdateP_API.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            $.each(data.Guide, function (i, val) {
                UpdateP_Guide.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            $.each(data.Accessible, function (i, val) {
                UpdateP_AccessibleBy.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
        },
        error: function () {
        }
    });

    var cachedCountryOptions = null;
    var cachedMediaOptions = null;
    var cachedTypeOptions = null;
    var cachedProductOptions = null;

    $('#StudentTableContainer').jtable({
        title: 'Package List',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'PackageId asc',
        actions: {
            listAction: '../Package/PackageList'
        },
        fields: {
            PackageId: {
                width: '5%',
                key: true,
                create: false,
                edit: false,
                del: false,
                list: true
            },
            DiBillsCode: {
                title: 'Product Code',
                width: '12%',
                list: true
            },
            ProjectName: {
                title: 'Project',
                width: '12%',
                list: true
            },
            PackageName: {
                title: 'Package',
                width: '23%'
            },
            MediaName: {
                title: 'Media',
                list: true
            },
            CertificateTypeName: {
                title: 'Procedure',
                width: '13%'
            },
            Validity: {
                title: 'Validity',
                width: '8%'
            },
            sTotalPrice: {
                title: 'Price (RM)',
                width: '9%'
            },
            IsActive: {
                title: 'Status',
                width: '10%',
                type: 'checkbox',
                values: { '0': 'Inactive', '1': 'Active', '2': 'Pending Procedure' },
                defaultValue: '1'
            },
            CustomAction: {
                title: '',
                width: '1%',
                sorting: false,
                create: false,
                edit: false,
                list: true,
                display: function (data) {
                    if (data.record) {
                        return '<img title="Edit Package" style="cursor:pointer;width:25px" onclick=\"getUpdate(' + data.record.PackageId + ')\" src="../Images/icon/edit.png" /">';
                    }
                }
            }
        }
    });

    //Load student list from server
    $('#StudentTableContainer').jtable('load');
});

$("#btnToFind").click(function () {

    if (vMethod == 1) {
        $('#StudentTableContainer').jtable('load', {
            DateFrom: $('#DateFrom').val(),
            DateTo: $('#DateTo').val(),
            ValueSearch: $('#searchID').val(),
            ValueToFind: $('#findID').val()
        });
    } else {
        $('#StudentTableContainer').jtable('load', {
            DateFrom: $('#DateFrom').val(),
            DateTo: $('#DateTo').val(),
            ValueSearch: $('#searchID').val(),
            ValueToFind: $('#findBID').val()
        });
    }
});

$("#ProjectID").change(function () {
    var ProjectID = parseInt($("#ProjectID").val());
    if (!isNaN(ProjectID)) {
        if (ProjectID == 1) {
            $("#HideCertType").show();
        } else {
            $("#HideCertType").hide();
            var MediaID = $("#MediaID");
            MediaID.empty();
            MediaID.append($("<option></option").val("").html("Select Media"));

            $.ajax({
                url: '../Package/GetMediaOnProject/',
                type: "POST",
                data: { CertTypeID: $("#CertTypeID").val() },
                dataType: "json",
                success: function (data) {
                    $.each(data.Media, function (i, val) {
                        MediaID.append(
                            $("<option></option>").val(val.MediaID).html(val.MediaName)
                        );
                    });
                },
                error: function () {
                }
            });
        }
    } else {
        var MediaID = $("#MediaID");
        MediaID.empty();
        MediaID.append($("<option></option").val("").html("Select Media"));
    }
});
$("#CertTypeID").change(function () {

    var MediaID = $("#MediaID");
    MediaID.empty();
    MediaID.append($("<option></option").val("").html("Select Media"));

    $.ajax({
        url: '../Package/GetMediaOnCertType/',
        type: "POST",
        data: { CertTypeID: $("#CertTypeID").val() },
        dataType: "json",
        success: function (data) {
            $.each(data.Media, function (i, val) {
                MediaID.append(
                    $("<option></option>").val(val.MediaID).html(val.MediaName)
                );
            });
        },
        error: function () {
        }
    });
});

$('#btnRefresh').click(function () {

    $('#StudentTableContainer').jtable('load');
});
$('#btnExportToExcel').click(function () {
    window.location.href = "../Package/PrintPackageToExcel";
});

//CREATE NEW PACKAGE
$('#btnCreatePackage').click(function () {
    //('#formProject')[0].reset();

    $('#createPackageModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
$('#btnSaveCreatePackage').click(function () {

    var formCreatePackage = $("#formCreatePackage");

    formCreatePackage.validate({
        rules: {
            ProjectID: {
                required: true
            },
            MediaID: {
                required: true
            },
            PackageTypeID: {
                required: true
            },
            PackageName: {
                required: true
            },
            P_Validity: {
                required: true
            },
            P_CertLength: {
                required: true
            },
            P_Price: {
                required: true
            },
            P_GST: {
                required: true
            },
            P_TotalPrice: {
                required: true
            },
        },
        messages: {
        }
    });

    if ($('#ProjectID').val() == 1) {
        if ($('#CertTypeID').val() == "") {
            toastr["error"]("Please select Certificate Type");
            return false;
        }
    }

    if (formCreatePackage.valid()) {
        var r = confirm("Are you sure to CREATE NEW PACKAGE");
        if (r == true) {
            $.LoadingOverlay("show");
            var addPackageJSON = {
                DibillsCode: $('#DibillsCode').val(),
                PackageName: $('#PackageName').val(),
                ProjectID: $('#ProjectID').val(),
                PackageID: $('#PackageID').val(),
                CertTypeID: $('#CertTypeID').val(),
                PackageTypeID: $('#PackageTypeID').val(),
                MediaID: $('#MediaID').val(),
                P_CertType: $('#P_CertType').val(),
                P_Product: $('#P_Product').val(),
                P_Validity: $('#P_Validity').val(),
                P_CertLength: $('#P_CertLength').val(),
                P_Hardware: $('#P_Hardware').val(),
                P_Packaging: $('#P_Packaging').val(),
                P_API: $('#P_API').val(),
                P_Guide: $('#P_Guide').val(),
                P_AccessibleBy: $('#P_AccessibleBy').val(),
                P_Price: $('#P_Price').val(),
                P_GST: $('#P_GST').val(),
                P_TotalPrice: $('#P_TotalPrice').val(),

                GeneralLedger: $('#GeneralLedger').val(),
                ProfitCenter: $('#ProfitCenter').val()
            };

            $.ajax({
                url: '/Package/CreatePackage',
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                cache: false,
                data: JSON.stringify(addPackageJSON),
                dataType: 'json',
                success: function (result) {
                    if (result.Status == "OK") {
                        $.LoadingOverlay("hide");
                        bootbox.dialog({
                            message: result.Message,
                            title: "<i class='fa fa-info-circle'></i>" + "Info",
                            buttons: {
                                success: {
                                    label: "Add another Package",
                                    className: "btn-success",
                                    callback: function () {
                                    }
                                },
                                danger: {
                                    label: "See List of Package",
                                    className: "btn-danger",
                                    callback: function () {
                                        $('#createPackageModal').modal('hide');
                                    }
                                }
                            }
                        });
                        //alert(result.Message);
                        $('#StudentTableContainer').jtable('load');
                    }
                    else {
                        $.LoadingOverlay("hide");
                        bootbox.dialog({
                            message: result.Message,
                            title: "<i class='fa fa-info-circle'></i>" + "Info",
                            buttons: {
                                danger: {
                                    label: "OK",
                                    className: "btn-danger",
                                    callback: function () {
                                    }
                                }
                            }
                        });
                        $('#StudentTableContainer').jtable('load');
                    }
                },
                error: function (errorThrown) {
                    $.LoadingOverlay("hide");
                }
            });
        }
    }
});

// ADD PRODUCT
$('#btnAddPProduct').click(function (e) {
    e.preventDefault();

    $('#AddPProductModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
$('#saveAddPProduct').click(function (e) {
    e.preventDefault();

    var addProductJSON = {
        sProduct: $('#sNewProduct').val()
    };

    $.ajax({
        url: '/Package/SetPackageProduct',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addProductJSON),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                var P_Product = $("#P_Product");
                P_Product.empty();
                var UpdateP_Product = $("#UpdateP_Product");
                UpdateP_Product.empty();
                $.each(data.sNewProduct, function (i, val) {
                    P_Product.append(
                        $("<option></option>").val(val.ProductCode).html(val.ProductName)
                    );
                });
                $.each(data.sNewProduct, function (i, val) {
                    UpdateP_Product.append(
                        $("<option></option>").val(val.ProductCode).html(val.ProductName)
                    );
                });
                toastr["success"]("New Product SAVED");
                $('#AddPProductModal').modal('hide');

            } else {
                toastr["error"]("Error while save");
            }
        },
        error: function (errorThrown) {
        }
    });
});

// ADD VALIDITY
$('#btnAddPValidity').click(function (e) {
    e.preventDefault();

    $('#AddPValidityModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
$('#saveAddPValidity').click(function (e) {
    e.preventDefault();

    var addValidityJSON = {
        sValidity: $('#sNewValidity').val()
    };

    $.ajax({
        url: '/Package/SetPackageValidity',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addValidityJSON),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                var P_Validity = $("#P_Validity");
                P_Validity.empty();
                var UpdateP_Validity = $("#UpdateP_Validity");
                UpdateP_Validity.empty();
                $.each(data.sNewValidity, function (i, val) {
                    P_Validity.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                });
                $.each(data.sNewValidity, function (i, val) {
                    UpdateP_Validity.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                });
                toastr["success"]("New Validity Successfully SAVED");
                $('#AddPValidityModal').modal('hide');

            } else {
                toastr["error"]("Error while save");
            }
        },
        error: function (errorThrown) {
        }
    });
});

// ADD CERTIFICATE LENGTH
$('#btnAddPCertLength').click(function (e) {
    e.preventDefault();

    $('#AddPCertLengthModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
$('#saveAddPCertLength').click(function (e) {
    e.preventDefault();

    var addCertLengthJSON = {
        sCertLength: $('#sNewCertLength').val()
    };

    $.ajax({
        url: '/Package/SetPackageCertLength',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addCertLengthJSON),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                var P_CertLength = $("#P_CertLength");
                P_CertLength.empty();
                var UpdateP_CertLength = $("#UpdateP_CertLength");
                UpdateP_CertLength.empty();
                $.each(data.sNewCertLength, function (i, val) {
                    P_CertLength.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                });
                $.each(data.sNewCertLength, function (i, val) {
                    UpdateP_CertLength.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                });
                toastr["success"]("New Certificate Length Successfully SAVED");
                $('#AddPCertLengthModal').modal('hide');

            } else {
                toastr["error"]("Error while save");
            }
        },
        error: function (errorThrown) {
        }
    });
});

// ADD HARDWARE
$('#btnAddPHardware').click(function (e) {
    e.preventDefault();

    $('#AddPHardwareModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
$('#saveAddPHardware').click(function (e) {
    e.preventDefault();

    var addHardwareJSON = {
        sHardware: $('#sNewHardware').val()
    };

    $.ajax({
        url: '/Package/SetPackageHardware',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addHardwareJSON),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                var P_Hardware = $("#P_Hardware");
                P_Hardware.empty();
                var UpdateP_Hardware = $("#UpdateP_Hardware");
                UpdateP_Hardware.empty();
                $.each(data.sNewHardware, function (i, val) {
                    P_Hardware.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                });
                $.each(data.sNewHardware, function (i, val) {
                    UpdateP_Hardware.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                });
                toastr["success"]("New Hardware Successfully SAVED");
                $('#AddPHardwareModal').modal('hide');

            } else {
                toastr["error"]("Error while save");
            }
        },
        error: function (errorThrown) {
        }
    });
});

// ADD PACKAGING
$('#btnAddPPackaging').click(function (e) {
    e.preventDefault();

    $('#AddPPackagingModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
$('#saveAddPPackaging').click(function (e) {
    e.preventDefault();

    var addPackagingJSON = {
        sPackaging: $('#sNewPackaging').val()
    };

    $.ajax({
        url: '/Package/SetPackagePackaging',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addPackagingJSON),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                var P_Packaging = $("#P_Packaging");
                P_Packaging.empty();
                var UpdateP_Packaging = $("#UpdateP_Packaging");
                UpdateP_Packaging.empty();
                $.each(data.sNewPackaging, function (i, val) {
                    P_Packaging.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                });
                $.each(data.sNewPackaging, function (i, val) {
                    UpdateP_Packaging.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                });
                toastr["success"]("New Packaging Successfully SAVED");
                $('#AddPPackagingModal').modal('hide');

            } else {
                toastr["error"]("Error while save");
            }
        },
        error: function (errorThrown) {
        }
    });
});

// ADD API
$('#btnAddPAPI').click(function (e) {
    e.preventDefault();

    $('#AddPAPIModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
$('#saveAddPAPI').click(function (e) {
    e.preventDefault();

    var addAPIJSON = {
        sAPI: $('#sNewAPI').val()
    };

    $.ajax({
        url: '/Package/SetPackageAPI',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addAPIJSON),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                var P_API = $("#P_API");
                P_API.empty();
                var UpdateP_API = $("#UpdateP_API");
                UpdateP_API.empty();
                $.each(data.sNewAPI, function (i, val) {
                    P_API.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                });
                $.each(data.sNewAPI, function (i, val) {
                    UpdateP_API.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                });
                toastr["success"]("New API Successfully SAVED");
                $('#AddPAPIModal').modal('hide');

            } else {
                toastr["error"]("Error while save");
            }
        },
        error: function (errorThrown) {
        }
    });
});

// ADD GUIDE
$('#btnAddPGuide').click(function (e) {
    e.preventDefault();

    $('#AddPGuideModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
$('#saveAddPGuide').click(function (e) {
    e.preventDefault();

    var addGuideJSON = {
        sGuide: $('#sNewGuide').val()
    };

    $.ajax({
        url: '/Package/SetPackageGuide',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addGuideJSON),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                var P_Guide = $("#P_Guide");
                P_Guide.empty();
                var UpdateP_Guide = $("#UpdateP_Guide");
                UpdateP_Guide.empty();
                $.each(data.sNewGuide, function (i, val) {
                    P_Guide.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                });
                $.each(data.sNewGuide, function (i, val) {
                    UpdateP_Guide.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                });
                toastr["success"]("New Guide Successfully SAVED");
                $('#AddPGuideModal').modal('hide');

            } else {
                toastr["error"]("Error while save");
            }
        },
        error: function (errorThrown) {
        }
    });
});

$('#P_Price').on('input', function () {

    var addPriceJSON = {
        sPrice: $('#P_Price').val()
    };

    $.ajax({
        url: '/Package/GetPriceList',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addPriceJSON),
        dataType: 'json',
        success: function (data) {
            $('#P_GST').val(data.GSTPrice);
            $('#P_TotalPrice').val(data.TotalPrice);
        },
        error: function (errorThrown) {
        }
    });
});

//UPDATE REGION
function getUpdate(packageID) {

    var sPackageID = packageID;

    $.ajax({
        url: '/Package/GetUpdateInfo/',
        type: "POST",
        data: { sPackageID: sPackageID },
        dataType: "json",
        success: function (data) {
            $('#UpdateDibillsCode').val(data.Pack.DiBillsCode);
            $('#UpdateGeneralLedger').val(data.Pack.GeneralLedger);
            $('#UpdateProfitCenter').val(data.Pack.ProfitCenter);
            $('#UpdateProjectID').val(data.Pack.ProjectId);
            $('#UpdateMediaID').val(data.Pack.MediaID);
            $('#UpdatePackageTypeID').val(data.Pack.PackageType);
            $('#UpdatePackageName').val(data.Pack.PackageName);
            $('#UpdateP_Product').val(data.Pack.ProductCode);
            $('#UpdateP_Validity').val(data.Pack.Validity);
            $('#UpdateP_CertLength').val(data.Pack.CertificateLength);
            $('#UpdateP_Hardware').val(data.Pack.Hardware);
            $('#UpdateP_Packaging').val(data.Pack.Packaging);
            $('#UpdateP_API').val(data.Pack.API);
            $('#UpdateP_Guide').val(data.Pack.Guide);
            $('#UpdateP_AccessibleBy').val(data.Pack.AccessibleBy);
            $('#UpdateP_Price').val(data.Pack.sPrice);
            $('#UpdateP_GST').val(data.Pack.sPriceGST);
            $('#UpdateP_TotalPrice').val(data.Pack.sTotalPrice);
            $('#UpdateCertTypeID').val(data.Pack.CertType);

            if (data.Pack.ProjectId == 1) {
                $("#HideUpdateCertType").show();
            } else {
                $("#HideUpdateCertType").hide();
            }
            //$('#UpdateProjectID').select2("val", data.Pack.ProjectId);

            $('#updatePackageModal').modal({
                show: true,
                backdrop: 'static',
                keyboard: true
            });
        },
        error: function () {
        }
    });
}
$('#btnSaveUpdatePackage').click(function () {

    var formUpdatePackage = $("#formUpdatePackage");

    formUpdatePackage.validate({
        rules: {
            UpdateProjectID: {
                required: true
            },
            UpdateMediaID: {
                required: true
            },
            UpdatePackageTypeID: {
                required: true
            },
            UpdatePackageName: {
                required: true
            },
            UpdateP_Validity: {
                required: true
            },
            UpdateP_CertLength: {
                required: true
            },
            UpdateP_Price: {
                required: true
            },
            UpdateP_GST: {
                required: true
            },
            UpdateP_TotalPrice: {
                required: true
            },
        },
        messages: {
        }
    });

    if (formUpdatePackage.valid()) {
        var r = confirm("Are you sure to UPDATE PACKAGE");
        if (r == true) {
            $.LoadingOverlay("show");
            var updatePackageJSON = {
                PackageName: $('#UpdatePackageName').val(),
                ProjectID: $('#UpdateProjectID').val(),
                PackageTypeID: $('#UpdatePackageTypeID').val(),
                MediaID: $('#UpdateMediaID').val(),
                P_CertType: $('#UpdateP_CertType').val(),
                P_Product: $('#UpdateP_Product').val(),
                P_Validity: $('#UpdateP_Validity').val(),
                P_CertLength: $('#UpdateP_CertLength').val(),
                P_Hardware: $('#UpdateP_Hardware').val(),
                P_Packaging: $('#UpdateP_Packaging').val(),
                P_API: $('#UpdateP_API').val(),
                P_Guide: $('#UpdateP_Guide').val(),
                P_AccessibleBy: $('#UpdateP_AccessibleBy').val(),
                P_Price: $('#UpdateP_Price').val(),
                P_GST: $('#UpdateP_GST').val(),
                P_TotalPrice: $('#UpdateP_TotalPrice').val(),
                CertTypeID: $('#UpdateCertTypeID').val(),

                GeneralLedger: $('#UpdateGeneralLedger').val(),
                ProfitCenter: $('#UpdateProfitCenter').val()
            };

            $.ajax({
                url: '/Package/UpdatePackage',
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                cache: false,
                data: JSON.stringify(updatePackageJSON),
                dataType: 'json',
                success: function (result) {
                    if (result.Status == "OK") {
                        $('#StudentTableContainer').jtable('load');
                        $.LoadingOverlay("hide");
                        bootbox.dialog({
                            message: result.Message,
                            title: "<i class='fa fa-info-circle'></i>" + "Info",
                            buttons: {
                                success: {
                                    label: "OK",
                                    className: "btn-success",
                                    callback: function () {
                                    }
                                }
                            }
                        });
                    }
                    else {
                        $.LoadingOverlay("hide");
                        bootbox.dialog({
                            message: result.Message,
                            title: "<i class='fa fa-info-circle'></i>" + "Info",
                            buttons: {
                                danger: {
                                    label: "OK",
                                    className: "btn-danger",
                                    callback: function () {
                                    }
                                }
                            }
                        });
                        $('#StudentTableContainer').jtable('load');
                    }
                },
                error: function (errorThrown) {
                    $.LoadingOverlay("hide");
                }
            });
        }
    }
});

// UPDATE PRODUCT
$('#btnUpdatePProduct').click(function (e) {
    e.preventDefault();

    $('#AddPProductModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
// UPDATE VALIDITY
$('#btnUpdatePValidity').click(function (e) {
    e.preventDefault();

    $('#AddPValidityModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
// UPDATE CERTIFICATE LENGTH
$('#btnUpdatePCertLength').click(function (e) {
    e.preventDefault();

    $('#AddPCertLengthModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
// UPDATE HARDWARE
$('#btnUpdatePHardware').click(function (e) {
    e.preventDefault();

    $('#AddPHardwareModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
// UPDATE PACKAGING
$('#btnUpdatePPackaging').click(function (e) {
    e.preventDefault();

    $('#AddPPackagingModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
// UPDATE API
$('#btnUpdatePAPI').click(function (e) {
    e.preventDefault();

    $('#AddPAPIModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
// UPDATE GUIDE
$('#btnUpdatePGuide').click(function (e) {
    e.preventDefault();

    $('#AddPGuideModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
//AUTO LOAD UPDATE PRICE
$('#UpdateP_Price').blur(function (e) {
    e.preventDefault();

    var addPriceJSON = {
        sPrice: $('#UpdateP_Price').val()
    };

    $.ajax({
        url: '/Package/GetPriceList',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addPriceJSON),
        dataType: 'json',
        success: function (data) {
            $('#UpdateP_GST').val(data.GSTPrice);
            $('#UpdateP_TotalPrice').val(data.TotalPrice);
        },
        error: function (errorThrown) {
        }
    });
});

//FIND FUNCTION
$('#searchID').blur(function (e) {
    e.preventDefault();

    var vSearchID = $('#searchID').val();

    if (vSearchID == "PackageType") {

        var findBID = $("#findBID");
        findBID.empty();
        findBID.append($("<option></option").val("").html("Select Type"));
        $.ajax({
            url: '/Package/GetSearchPackageType',
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            cache: false,
            //data: JSON.stringify(vSearchID),
            dataType: 'json',
            success: function (data) {
                if (data.Result == "OK") {
                    $.each(data.ListB, function (i, val) {
                        findBID.append(
                            $("<option></option>").val(val.PackageTypeID).html(val.PackageTypeName)
                        );
                    });
                }
            },
            error: function (errorThrown) {
            }
        });
        $('#classA').hide();
        $('#classB').show();
        vMethod = 2;
    }
    else if (vSearchID == "ProjectId") {
        var findBID = $("#findBID");
        findBID.empty();
        findBID.append($("<option></option").val("").html("Select Project"));
        $.ajax({
            url: '/Package/GetSearchProject',
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            cache: false,
            //data: JSON.stringify(vSearchID),
            dataType: 'json',
            success: function (data) {
                if (data.Result == "OK") {
                    $.each(data.ListB, function (i, val) {
                        findBID.append(
                            $("<option></option>").val(val.ProjectId).html(val.ProjectName)
                        );
                    });
                }
            },
            error: function (errorThrown) {
            }
        });
        $('#classA').hide();
        $('#classB').show();
        vMethod = 2;
    }
    else if (vSearchID == "MediaID") {
        var findBID = $("#findBID");
        findBID.empty();
        findBID.append($("<option></option").val("").html("Select Media"));

        $.ajax({
            url: '/Package/GetSearchMedia',
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            cache: false,
            //data: JSON.stringify(vSearchID),
            dataType: 'json',
            success: function (data) {
                if (data.Result == "OK") {
                    $.each(data.ListB, function (i, val) {
                        findBID.append(
                            $("<option></option>").val(val.MediaID).html(val.MediaName)
                        );
                    });
                }
            },
            error: function (errorThrown) {
            }
        });
        $('#classA').hide();
        $('#classB').show();
        vMethod = 2;
    }
    else {
        $('#classA').show();
        $('#classB').hide();
        vMethod = 1;
    }
});