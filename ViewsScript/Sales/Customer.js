$(document).ready(function () {

    //GET ALL DATA
    var CountryID = $("#CountryID");
    CountryID.empty();
    CountryID.append($("<option></option").val("").html("Select Country"));

    var StateID = $("#StateID");
    StateID.empty();
    StateID.append($("<option></option").val("").html("Select State"));

    var OrgCountryID = $("#OrgCountryID");
    OrgCountryID.empty();
    OrgCountryID.append($("<option></option").val("").html("Select Country"));

    var OrgStateID = $("#OrgStateID");
    OrgStateID.empty();
    OrgStateID.append($("<option></option").val("").html("Select State"));

    var IndustryID = $("#IndustryID");
    IndustryID.empty();
    IndustryID.append($("<option></option").val("").html("Select Industry"));

    //GET UPDATE DATA
    var UpdateCountryID = $("#UpdateCountryID");
    UpdateCountryID.empty();
    UpdateCountryID.append($("<option></option").val("").html("Select Country"));

    var UpdateStateID = $("#UpdateStateID");
    UpdateStateID.empty();
    UpdateStateID.append($("<option></option").val("").html("Select State"));

    var UpdateOrgCountryID = $("#UpdateOrgCountryID");
    UpdateOrgCountryID.empty();
    UpdateOrgCountryID.append($("<option></option").val("").html("Select Country"));

    var UpdateOrgStateID = $("#UpdateOrgStateID");
    UpdateOrgStateID.empty();
    UpdateOrgStateID.append($("<option></option").val("").html("Select State"));

    var UpdateIndustryID = $("#UpdateIndustryID");
    UpdateIndustryID.empty();
    UpdateIndustryID.append($("<option></option").val("").html("Select Industry"));

    var CPOrgName = $("#CPOrgName");
    CPOrgName.empty();
    CPOrgName.append($("<option></option").val("").html("Select Company"));

    var CPCountryID = $("#CPCountryID");
    CPCountryID.empty();
    CPCountryID.append($("<option></option").val("").html("Select Country"));

    $.ajax({
        url: '/Customer/GetListData',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: 'json',
        success: function (data) {
            $.each(data.Country, function (i, val) {
                CountryID.append(
                    $("<option></option>").val(val.CountryID).html(val.CountryName)
                );
                OrgCountryID.append(
                    $("<option></option>").val(val.CountryID).html(val.CountryName)
                );
                CPCountryID.append(
                    $("<option></option>").val(val.CountryID).html(val.CountryName)
                );
            });
            $.each(data.Industry, function (i, val) {
                IndustryID.append(
                    $("<option></option>").val(val.CustomerTypeID).html(val.CustomerTypeName)
                );
            });

            //UPDATE ASSIGN
            $.each(data.Country, function (i, val) {
                UpdateCountryID.append(
                    $("<option></option>").val(val.CountryID).html(val.CountryName)
                );
                UpdateOrgCountryID.append(
                    $("<option></option>").val(val.CountryID).html(val.CountryName)
                );
            });
            $.each(data.State, function (i, val) {
                UpdateStateID.append(
                    $("<option></option>").val(val.StateID).html(val.StateName)
                );
                UpdateOrgStateID.append(
                    $("<option></option>").val(val.StateID).html(val.StateName)
                );
            });
            $.each(data.Industry, function (i, val) {
                UpdateIndustryID.append(
                    $("<option></option>").val(val.CustomerTypeID).html(val.CustomerTypeName)
                );
            });
            $.each(data.Customer, function (i, val) {
                CPOrgName.append(
                    $("<option></option>").val(val.U_CompanyID).html(val.U_CompanyName)
                );
            });
        },
        error: function (errorThrown) {
        }
    });

    $('#DOB').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true
    });

    $('#CPDOB').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true
    });

    var cachedCountryOptions = null;

    $('#CustomerTableContainer').jtable({
        title: 'List of Company',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'U_CompanyName ASC',
        recordsLoaded: function (event, data) {
            var rowCount = data.records.length;
            if (rowCount >= 1) {
                $('#CustomerTableContainer').find('.jtable-toolbar-item.jtable-toolbar-item-add-record').remove();
            }
        },
        actions: {
            listAction:
                function (postData, jtParams) {
                    console.log("Loading from custom function...");
                    return $.Deferred(function ($dfd) {
                        $.ajax({
                            url: '/Customer/UsersList?roleID=0 &jtStartIndex=' + jtParams.jtStartIndex + '&jtPageSize=' + jtParams.jtPageSize + '&jtSorting=' + jtParams.jtSorting,
                            type: 'POST',
                            dataType: 'json',
                            data: postData,
                            success: function (data) {
                                $dfd.resolve(data);
                            },
                            error: function () {
                                $dfd.reject();
                            }
                        });
                    });
                }
        },
        fields: {
            User_ID: {
                key: true,
                create: false,
                edit: false,
                list: false
            },
            CustomerID: {
                list: false
            },
            ContacPersonList: {
                title: '',
                width: '1%',
                sorting: false,
                edit: false,
                create: false,
                display: function (Data) {
                    var $img = $('<img src="/Images/list.png" title="Contact Person" />');
                    if (Data.record.CustomerID != null) {
                        $img.click(function () {
                            $('#CustomerTableContainer').jtable('openChildTable',
                                    $img.closest('tr'), //Parent row
                                    {
                                        title: Data.record.U_CompanyName + ' - List Of Contact Person',
                                        defaultSorting: 'U_CompanyName ASC',
                                        actions: {
                                            listAction: '/Customer/CustomerGetCPRecords?CustomerID=' + Data.record.CustomerID
                                        },
                                        fields: {
                                            CustomerID: {
                                                key: true,
                                                create: false,
                                                edit: false,
                                                del: false,
                                                list: false,
                                                width: '5%'
                                            },
                                            User_ID: {
                                                list: false,
                                                edit: false,
                                                width: '5%'
                                            },
                                            Name: {
                                                title: 'Contact Name',
                                                width: '15%'
                                            },
                                            Email: {
                                                title: 'Email',
                                                list: true
                                            },
                                            Mobile_No: {
                                                title: 'Mobile No',
                                                list: true
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
                                                        return '<img title="Print Quotation" style="cursor:pointer;width:20px" onclick=\"printQuotation(' + data.record.QuotationID + ')\" src="../Images/Icon-Print.png" />';
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    function (data) { //opened handler
                                        data.childTable.jtable('load');
                                    });
                        });
                    }
                    return $img;
                }
            },
            U_CompanyName: {
                title: 'Company Name',
                width: '16%'
            },
            RegistrationNo: {
                title: 'Registration No',
                width: '16%'
            },
            Name: {
                title: 'Contact Person',
                width: '15%'
            },
            U_Mobile_No: {
                title: 'Tel No',
                width: '15%',
                edit: true
            },
            Email: {
                title: 'Email',
                list: true
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
                        return '<button title="Edit Record" class="jtable-command-button jtable-edit-command-button" onclick=\"getCustUpdate(' + data.record.User_ID + ')\; return false;"><span>Edit Record</span></button>';
                    }
                }
            }
        },
        formCreated: function (event, data) {
            data.form.children(':lt(11)').wrapAll('<div class="col1"/>');
            data.form.children(':gt(0)').wrapAll('<div class="col2"/>');
        }
    });

    //Load student list from server
    $('#CustomerTableContainer').jtable('load');

});

//SEARCH FUNCTION
$("#SearchRoleID").change(function () {
    $('#CustomerTableContainer').jtable('load', {
        roleID: $('#SearchRoleID').val()
    });
});

$("#btnToFind").click(function () {
    $('#CustomerTableContainer').jtable('load', {
        roleID: $('#SearchRoleID').val(),
        ValueSearch: $('#searchID').val(),
        ValueToFind: $('#findID').val()
    });
});

//REGION FOR CREATE
$('#btnCreateNewUser').click(function () {
    $('#CreateCustomerForm1')[0].reset();
    $('#CreateCustomerForm2')[0].reset();
    $("#personalDetails").show();
    $("#button1").show();
    $("#roleDetails").hide();
    $("#button2").hide();
    $('#createusermodal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});

$("#CountryID").change(function () {
    // this will call when Country Dropdown select change
    var CountryID = parseInt($("#CountryID").val());
    if (!isNaN(CountryID)) {
        var ddState = $("#StateID");
        ddState.empty(); // this line is for clear all items from State dropdown
        ddState.append($("<option></option").val("").html("Select State"));

        // Here call Controller Action via Jquery to load State for selected Country
        $.ajax({
            url: '../UserAdmin/GetCreateStates/',
            type: "POST",
            data: { CountryID: CountryID },
            dataType: "json",
            success: function (data) {
                $.each(data.State, function (i, val) {
                    ddState.append(
                        $("<option></option>").val(val.StateID).html(val.StateName)
                    );
                });
            },
            error: function () {
                alert("Error!");
            }
        });
    }
});
$("#OrgCountryID").change(function () {

    var OrgCountryID = parseInt($("#OrgCountryID").val());
    if (!isNaN(OrgCountryID)) {
        var ddState = $("#OrgStateID");
        ddState.empty();
        ddState.append($("<option></option").val("").html("Select State"));

        $.ajax({
            url: '../UserAdmin/GetCreateStates/',
            type: "POST",
            data: { CountryID: OrgCountryID },
            dataType: "json",
            success: function (data) {
                $.each(data.State, function (i, val) {
                    ddState.append(
                        $("<option></option>").val(val.StateID).html(val.StateName)
                    );
                });
            },
            error: function () {
                alert("Error!");
            }
        });
    }
});
$("#CPCountryID").change(function () {

    var CPCountryID = parseInt($("#CPCountryID").val());
    if (!isNaN(CPCountryID)) {
        var CPStateID = $("#CPStateID");
        CPStateID.empty();
        CPStateID.append($("<option></option").val("").html("Select State"));

        $.ajax({
            url: '../UserAdmin/GetCreateStates/',
            type: "POST",
            data: { CountryID: CPCountryID },
            dataType: "json",
            success: function (data) {
                $.each(data.State, function (i, val) {
                    CPStateID.append(
                        $("<option></option>").val(val.StateID).html(val.StateName)
                    );
                });
            },
            error: function () {
            }
        });
    }
});

$('#btnNext').click(function () {

    var CreateCustomerForm1 = $("#CreateCustomerForm1");
    var StateIDVal = $("#StateID").val();
    var CountryIDVal = $("#CountryID").val();

    CreateCustomerForm1.validate({
        rules: {
            Name: {
                required: true
            },
            Email: {
                email: true
            },
            Mobile_No: {
                required: true,
                digits: true
            },
            timepicker: {
                required: true
            },
            Address: {
                required: true
            },
            Postcode: {
                required: true,
                digits: true
            },
            City: {
                required: true
            },
            OrgCountryIDVal: {
                required: true
            }
        },
        messages: {
            Name: {
                required: "Name is required"
            },
            Email: {
                required: "Email Address is required"
            },
            Mobile_No: {
                required: "Phone No is required"
            },
            timepicker: {
                required: "Please select Date of Birth"
            },
            Address: {
                required: "Address is required"
            },
            Postcode: {
                required: "Postcode is required"
            },
            City: {
                required: "City is required"
            }
        }
    });

    if (CreateCustomerForm1.valid()) {
        $("#CreateCustomerForm1").LoadingOverlay("show");
        $("#personalDetails").hide();
        $("#button1").hide();
        $("#roleDetails").show();
        $("#button2").show();

        var ddState = $("#OrgStateID");
        ddState.empty();
        ddState.append($("<option></option").val("").html("Select State"));

        $.ajax({
            url: '../UserAdmin/GetCreateStates/',
            type: "POST",
            data: { CountryID: $('#CountryID').val() },
            dataType: "json",
            success: function (data) {
                $.each(data.State, function (i, val) {
                    ddState.append(
                        $("<option></option>").val(val.StateID).html(val.StateName)
                    );
                });
                ddState.val($('#StateID').val());
            },
            error: function () {
            }
        });

        $('#OrgAddress').val($('#Address').val());
        $('#OrgCountryID').val($('#CountryID').val());
        $('#OrgPostcode').val($('#Postcode').val());
        $('#OrgCity').val($('#City').val());
        $("#CreateCustomerForm1").LoadingOverlay("hide", true);
    }
});

$('#btnPrev').click(function () {
    $("#personalDetails").show();
    $("#button1").show();
    $("#roleDetails").hide();
    $("#button2").hide();
});

$('#btnCreate').click(function () {

    var CreateCustomerForm2 = $("#CreateCustomerForm2");
    var OrgCountryIDVal = $('#OrgCountryID').val();

    CreateCustomerForm2.validate({
        rules: {
            CustomerCode: {
                required: true
            },
            OrgName: {
                required: true
            },
            OrgAddress: {
                required: true
            },
            OrgPostcode: {
                required: true,
                digits: true
            },
            OrgCity: {
                required: true
            },
            OrgCountryID: {
                required: true
            },
            OrgStateID: {
                required: true
            },
            OrgTelNo: {
                required: true,
                digits: true
            }
        },
        messages: {
            OrgName: {
                required: "Organization name is required"
            },
            OrgAddress: {
                required: "Address is required"
            },
            OrgPostcode: {
                required: "Postcode is required"
            },
            OrgCity: {
                required: "City is required"
            },
            OrgTelNo: {
                required: "Phone number is required"
            }
        }
    });

    if (CreateCustomerForm2.valid()) {
        bootbox.confirm("Are you sure to CREATE NEW CUSTOMER?", function (result) {
            if (result) {
                $.LoadingOverlay("show");
                //var $btn = $(this).button('loading')
                //$('#btnPrev').hide();

                var createCust = {
                    IDType: $('#IDType').val(),
                    ICNo: $('#ICNo').val(),
                    Name: $('#Name').val(),
                    Email: $('#Email').val(),
                    Mobile_No: $('#Mobile_No').val(),
                    Gender: $('#Gender').val(),
                    DOB: $('#DOB').val(),
                    Address: $('#Address').val(),
                    CountryID: $('#CountryID').val(),
                    StateID: $('#StateID').val(),
                    Postcode: $('#Postcode').val(),
                    City: $('#City').val(),

                    //company information
                    CustomerCode: $('#CustomerCode').val(),
                    OrgName: $('#OrgName').val(),
                    OrgRegNo: $('#OrgRegNo').val(),
                    OrgAddress: $('#OrgAddress').val(),
                    OrgCountryID: $('#OrgCountryID').val(),
                    OrgStateID: $('#OrgStateID').val(),
                    OrgPostcode: $('#OrgPostcode').val(),
                    OrgCity: $('#OrgCity').val(),
                    OrgFaxNo: $('#OrgFaxNo').val(),
                    OrgTelNo: $('#OrgTelNo').val(),

                    Industry: $('#IndustryID').val(),
                    Website: $('#Website').val(),
                    CustType: $('#CustType').val(),

                    CreatedAt: $('#CreatedAt').val()
                };

                $.ajax({
                    url: '/Customer/CreateCustomer',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(createCust),
                    dataType: 'json',
                    success: function (data) {
                        if (data.Result = "OK") {
                            if (data.CreatedAt == "NONE") {
                                $.LoadingOverlay("hide");
                                toastr["success"](data.Message);
                                //$btn.button('reset')
                                $('#createusermodal').modal('hide');
                                $('#CustomerTableContainer').jtable('load');
                            } else {
                                var cQCName = $("#cQCName");
                                cQCName.empty();
                                cQCName.append($("<option></option").val("").html("Select Company"));
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
                                    },
                                    error: function () {
                                    }
                                });
                                $('#createusermodal').modal('hide');
                                $.LoadingOverlay("hide");
                                toastr["success"](data.Message);
                            }
                        }
                        else {
                            $.LoadingOverlay("hide");
                            toastr["error"](data.Message);
                        }
                    },
                    error: function (errorThrown) {
                        $.LoadingOverlay("hide");
                        toastr["error"](errorThrown);
                    }
                });
            }
        });
    }
});

//REGION FOR UPDATE
function getCustUpdate(UserID) {

    $('#UpdateCustomerForm1')[0].reset();
    $('#UpdateCustomerForm2')[0].reset();

    var vUserID = UserID;

    $.ajax({
        url: '../Customer/GetCustomerDataList/',
        type: "POST",
        data: { UserID: vUserID },
        dataType: "json",
        success: function (data) {
            $('#UpdateIDType').val(data.vList[0].IDType);
            $('#UpdateICNo').val(data.vList[0].ICNo);
            $('#UpdateName').val(data.vList[0].Name);
            $('#UpdateEmail').val(data.vList[0].Email);
            $('#UpdateMobile_No').val(data.vList[0].Mobile_No);
            $('#UpdateGender').val(data.vList[0].Sex);
            $('#UpdateDOB').val(data.vList[0].DOB);
            $('#UpdateAddress').val(data.vList[0].Address);
            $('#UpdatePostcode').val(data.vList[0].Postcode);
            $('#UpdateCity').val(data.vList[0].City);
            $('#UpdateMobile_No').val(data.vList[0].Mobile_No);
            $('#UpdateEmail').val(data.vList[0].Email);
            $('#UpdateWebsite').val(data.vList[0].Website);
            if (data.vList[0].Type == null) {
                $('#UpdateCustType').val("Client");
            }
            else {
                $('#UpdateCustType').val(data.vList[0].Type);
            }
            //Company Info
            $('#UpdateOrgName').val(data.vList[0].U_CompanyName);
            $('#UpdateOrgRegNo').val(data.vList[0].RegistrationNo);
            $('#UpdateOrgAddress').val(data.vList[0].U_Addr);
            $('#UpdateOrgPostcode').val(data.vList[0].U_Postcode);
            $('#UpdateOrgCity').val(data.vList[0].U_City);
            $('#UpdateOrgFaxNo').val(data.vList[0].U_Fax_No);
            $('#UpdateOrgTelNo').val(data.vList[0].U_Mobile_No);
            $('#UpdateCustomerCode').val(data.vList[0].CustomerPrefix);

            var date = new Date(parseInt(data.vList[0].DOB.substr(6)));
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            var vdate = day + "/" + month + "/" + year;

            $('#UpdateDOB').val(vdate);

            var CountryID = $("#UpdateCountryID");
            var StateID = $("#UpdateStateID");
            var OrgCountryID = $("#UpdateOrgCountryID");
            var OrgStateID = $("#UpdateOrgStateID");
            var IndustryID = $("#UpdateIndustryID");

            CountryID.val(data.vList[0].Country);
            StateID.val(data.vList[0].State);
            OrgCountryID.val(data.vList[0].U_CountryID);
            OrgStateID.val(data.vList[0].U_StateID);
            IndustryID.val(data.vList[0].Industry);

            $("#updatepersonalDetails").show();
            $("#updatebutton1").show();
            $("#updateroleDetails").hide();
            $("#updatebutton2").hide();
            $('#updateusermodal').modal('show');
        },
        error: function () {
        }
    });
}

$("#UpdateCountryID").change(function () {
    // this will call when Country Dropdown select change
    var CountryID = parseInt($("#UpdateCountryID").val());
    if (!isNaN(CountryID)) {
        var ddState = $("#UpdateStateID");
        ddState.empty(); // this line is for clear all items from State dropdown
        ddState.append($("<option></option").val("").html("Select State"));

        // Here call Controller Action via Jquery to load State for selected Country
        $.ajax({
            url: '../UserAdmin/GetCreateStates/',
            type: "POST",
            data: { CountryID: CountryID },
            dataType: "json",
            success: function (data) {
                $.each(data.State, function (i, val) {
                    ddState.append(
                        $("<option></option>").val(val.StateID).html(val.StateName)
                    );
                });
            },
            error: function () {
                alert("Error!");
            }
        });
    }
});

$("#UpdateOrgCountryID").change(function () {

    var OrgCountryID = parseInt($("#UpdateOrgCountryID").val());
    if (!isNaN(OrgCountryID)) {
        var ddState = $("#UpdateOrgStateID");
        ddState.empty();
        ddState.append($("<option></option").val("").html("Select State"));

        $.ajax({
            url: '../UserAdmin/GetCreateStates/',
            type: "POST",
            data: { CountryID: OrgCountryID },
            dataType: "json",
            success: function (data) {
                $.each(data.State, function (i, val) {
                    ddState.append(
                        $("<option></option>").val(val.StateID).html(val.StateName)
                    );
                });
            },
            error: function () {
                alert("Error!");
            }
        });
    }
});

$('#btnUpdateNext').click(function () {

    var UpdateCustomerForm1 = $("#UpdateCustomerForm1");
    var UpdateStateIDVal = $("#UpdateStateID").val();
    var UpdateCountryIDVal = $("#UpdateCountryID").val();

    UpdateCustomerForm1.validate({
        rules: {
            UpdateICNo: {
                required: true,
                maxlength: 12
            },
            UpdateName: {
                required: true
            },
            UpdateEmail: {
                email: true
            },
            UpdateMobile_No: {
                required: true,
                digits: true
            },
            UpdateAddress: {
                required: true
            },
            UpdatePostcode: {
                required: true,
                digits: true
            },
            UpdateCity: {
                required: true
            }
        },
        messages: {
            UpdateICNo: {
                required: "IC No is required"
            },
            UpdateName: {
                required: "Name is required"
            },
            UpdateEmail: {
                required: "Email Address is required"
            },
            UpdateMobile_No: {
                required: "Phone No is required"
            },
            UpdateAddress: {
                required: "Address is required"
            },
            UpdatePostcode: {
                required: "Postcode is required"
            },
            UpdateCity: {
                required: "City is required"
            }
        }
    });

    if (UpdateCountryIDVal == "") {
        alert("Please select a Country");
        return false;
    }

    if (UpdateStateIDVal == "" && UpdateCountryIDVal == "135") {
        alert("Please select a State");
        return false;
    }

    if (UpdateCustomerForm1.valid()) {
        $("#updatepersonalDetails").hide();
        $("#updatebutton1").hide();
        $("#updateroleDetails").show();
        $("#updatebutton2").show();
    }
});

$('#btnUpdatePrev').click(function () {
    $("#updatepersonalDetails").show();
    $("#updatebutton1").show();
    $("#updateroleDetails").hide();
    $("#updatebutton2").hide();
});

$('#btnUpdate').click(function () {

    var UpdateCustomerForm2 = $("#UpdateCustomerForm2");
    var UpdateOrgCountryIDVal = $('#UpdateOrgCountryID').val();

    UpdateCustomerForm2.validate({
        rules: {
            UpdateOrgName: {
                required: true
            },
            UpdateOrgAddress: {
                required: true
            },
            UpdateOrgPostcode: {
                required: true,
                digits: true
            },
            UpdateOrgCity: {
                required: true
            },
            UpdateOrgTelNo: {
                required: true,
                digits: true
            }
        },
        messages: {
            UpdateOrgName: {
                required: "Organization name is required"
            },
            UpdateOrgAddress: {
                required: "Address is required"
            },
            UpdateOrgPostcode: {
                required: "Postcode is required"
            },
            UpdateOrgCity: {
                required: "City is required"
            },
            UpdateOrgTelNo: {
                required: "Phone number is required"
            }
        }
    });

    if (UpdateOrgCountryIDVal == "") {
        alert("Please select a Country");
        return false;
    }

    if (UpdateCustomerForm2.valid()) {

        bootbox.confirm("Are you sure to UPDATE CUSTOMER?", function (result) {
            if (result) {
                //var $btn = $(this).button('loading')
                //$('#btnUpdatePrev').hide();
                $.LoadingOverlay("show");
                var updateCust = {
                    IDType: $('#UpdateIDType').val(),
                    ICNo: $('#UpdateICNo').val(),
                    Name: $('#UpdateName').val(),
                    Email: $('#UpdateEmail').val(),
                    Mobile_No: $('#UpdateMobile_No').val(),
                    Gender: $('#UpdateGender').val(),
                    DOB: $('#UpdateDOB').val(),
                    Address: $('#UpdateAddress').val(),
                    CountryID: $('#UpdateCountryID').val(),
                    StateID: $('#UpdateStateID').val(),
                    Postcode: $('#UpdatePostcode').val(),
                    City: $('#UpdateCity').val(),

                    //company information
                    CustomerCode: $('#UpdateCustomerCode').val(),
                    OrgName: $('#UpdateOrgName').val(),
                    OrgRegNo: $('#UpdateOrgRegNo').val(),
                    OrgAddress: $('#UpdateOrgAddress').val(),
                    OrgCountryID: $('#UpdateOrgCountryID').val(),
                    OrgStateID: $('#UpdateOrgStateID').val(),
                    OrgPostcode: $('#UpdateOrgPostcode').val(),
                    OrgCity: $('#UpdateOrgCity').val(),
                    OrgFaxNo: $('#UpdateOrgFaxNo').val(),
                    OrgTelNo: $('#UpdateOrgTelNo').val(),

                    Industry: $('#UpdateIndustryID').val(),
                    Website: $('#UpdateWebsite').val(),
                    CustType: $('#UpdateCustType').val()
                };

                $.ajax({
                    url: '/Customer/UpdateCustomer',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(updateCust),
                    dataType: 'json',
                    success: function (data) {
                        if (data.Result = "OK") {
                            $('#CustomerTableContainer').jtable('load');
                            $.LoadingOverlay("hide");
                            toastr["success"](data.Message);
                            //$btn.button('reset')
                            $('#updateusermodal').modal('hide');
                        }
                        else {
                            $.LoadingOverlay("hide");
                            toastr["error"](data.Message);
                            //$btn.button('reset')
                        }
                    },
                    error: function (errorThrown) {
                        $.LoadingOverlay("hide");
                        toastr["error"](errorThrown);
                    }
                });
            }
        });
    }
});

//ADD NEW CONTACT PERSON
$('#btnCreateExistingUser').click(function () {
    $('#CreateCPForm')[0].reset();
    $('#insertNewCPModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});
$('#btnSaveCP').click(function () {

    var CreateCPForm = $("#CreateCPForm");

    CreateCPForm.validate({
        rules: {
            CPOrgName: {
                required: true
            },
            CPName: {
                required: true
            },
            CPEmail: {
                required: true
            },
            CPMobile_No: {
                required: true
            },
            CPAddress: {
                required: true
            },
            CPCountryID: {
                required: true
            },
            CPStateID: {
                required: true
            },
            CPPostcode: {
                required: true
            },
            CPCity: {
                required: true
            }
        }
    });

    if (CreateCPForm.valid()) {
        bootbox.confirm("Are you sure to ADD NEW CONTACT PERSON?", function (result) {
            if (result) {
                $.LoadingOverlay("show");
                var updateCust = {
                    OrgID: $('#CPOrgName').val(),
                    IDType: $('#CPIDType').val(),
                    ICNo: $('#CPICNo').val(),
                    Name: $('#CPName').val(),
                    Email: $('#CPEmail').val(),
                    Mobile_No: $('#CPMobile_No').val(),
                    Gender: $('#CPGender').val(),
                    DOB: $('#CPDOB').val(),
                    Address: $('#CPAddress').val(),
                    CountryID: $('#CPCountryID').val(),
                    StateID: $('#CPStateID').val(),
                    Postcode: $('#CPPostcode').val(),
                    City: $('#CPCity').val()
                };

                $.ajax({
                    url: '/Customer/SaveNewContactPerson',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(updateCust),
                    dataType: 'json',
                    success: function (data) {
                        if (data.Result = "OK") {
                            $('#CustomerTableContainer').jtable('load');
                            $.LoadingOverlay("hide");
                            toastr["success"](data.Message);
                            $('#insertNewCPModal').modal('hide');
                        }
                        else {
                            $.LoadingOverlay("hide");
                            toastr["error"](data.Message);
                        }
                    },
                    error: function (errorThrown) {
                        $.LoadingOverlay("hide");
                        toastr["error"](errorThrown);
                    }
                });
            }
        });
    }
});
