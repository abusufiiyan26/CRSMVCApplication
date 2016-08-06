$(document).ready(function () {

    var cachedCountryOptions = null;
    var cachedMediaOptions = null;
    var cachedTypeOptions = null;
    var cachedProductOptions = null;

    $('#PackageActiveTable').jtable({
        title: 'Package List',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'PackageId ASC',
        actions: {
            listAction: '../Admin/PackageActiveProcedureList'
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
                width: '12%'
            },
            MediaName: {
                title: 'Media',
                width: '5%',
                list: true
            },
            CertificateTypeName: {
                title: 'Procedure',
                width: '23%'
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
                        return '<button title="Update Procedure" class="jtable-command-button jtable-edit-command-button" onclick=\"getUpdatePackageProcedure(' + data.record.PackageId + ')\; return false;"><span>Update Procedure</span></button>';
                    }
                }
            }
        }
    });

    $('#PackageActiveTable').jtable('load');
});

function getUpdatePackageProcedure(packageID) {

    var sPackageID = packageID;

    $.ajax({
        url: '/Admin/GetPackageUpdateInfo/',
        type: "POST",
        data: { sPackageID: sPackageID },
        dataType: "json",
        cache:false,
        success: function (data) {
            //if (data.Result == "OK") {
                $("#UpdateDibillsCodez").html(data.Pack.DiBillsCode);
                $("#UpdateProjectz").html(data.Pack.ProjectName);
                $("#UpdateMediaz").html(data.Pack.MediaName);
                $("#UpdatePackageNamez").html(data.Pack.PackageName);
                $("#UpdateProductz").html(data.Pack.DiBillsCode);
                $("#UpdateValidityz").html(data.Pack.Validity);
                $("#UpdateCertificateLengthz").html(data.Pack.CertificateLength);
                $("#UpdateHardwarez").html(data.Pack.Hardware);
                $("#UpdatePackagingz").html(data.Pack.Packaging);
                $("#UpdateAPIz").html(data.Pack.API);
                $("#UpdateGuidez").html(data.Pack.Guide);
                $("#UpdateAccessibleByz").html(data.Pack.AccessibleBy);
                $("#UpdatePricez").html(data.Pack.Price);
                $("#UpdateGSTz").html(data.Pack.PriceGST);
                $("#UpdateTotalPricez").html(data.Pack.TotalPrice);

                var UpdateProcedureID = $("#UpdateProcedureID");
                UpdateProcedureID.empty();
                UpdateProcedureID.append($("<option></option").val("").html("Select Procedure"));

                $.each(data.Type, function (i, val) {
                    UpdateProcedureID.append(
                        $("<option></option>").val(val.CertificateTypeID).html(val.CertificateTypeName)
                    );
                });
                UpdateProcedureID.val(data.Pack.CertificateTypeID);

                $('#updateProcedureModal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: true
                });
            //}
            //else {
            //    alert(data.Message);
            //}
        },
        error: function () {
        }
    });
}
$('#btnSaveUpdatePackageProcedure').click(function () {

    if ($('#UpdateProcedureID').val() == "") {
        toastr["warning"]("Please select procedure");
        return false;
    }

    var r = confirm("Are you sure to update this Procedure");
    if (r == true) {

        var updateActiveProcedureJSON = {
            sUpdateProcedureID: $('#UpdateProcedureID').val()
        };

        $.ajax({
            url: '/Admin/UpdateActiveProcedure',
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            cache: false,
            data: JSON.stringify(updateActiveProcedureJSON),
            dataType: 'json',
            success: function (result) {
                if (result.Status == "OK") {
                    $('#PackageActiveTable').jtable('load');
                    bootbox.dialog({
                        message: result.Message,
                        title: "<i class='fa fa-info-circle'></i>" + "Info",
                        buttons: {
                            success: {
                                label: "OK",
                                className: "btn-success",
                                callback: function () {
                                    $('#updateProcedureModal').modal('hide');
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
                    $('#PackageActiveTable').jtable('load');
                }
            },
            error: function (errorThrown) {
            }
        });
    }
});

// ADD PROCEDURE
$('#btnUpdateProcedure').click(function (e) {
    e.preventDefault();

    $('#AddProcedureModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
