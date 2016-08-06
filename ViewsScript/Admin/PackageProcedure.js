$(document).ready(function () {

    var cachedCountryOptions = null;
    var cachedMediaOptions = null;
    var cachedTypeOptions = null;
    var cachedProductOptions = null;

    $('#PackageProcedureTable').jtable({
        title: 'Package List',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'PackageId ASC',
        actions: {
            listAction: '../Admin/PackageProcedureList'
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
                title: 'DiBillsCode',
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
            TotalPrice: {
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
                        return '<button title="Insert Procedure" class="jtable-command-button jtable-edit-command-button" onclick=\"getUpdateProcedure(' + data.record.PackageId + ')\; return false;"><span>Insert Procedure</span></button>';
                    }
                }
            }
        }
    });

    $('#PackageProcedureTable').jtable('load');
});

function getUpdateProcedure(packageID) {

    var sPackageID = packageID;

    $.ajax({
        url: '/Admin/GetPackageInfo/',
        type: "POST",
        data: { sPackageID: sPackageID },
        dataType: "json",
        success: function (data) {
            if (data.Result == "OK") {
                $("#DibillsCodez").html(data.Pack.DiBillsCode);
                $("#Projectz").html(data.Pack.ProjectName);
                $("#Mediaz").html(data.Pack.MediaName);
                $("#PackageNamez").html(data.Pack.PackageName);
                $("#Productz").html(data.Pack.DiBillsCode);
                $("#Validityz").html(data.Pack.Validity);
                $("#CertificateLengthz").html(data.Pack.CertificateLength);
                $("#Hardwarez").html(data.Pack.Hardware);
                $("#Packagingz").html(data.Pack.Packaging);
                $("#APIz").html(data.Pack.API);
                $("#Guidez").html(data.Pack.Guide);
                $("#AccessibleByz").html(data.Pack.AccessibleBy);
                $("#Pricez").html(data.Pack.Price);
                $("#GSTz").html(data.Pack.PriceGST);
                $("#TotalPricez").html(data.Pack.TotalPrice);

                var ProcedureID = $("#ProcedureID");
                ProcedureID.empty();
                ProcedureID.append($("<option></option").val("").html("Select Procedure"));

                $.each(data.Type, function (i, val) {
                    ProcedureID.append(
                        $("<option></option>").val(val.CertificateTypeID).html(val.CertificateTypeName)
                    );
                });

                $('#insertProcedureModal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: true
                });
            }
            else {
                alert(data.Message);
            }
        },
        error: function () {
        }
    });
}
$('#btnSavePackageProcedure').click(function () {

    if ($('#ProcedureID').val() == "") {
        toastr["warning"]("Please select procedure");
        return false;
    }

    var r = confirm("Are you sure to submit this Procedure");
    if (r == true) {

        var updateProcedureJSON = {
            sProcedureID: $('#ProcedureID').val()
        };

        $.ajax({
            url: '/Admin/UpdateProcedure',
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            cache: false,
            data: JSON.stringify(updateProcedureJSON),
            dataType: 'json',
            success: function (result) {
                if (result.Status == "OK") {
                    $('#PackageProcedureTable').jtable('load');
                    $('#PackageActiveTable').jtable('load');
                    bootbox.dialog({
                        message: result.Message,
                        title: "<i class='fa fa-info-circle'></i>" + "Info",
                        buttons: {
                            success: {
                                label: "OK",
                                className: "btn-success",
                                callback: function () {
                                    $('#insertProcedureModal').modal('hide');
                                }
                            }
                        }
                    });
                }
                else {
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
                    $('#PackageProcedureTable').jtable('load');
                }
            },
            error: function (errorThrown) {
            }
        });
    }
});

// ADD PROCEDURE
$('#btnAddProcedure').click(function (e) {
    e.preventDefault();

    $('#AddProcedureModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
$('#saveAddProcedure').click(function (e) {
    e.preventDefault();

    var addProcedureJSON = {
        sNewProcedure: $('#sNewProcedure').val(),
        sProcedureTypeDesc: $('#sProcedureTypeDesc').val()
    };

    $.ajax({
        url: '/Admin/SetPackageProcedure',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addProcedureJSON),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                var ProcedureID = $("#ProcedureID");
                ProcedureID.empty();
                ProcedureID.append($("<option></option").val("").html("Select Procedure"));
                $.each(data.NewProcedure, function (i, val) {
                    ProcedureID.append(
                        $("<option></option>").val(val.CertificateTypeID).html(val.CertificateTypeName)
                    );
                });

                var UpdateProcedureID = $("#UpdateProcedureID");
                UpdateProcedureID.empty();
                UpdateProcedureID.append($("<option></option").val("").html("Select Procedure"));
                $.each(data.NewProcedure, function (i, val) {
                    UpdateProcedureID.append(
                        $("<option></option>").val(val.CertificateTypeID).html(val.CertificateTypeName)
                    );
                });

                toastr["success"]("New Procedure SAVED");
                $('#AddProcedureModal').modal('hide');
            } else {
                toastr["error"](data.Message);
            }
        },
        error: function (errorThrown) {
        }
    });
});