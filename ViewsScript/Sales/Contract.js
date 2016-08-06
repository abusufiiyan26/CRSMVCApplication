var vUpdateContractID = "";
var vContractType = "";
var vUpdateContractType = "";
$(document).ready(function () {

    $('#ContractDate').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true,
        showButtonPanel: true
    });

    $('#ContractStartDate').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true,
        showButtonPanel: true
    });

    $('#ContractEndDate').datepicker(
    {
        changeMonth: true,
        yearRange: "-0:+100",
        changeYear: true,
        autoclose: true,
        showButtonPanel: true
    });

    $('#ProjectStartDate').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true,
        showButtonPanel: true
    });

    $('#BankGuarantee').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true,
        showButtonPanel: true
    });

    $('#UpdateContractDate').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true,
        showButtonPanel: true
    });

    $('#UpdateContractStartDate').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true,
        showButtonPanel: true
    });

    $('#UpdateContractEndDate').datepicker(
    {
        changeMonth: true,
        yearRange: "-0:+100",
        changeYear: true,
        autoclose: true,
        showButtonPanel: true
    });

    $('#UpdateProjectStartDate').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true,
        showButtonPanel: true
    });

    $('#UpdateBankGuarantee').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true,
        showButtonPanel: true
    });

    //LOAD CUSTOMER
    var CustomerID = $("#CustomerID");
    CustomerID.empty();
    CustomerID.append($("<option></option").val("").html("Select Customer"));

    var ContactPersonID = $("#ContactPersonID");
    ContactPersonID.empty();
    ContactPersonID.append($("<option></option").val("").html("Select Contact Person"));

    var ProjectID = $("#ProjectID");
    ProjectID.empty();
    ProjectID.append($("<option></option").val("").html("Select Project"));

    $.ajax({
        url: '/Contract/GetListOfData/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: "json",
        success: function (data) {
            $.each(data.Customer, function (i, val) {
                CustomerID.append(
                    $("<option></option>").val(val.U_CompanyID).html(val.U_CompanyName)
                );
            });
            $.each(data.Customer, function (i, val) {
                ContactPersonID.append(
                    $("<option></option>").val(val.User_ID).html(val.Name)
                );
            });
            $.each(data.Project, function (i, val) {
                ProjectID.append(
                    $("<option></option>").val(val.ProjectId).html(val.ProjectName)
                );
            });
        },
        error: function () {
        }
    });

    $('#ContractContainer').jtable({
        title: 'Contract',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'ContractId ASC',
        actions: {
            listAction: '/Contract/ContractList'
        },
        fields: {
            ContractId: {
                key: true,
                create: false,
                edit: false,
                list: true
            },
            ContractTitle: {
                title: 'Contract Title',
                width: '10%',
                list: true
            },
            ContractNo: {
                title: 'Contract No',
                width: '10%'
            },
            ProjectName: {
                title: 'Project Name',
                width: '15%',
                visibility: 'fixed',
                list: true
            },
            CompanyName: {
                title: 'Customer',
                width: '19%'
            },
            //ContractPeriod: {
            //    title: 'Contract Period',
            //    width: '15%',
            //    visibility: 'fixed',
            //},
            ContractValue: {
                title: 'Value (RM)',
                width: '11%',
                list: true
            },
            ContractQuantity: {
                title: 'Quantity',
                width: '7%'
            },
            ContractStartDate: {
                title: 'StartDate',
                width: '9%',
                type: 'date'

            },
            ContractEndDate: {
                title: 'EndDate',
                width: '9%',
                type: 'date'
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
                        //return '<button title="Edit Contract" class="jtable-command-button jtable-edit-command-button" onclick=\"getUpdate(' + data.record.ContractId + ')\; return false;"><span>Edit Record</span></button>';
                        return '<img title="Edit Contract" style="cursor:pointer;width:25px" onclick=\"getUpdate(' + data.record.ContractId + ')\" src="../Images/icon/edit.png" />';
                    }
                }
            },
            CustomAction2: {
                title: '',
                width: '1%',
                sorting: false,
                create: false,
                edit: false,
                list: true,
                display: function (data) {
                    if (data.record) {
                        //return '<button title="Edit Contract" class="jtable-command-button jtable-edit-command-button" onclick=\"getUpdate(' + data.record.ContractId + ')\; return false;"><span>Edit Record</span></button>';
                        return '<img title="Delete Contract" style="cursor:pointer;width:22px" onclick=\"getDelete(' + data.record.ContractId + ')\" src="../Images/icon/delete.png" />';
                    }
                }
            }
        }
    });

    //Load list from server
    $('#ContractContainer').jtable('load');
});

$('#btnCreateContract').click(function () {

    $('#createContractModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
$('#btnSaveCreateContract').click(function () {

    var formCreateContract = $("#formCreateContract");

    formCreateContract.validate({
        rules: {
            ContractDate: {
                required: true
            },
            ContractNo: {
                required: true
            },
            ContractTitle: {
                required: true
            },
            ProjectID: {
                required: true
            },
            CustomerID: {
                required: true
            },
            ContactPersonID: {
                required: true
            },
            ContractValue: {
                required: true
            },
            ContractType: {
                required: true
            },
            BondValue: {
                required: true
            },
            BankGuarantee: {
                required: true
            },
            GuaranteePeriod: {
                required: true
            },
            ProjectStartDate: {
                required: true
            },
        },
        messages: {
        }
    });

    if (vContractType == "Time") {
        if ($('#ContractStartDate').val() == "" || $('#ContractEndDate').val() == "") {
            alert("Please fill in Start Date and End Date");
            return false;
        }
    } else if (vContractType == "Quantity") {
        if ($('#ContractQuantity').val() == "") {
            alert("Please fill in Quantity");
            return false;
        }
    }

    if (formCreateContract.valid()) {
        var r = confirm("Are you sure to CREATE NEW CONTRACT");
        if (r == true) {
            $.LoadingOverlay("show");
            var addContractJSON = {
                ContractDate: $('#ContractDate').val(),
                ContractNo: $('#ContractNo').val(),
                ContractTitle: $('#ContractTitle').val(),
                ContractType: $('#ContractType').val(),
                ContractQuantity: $('#ContractQuantity').val(),
                ProjectID: $('#ProjectID').val(),
                CustomerID: $('#CustomerID').val(),
                ContactPersonID: $('#ContactPersonID').val(),
                ContractValue: $('#ContractValue').val(),
                ContractStartDate: $('#ContractStartDate').val(),
                ContractEndDate: $('#ContractEndDate').val(),
                BondValue: $('#BondValue').val(),
                BankGuarantee: $('#BankGuarantee').val(),
                GuaranteePeriod: $('#GuaranteePeriod').val(),
                ProjectStartDate: $('#ProjectStartDate').val()
            };

            $.ajax({
                url: '/Contract/CreateContract',
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                cache: false,
                data: JSON.stringify(addContractJSON),
                dataType: 'json',
                success: function (data) {
                    if (data.Result == "OK") {
                        $.LoadingOverlay("hide");
                        bootbox.dialog({
                            message: data.Message,
                            title: "<i class='fa fa-info-circle'></i>" + "Info",
                            buttons: {
                                success: {
                                    label: "Add another Contract",
                                    className: "btn-success",
                                    callback: function () {
                                    }
                                },
                                danger: {
                                    label: "List of Contract",
                                    className: "btn-danger",
                                    callback: function () {
                                        $('#createContractModal').modal('hide');
                                    }
                                }
                            }
                        });
                        $('#ContractContainer').jtable('load');
                    }
                    else {
                        $.LoadingOverlay("hide");
                        bootbox.dialog({
                            message: data.Message,
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
                        $('#ContractContainer').jtable('load');
                    }
                },
                error: function (errorThrown) {
                    $.LoadingOverlay("hide");
                }
            });
        }
    }
});

//UPDATE REGION
function getUpdate(contractID) {

    var sContractID = contractID;
    vUpdateContractID = contractID;

    $.ajax({
        url: '/Contract/GetUpdateInfo/',
        type: "POST",
        data: { sContractID: sContractID },
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.Con.ContractDate == "" || data.Con.ContractDate == null) {
            } else {
                var ContractDate = moment(data.Con.ContractDate).format('DD/MM/YYYY');
                $('#UpdateContractDate').val(ContractDate);
            }
            $('#UpdateContractNo').val(data.Con.ContractNo);
            $('#UpdateContractTitle').val(data.Con.ContractTitle);
            //$('#UpdateContactPersonID').val(data.Con.ContactPersonID);
            $('#UpdateContractValue').val(data.Con.ContractValue);

            $('#UpdateBondValue').val(data.Con.BondValue);
            if (data.Con.GuaranteeDate == "" || data.Con.GuaranteeDate == null) {
            } else {
                var PassGuaranteeDate = moment(data.Con.GuaranteeDate).format('DD/MM/YYYY');
                $('#UpdateBankGuarantee').val(PassGuaranteeDate);
            }
            $('#UpdateGuaranteePeriod').val(data.Con.GuaranteePeriod);
            if (data.Con.ProjectStartDate == "" || data.Con.ProjectStartDate == null) {
            } else {
                var PassProjectStartDate = moment(data.Con.ProjectStartDate).format('DD/MM/YYYY');
                $('#UpdateProjectStartDate').val(PassProjectStartDate);
            }

            if (data.Con.ContractType == "Time") {
                if (data.Con.ContractStartDate == "" || data.Con.ContractStartDate == null) {
                } else {
                    var PassContractStartDate = moment(data.Con.ContractStartDate).format('DD/MM/YYYY');
                    $('#UpdateContractStartDate').val(PassContractStartDate);
                }
                if (data.Con.ContractEndDate == "" || data.Con.ContractEndDate == null) {
                } else {
                    var PassContractEndDate = moment(data.Con.ContractEndDate).format('DD/MM/YYYY');
                    $('#UpdateContractEndDate').val(PassContractEndDate);
                }
                $("#UpdateContractType").val("Time");
                $("#HideUpdatePeriod").show();
                $("#HideUpdateQuantity").hide();
            } else if (data.Con.ContractType == "Quantity") {
                $("#UpdateContractType").val("Quantity");
                $('#UpdateContractQuantity').val(data.Con.ContractQuantity);
                $("#HideUpdateQuantity").show();
                $("#HideUpdatePeriod").hide();
            }

            var PassCustomerID = data.Con.CustomerId;
            var PassContactPersonID = data.Con.ContactPersonId;
            var PassProjectId = data.Con.ProjectId;

            var UpdateCustomerID = $("#UpdateCustomerID");
            UpdateCustomerID.empty();
            UpdateCustomerID.append($("<option></option").val("").html("Select Customer"));

            var UpdateContactPersonID = $("#UpdateContactPersonID");
            UpdateContactPersonID.empty();
            UpdateContactPersonID.append($("<option></option").val("").html("Select Contact Person"));

            var UpdateProjectID = $("#UpdateProjectID");
            UpdateProjectID.empty();
            UpdateProjectID.append($("<option></option").val("").html("Select Project"));

            $.ajax({
                url: '/Contract/GetListOfData/',
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(),
                dataType: "json",
                success: function (data) {
                    $.each(data.Customer, function (i, val) {
                        UpdateCustomerID.append(
                            $("<option></option>").val(val.U_CompanyID).html(val.U_CompanyName)
                        );
                    });
                    UpdateCustomerID.val(PassCustomerID);
                    $.each(data.Customer, function (i, val) {
                        UpdateContactPersonID.append(
                            $("<option></option>").val(val.User_ID).html(val.Name)
                        );
                    });
                    UpdateContactPersonID.val(PassContactPersonID);
                    $.each(data.Project, function (i, val) {
                        UpdateProjectID.append(
                            $("<option></option>").val(val.ProjectId).html(val.ProjectName)
                        );
                    });
                    UpdateProjectID.val(PassProjectId);
                },
                error: function () {
                }
            });

            $('#updateContractModal').modal({
                show: true,
                backdrop: 'static',
                keyboard: true
            });
        },
        error: function () {
        }
    });
}
function getDelete(sContractID) {

    var r = confirm("Are you sure to DELETE THIS CONTRACT");
    if (r == true) {
        $.LoadingOverlay("show");
        var ddContractID = sContractID;

        $.ajax({
            url: '/Contract/DeleteContract/',
            type: "POST",
            data: { ContractId: ddContractID },
            dataType: "json",
            cache: false,
            success: function (data) {
                if (data.Result == "OK") {
                    $('#ContractContainer').jtable('load');
                    $.LoadingOverlay("hide");
                    bootbox.dialog({
                        message: data.Message,
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
                } else {
                    $('#ContractContainer').jtable('load');
                    $.LoadingOverlay("hide");
                    bootbox.dialog({
                        message: data.Message,
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
                }
            },
            error: function () {
                $.LoadingOverlay("hide");
            }
        });
    }
}
$('#btnSaveUpdateContract').click(function () {

    var formUpdateContract = $("#formUpdateContract");

    formUpdateContract.validate({
        rules: {
            UpdateContractDate: {
                required: true
            },
            UpdateContractNo: {
                required: true
            },
            UpdateContractTitle: {
                required: true
            },
            UpdateProjectID: {
                required: true
            },
            UpdateCustomerID: {
                required: true
            },
            UpdateContactPersonID: {
                required: true
            },
            UpdateContractType: {
                required: true
            },
            UpdateContractValue: {
                required: true
            },
            UpdateBondValue: {
                required: true
            },
            UpdateBankGuarantee: {
                required: true
            },
            UpdateGuaranteePeriod: {
                required: true
            },
            UpdateProjectStartDate: {
                required: true
            },
        },
        messages: {
        }
    });

    if (formUpdateContract.valid()) {
        var r = confirm("Are you sure to UPDATE CONTRACT NO : " + $('#UpdateContractNo').val() + "");
        if (r == true) {
            $.LoadingOverlay("show");
            var updateContractJSON = {
                UpdateContractId: vUpdateContractID,
                UpdateContractDate: $('#UpdateContractDate').val(),
                UpdateContractNo: $('#UpdateContractNo').val(),
                UpdateContractTitle: $('#UpdateContractTitle').val(),
                UpdateContractType: $('#UpdateContractType').val(),
                UpdateContractQuantity: $('#UpdateContractQuantity').val(),
                UpdateProjectID: $('#UpdateProjectID').val(),
                UpdateCustomerID: $('#UpdateCustomerID').val(),
                UpdateContactPersonID: $('#UpdateContactPersonID').val(),
                UpdateContractValue: $('#UpdateContractValue').val(),
                UpdateContractStartDate: $('#UpdateContractStartDate').val(),
                UpdateContractEndDate: $('#UpdateContractEndDate').val(),
                UpdateBondValue: $('#UpdateBondValue').val(),
                UpdateBankGuarantee: $('#UpdateBankGuarantee').val(),
                UpdateGuaranteePeriod: $('#UpdateGuaranteePeriod').val(),
                UpdateProjectStartDate: $('#UpdateProjectStartDate').val()
            };

            $.ajax({
                url: '/Contract/UpdateContract',
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                cache: false,
                data: JSON.stringify(updateContractJSON),
                dataType: 'json',
                success: function (data) {
                    if (data.Result == "OK") {
                        $('#ContractContainer').jtable('load');
                        $.LoadingOverlay("hide");
                        bootbox.dialog({
                            message: data.Message,
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
                        $('#ContractContainer').jtable('load');
                    }
                    else {
                        $.LoadingOverlay("hide");
                        bootbox.dialog({
                            message: data.Message,
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
                        $('#ContractContainer').jtable('load');
                    }
                },
                error: function (errorThrown) {
                    $.LoadingOverlay("hide");
                }
            });
        }
    }
});

$("#ContractType").change(function () {
    if ($('#ContractType').val() == "Time") {
        $('#ContractQuantity').val('');
        $('#ContractStartDate').val('');
        $('#ContractEndDate').val('');
        $("#HideQuantity").hide();
        $("#HidePeriod").show();
        vContractType = "Time";
    } else if ($('#ContractType').val() == "Quantity") {
        $('#ContractQuantity').val('');
        $('#ContractStartDate').val('');
        $('#ContractEndDate').val('');
        $("#HideQuantity").show();
        $("#HidePeriod").hide();
        vContractType = "Quantity";
    } else {
    }
});
$("#UpdateContractType").change(function () {
    if ($('#UpdateContractType').val() == "Time") {
        $('#UpdateContractQuantity').val('');
        $('#UpdateContractStartDate').val('');
        $('#UpdateContractEndDate').val('');
        $("#HideUpdateQuantity").hide();
        $("#HideUpdatePeriod").show();
        vUpdateContractType = "Time";
    } else if ($('#UpdateContractType').val() == "Quantity") {
        $('#UpdateContractQuantity').val('');
        $('#UpdateContractStartDate').val('');
        $('#UpdateContractEndDate').val('');
        $("#HideUpdateQuantity").show();
        $("#HideUpdatePeriod").hide();
        vUpdateContractType = "Quantity";
    } else {
    }
});