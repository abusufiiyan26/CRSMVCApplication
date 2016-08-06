$(window).load(function () {

    $('#poDate').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true,
        showButtonPanel: true
    });

    //LOAD CUSTOMER
    var cQCPerson = $("#cQCPerson");
    cQCPerson.empty();
    cQCPerson.append($("<option></option").val("").html("Select Contact Person"));

    //LOAD CUSTOMER NAME
    var cQCName = $("#cQCName");
    cQCName.empty();
    cQCName.append($("<option></option").val("").html("Select Customer"));

    //LOAD PROJECT
    var projectID = $("#projectID");
    projectID.empty();
    projectID.append($("<option></option").val("").html("Select Project"));

    $.ajax({
        url: '/NewUploadPO/getAllDataList/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: "json",
        success: function (data) {
            //Project
            $.each(data.Project, function (i, val) {
                projectID.append(
                    $("<option></option>").val(val.ProjectId).html(val.ProjectName)
                );
            });
            //Contact Person & Name
            $.each(data.Customer, function (i, val) {
                cQCPerson.append(
                    $("<option></option>").val(val.User_ID).html(val.Name)
                );
                cQCName.append(
                    $("<option></option>").val(val.U_CompanyID).html(val.U_CompanyName)
                );
            });
        },
        error: function () {
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

//SAVE CREATE NEW QUOTATION
$('#btnUploadPO').click(function (e) {
    e.preventDefault();

    var formPO = $("#formPO");

    formPO.validate({
        rules: {
            poNumber: {
                required: true
            },
            poDate: {
                required: true
            },
            projectID: {
                required: true
            },
            poQuantityCert: {
                required: true
            },
            poQuantitySSL: {
                required: true
            },
            poPrice: {
                required: true
            },
            poFileUpload: {
                required: true
            },
            cQCName: {
                required: true
            },
            cQCPerson: {
                required: true
            },
        }
    });

    if (formPO.valid()) {

        var r = confirm("Are you sure UPLOAD PURCHASE ORDER?");
        if (r == true) {

            $.LoadingOverlay("show");

            var quotationJson = {
                projectID: $('#projectID').val(),

                poNumber: $('#poNumber').val(),
                poDate: $('#poDate').val(),
                poQuantityCert: $('#poQuantityCert').val(),
                poQuantitySSL: $('#poQuantitySSL').val(),
                poPrice: $('#poPrice').val(),

                cQNo: $('#cQNo').val(),
                cQCPerson: $('#cQCPerson').val(),
                cQCName: $('#cQCName').val(),
                cQAdd: $('#cQAdd').val(),
                cQCity: $('#cQCity').val(),
                cQPCode: $('#cQPCode').val(),
                cQState: $('#cQState').val(),
                cQCountry: $('#cQCountry').val(),
                cQTelO: $('#cQTelO').val()
            };
            $.ajax({
                url: '/NewUploadPO/saveReviseQuotation',
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
                                        window.location.replace("../NewUploadPO/ListOfPOV2");
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
                    $('#poFileUpload').val("");
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
                url: '/NewUploadPO/POFiles?id=' + myID,
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