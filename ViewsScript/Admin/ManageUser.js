var UpdateUserIDs = "";

$(document).ready(function () {

    //GET ALL DATA
    var CountryID = $("#CountryID");
    CountryID.empty();
    CountryID.append($("<option></option").val("").html("Select Country"));

    var StateID = $("#StateID");
    StateID.empty();
    StateID.append($("<option></option").val("").html("Select State"));

    //GET UPDATE DATA
    var UpdateCountryID = $("#UpdateCountryID");
    UpdateCountryID.empty();
    UpdateCountryID.append($("<option></option").val("").html("Select Country"));

    var UpdateStateID = $("#UpdateStateID");
    UpdateStateID.empty();
    UpdateStateID.append($("<option></option").val("").html("Select State"));

    var SearchRoleID = $("#SearchRoleID");
    SearchRoleID.empty();
    SearchRoleID.append($("<option></option").val("").html("Select Role"));

    var OrgCountryID = $("#OrgCountryID");
    OrgCountryID.empty();
    OrgCountryID.append($("<option></option").val("").html("Select Country"));

    var Role_ID = $("#Role_ID");
    Role_ID.empty();
    Role_ID.append($("<option></option").val("").html("Select Role"));

    var Department_ID = $("#Department_ID");
    Department_ID.empty();
    Department_ID.append($("<option></option").val("").html("Select Department"));

    $.ajax({
        url: '/UserAdmin/GetListData',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: 'json',
        success: function (data) {
            $.each(data.Country, function (i, val) {
                CountryID.append(
                    $("<option></option>").val(val.CountryID).html(val.CountryName)
                );
            });
            //UPDATE ASSIGN
            $.each(data.Country, function (i, val) {
                UpdateCountryID.append(
                    $("<option></option>").val(val.CountryID).html(val.CountryName)
                );
            });
            //ROLE
            $.each(data.Role, function (i, val) {
                SearchRoleID.append(
                    $("<option></option>").val(val.RoleID).html(val.RoleName)
                );
            });
            $.each(data.Country, function (i, val) {
                OrgCountryID.append(
                    $("<option></option>").val(val.CountryID).html(val.CountryName)
                );
            });
            $.each(data.Department, function (i, val) {
                Department_ID.append(
                    $("<option></option>").val(val.Department_ID).html(val.DepartName)
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

    $('#UpdateDOB').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true
    });

    var cachedCountryOptions = null;

    $('#UserTableContainer').jtable({
        title: 'Users List',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'Name ASC',
        recordsLoaded: function (event, data) {
            var rowCount = data.records.length;
            if (rowCount >= 1) {
                $('#UserTableContainer').find('.jtable-toolbar-item.jtable-toolbar-item-add-record').remove();
            }
        },
        actions: {
            listAction:
                function (postData, jtParams) {
                    console.log("Loading from custom function...");
                    return $.Deferred(function ($dfd) {
                        $.ajax({
                            url: '/UserAdmin/UsersList?roleID=0 &jtStartIndex=' + jtParams.jtStartIndex + '&jtPageSize=' + jtParams.jtPageSize + '&jtSorting=' + jtParams.jtSorting,
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
                },
            deleteAction: '/UserAdmin/DeleteUser'
        },
        fields: {
            User_ID: {
                key: true,
                create: false,
                edit: false,
                list: false
            },
            Custom: {
                title: '',
                width: '1%',
                sorting: false,
                create: false,
                edit: false,
                list: true,
                display: function (data) {
                    if (data.record) {
                        return '<div class="fa fa-search" style="color:green; cursor:pointer; font-size:13px" onclick=\"getView(' + data.record.User_ID + ')\"></div>';
                    }
                }
            },
            Name: {
                title: 'Name',
                width: '23%'
            },
            IDType: {
                list: true,
                create: false,
                edit: false,
                title: 'ID Type',
                width: '10%',
                type: 'radiobutton',
                options: { 'IC': 'IC', 'PP': 'Passport' }
            },
            ICNo: {
                title: 'IC No / Passport',
                width: '15%',
                edit: false
            },
            RoleName: {
                title: 'Role',
                width: '15%',
                edit: false
            },
            DepartmentName: {
                title: 'Department',
                width: '15%',
                edit: false
            },
            Mobile_No: {
                title: 'Mobile No',
                list: true
            },
            Email: {
                title: 'Email',
                list: true
            },
            Role_ID: {
                title: 'Role',
                list: false,
                options: '/UserAdmin/GetRole'
            },
            Department_ID: {
                title: 'Department',
                list: false,
                options: '/UserAdmin/GetDepartment'
            },
            User_Status: {
                title: 'Status',
                width: '12%',
                values: { '0': 'Passive', '1': 'Active' },
                defaultValue: '1',
                list: false
            },
            ActiveDate: {
                title: 'Active date',
                width: '15%',
                type: 'date',
                displayFormat: 'dd.mm.yy',
                list: false,
                create: false,
                edit: false,
                sorting: false //This column is not sortable!
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
                        return '<button title="Edit Record" class="jtable-command-button jtable-edit-command-button" onclick=\"getUpdate(' + data.record.User_ID + ')\; return false;"><span>Edit Record</span></button>';
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
    $('#UserTableContainer').jtable('load');
});

$("#SearchRoleID").change(function () {
    $('#UserTableContainer').jtable('load', {
        roleID: $('#SearchRoleID').val()
    });
});

$("#btnToFind").click(function () {
    $('#UserTableContainer').jtable('load', {
        roleID: $('#SearchRoleID').val(),
        ValueSearch: $('#searchID').val(),
        ValueToFind: $('#findID').val()
    });
});

$("#Role_ID").change(function () {

    var vRoleID = $('#Role_ID').val();

    if (vRoleID == "3") {
        $('#hideAPProjectTbl').show();
    }
    else {
        $('#hideAPProjectTbl').hide();
    }
});

$('#btnCreateNewUser').click(function () {
    $('#CreateUserForm')[0].reset();
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
        var OrgStateID = $("#OrgStateID");
        OrgStateID.empty();
        OrgStateID.append($("<option></option").val("").html("Select State"));

        $.ajax({
            url: '../UserAdmin/GetCreateStates/',
            type: "POST",
            data: { CountryID: OrgCountryID },
            dataType: "json",
            success: function (data) {
                $.each(data.State, function (i, val) {
                    OrgStateID.append(
                        $("<option></option>").val(val.StateID).html(val.StateName)
                    );
                });
            },
            error: function () {
            }
        });
    }
});

$("#Department_ID").change(function () {
    var Department_ID = parseInt($("#Department_ID").val());
    if (!isNaN(Department_ID)) {
        var RoleID = $("#Role_ID");
        RoleID.empty();
        RoleID.append($("<option></option").val("").html("Select Role"));

        $.ajax({
            url: '../UserAdmin/GetRoleID/',
            type: "POST",
            data: { DepartmentID: Department_ID },
            dataType: "json",
            success: function (data) {
                $.each(data.Role, function (i, val) {
                    RoleID.append(
                        $("<option></option>").val(val.RoleID).html(val.RoleName)
                    );
                });
            },
            error: function () {
            }
        });
    }
});

$('#btnNext').click(function () {

    var CreateUserForm = $("#CreateUserForm");
    var StateIDVal = $("#StateID").val();
    var CountryIDVal = $("#CountryID").val();

    CreateUserForm.validate({
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
            Department_ID: {
                required: true
            },
            Role_ID: {
                required: true
            },
            ICNo: {
                required: true
            },
            adminConfirmPin: {
                equalTo: "#adminPin",
                minlength: 6,
                maxlength: 15
            },
            CountryID: { valueNotEquals: "" },
            StateID: { valueNotEquals: "" },
            DOB: {
                required: true
            }
        },
        messages: {
            ICNo: {
                required: "IC No is required"
            },
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
                required: "Date of Birth is required"
            },
            Address: {
                required: "Address is required"
            },
            Postcode: {
                required: "Postcode is required"
            },
            City: {
                required: "City is required"
            },

            adminConfirmPin: {
                equalTo: "Please enter the same Pin as above"
            },
            CountryID: { valueNotEquals: "Please select Country!" },
            StateID: { valueNotEquals: "Please select State!" },
            DOB: {
                required: "Date of Birth is required"
            },
        }
    });

    $.validator.addMethod("valueNotEquals", function (value, element, arg) {
        return arg != value;
    }, "Value must not equal arg.");

    if (CreateUserForm.valid()) {
        var PassIDJSon = {
            ICNo: $('#ICNo').val(),
            RoleID: $('#Role_ID').val()
        }
        $.ajax({
            url: '/UserAdmin/CheckICExist',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(PassIDJSon),
            dataType: 'json',
            success: function (data) {
                if (data.Found == "Y") {
                    isValid = "Exist";
                    alert("IC No already exist for that Role");
                    return false;
                } else {
                    $("#personalDetails").hide();
                    $("#button1").hide();
                    $("#roleDetails").show();
                    $("#button2").show();

                    var ProjectID = $("#ProjectID");
                    ProjectID.empty();
                    ProjectID.append($("<option></option").val("").html("Select Project"));

                    var OrgStateID = $("#OrgStateID");
                    OrgStateID.empty();
                    OrgStateID.append($("<option></option").val("").html("Select State"));

                    $.ajax({
                        url: '/UserAdmin/GetCreateRole',
                        type: 'POST',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(),
                        dataType: 'json',
                        success: function (data) {
                            $.each(data.Project, function (i, val) {
                                ProjectID.append(
                                    $("<option></option>").val(val.ProjectId).html(val.ProjectName)
                                );
                            });
                        },
                        error: function (errorThrown) {
                        }
                    });
                }
            }
        });
    }
});

$('#btnPrev').click(function () {
    $("#personalDetails").show();
    $("#button1").show();
    $("#roleDetails").hide();
    $("#button2").hide();
});

$('#btnCreate').click(function () {

    var CreateAdminForm2 = $("#CreateAdminForm2");
    var OrgCountryIDVal = $('#OrgCountryID').val();
    var OrgStateIDVal = $('#OrgStateID').val();

    CreateAdminForm2.validate({
        rules: {
            OrgName: {
                required: true
            },
            OrgRegNo: {
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
            OrgFaxNo: {
                required: true,
                digits: true
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
            OrgRegNo: {
                required: "Organization register number is required"
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
            OrgFaxNo: {
                required: "Fax number is required"
            },
            OrgTelNo: {
                required: "Phone number is required"
            }
        }
    });

    if ($('#Department_ID').val() == "") {
        toastr["warning"]("Please select Department");
        return false;
    }
    if ($('#Role_ID').val() == "") {
        toastr["warning"]("Please select Role");
        return false;
    }

    if (CreateAdminForm2.valid()) {
        var $btn = $(this).button('loading')
        $('#btnPrev').hide();

        var createuser = {
            Role_ID: $('#Role_ID').val(),
            Department_ID: $('#Department_ID').val(),
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
            OrgName: $('#OrgName').val(),
            OrgRegNo: $('#OrgRegNo').val(),
            OrgAddress: $('#OrgAddress').val(),
            OrgCountryID: $('#OrgCountryID').val(),
            OrgStateID: $('#OrgStateID').val(),
            OrgPostcode: $('#OrgPostcode').val(),
            OrgCity: $('#OrgCity').val(),
            OrgFaxNo: $('#OrgFaxNo').val(),
            OrgTelNo: $('#OrgTelNo').val(),

            ProjectID: $('#ProjectID').val()
        };

        $.ajax({
            url: '/UserAdmin/CreateUser',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(createuser),
            dataType: 'json',
            success: function (data) {
                if (data.Result = "OK") {
                    toastr["success"](data.Message);
                    $btn.button('reset')
                    $('#createusermodal').modal('hide');
                    $('#UserTableContainer').jtable('load');
                }
                else {
                    toastr["error"](data.Message);
                    $btn.button('reset')
                }
            },
            error: function (errorThrown) {
                toastr["error"](errorThrown);
            }
        });
    }

});

$('#btnAddProject').click(function () {
    //var files = e.target.files;
    //var myID = 3; //uncomment this to make sure the ajax URL works
    //if (files.length > 0) {
    //    if (window.FormData !== undefined) {
    //        var data = new FormData();
    //        for (var x = 0; x < files.length; x++) {
    //            data.append("file" + x, files[x]);
    //        }

    var addnewpro = {
        ProjectID: $('#ProjectID').val()
    };

    $.ajax({
        url: '/UserAdmin/AddNewProject',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(addnewpro),
        dataType: 'json',
        success: function (result) {
            defineGridProject(result);
            //$("#projectGridTbl").trigger("reloadGrid");
            if ($("#projectGridTbl")[0].grid) {
                // grid is initialized
                var tGrid = jQuery("#projectGridTbl")[0];
                tGrid.addJSONData(result);
                //$("#documentGridTbl").trigger("reloadGrid");
            }
            else {
                defineGridDokumen(result);
                //$("#documentGridTbl").trigger("reloadGrid");
            }
        },
        error: function (errorThrown) {
        }
    });
    //} else {
    //    alert("This browser doesn't support HTML5 file uploads!");
    //}
});

var defineGridProject = function (data) {
    grid = $("#projectGridTbl");
    grid.jqGrid({
        datatype: 'local',
        data: data,
        colNames: ["", "Project Name", "Delete"],
        colModel: [
        { name: 'ProjectID', index: 'ProjectID', hidden: true, align: 'center', sorttype: 'int' },
        { name: 'ProjectName', index: 'ProjectName', width: 410 },
        { name: 'act2', index: 'act2', width: 80 }
        ],
        rowNum: 10,
        rownumbers: true,
        altRows: true,
        loadonce: false,
        sortname: 'ProjectID',
        viewrecords: true,
        sortorder: "desc",
        caption: "List of Project",
        autowidth: true,
        shrinkToFit: true,
        height: "auto",
        gridComplete: function () {
            var ids = jQuery("#projectGridTbl").jqGrid('getDataIDs');
            var rowData = jQuery("#projectGridTbl").jqGrid('getRowData');
            for (var i = 0; i < ids.length; i++) {
                mo = "<button type='button' style='color:red' onclick=\"delProject('" + ids[i] + "')\">DELETE</button>"
                jQuery("#projectGridTbl").jqGrid('setRowData', ids[i], { act2: mo });
            }
        }
    });
    $("#projectGridTbl").closest('.ui-jqgrid-bdiv').width($("#projectGridTbl").closest('.ui-jqgrid-bdiv').width() + 1);
    jQuery(".ui-jqgrid").removeClass("ui-widget ui-widget-content");
    jQuery(".ui-jqgrid").removeClass("ui-widget-content");
}

function delProject(rowId) {
    var r = confirm("Are You Sure To Delete?");
    if (r == true) {
        var data = $("#projectGridTbl").jqGrid('getRowData', rowId);
        $.ajax({
            type: 'POST',
            url: "../UserAdmin/delProject?id=" + data.ProjectID,
            success: function (resp) {
                //console.log(resp);
                $("#projectGridTbl").jqGrid('delRowData', rowId);
            },
            error: function (error) {
                //console.log(error);
            }
        });
    }
}

//REGION FOR UPDATE
function getUpdate(UserID) {

    $.LoadingOverlay("show");

    var UpdateOrgName = $("#UpdateOrgName");
    UpdateOrgName.empty();
    UpdateOrgName.append($("<option></option").val("").html("Select Organization"));

    var vUserID = UserID;

    $.ajax({
        url: '../UserAdmin/UpdateUsersList/',
        type: "POST",
        data: { UserID: vUserID },
        dataType: "json",
        success: function (data) {
            $('#UpdateIDType').val(data.vList.IDType);
            $('#UpdateICNo').val(data.vList.ICNo);
            $('#UpdateName').val(data.vList.Name);
            $('#UpdateEmail').val(data.vList.Email);
            $('#UpdateMobile_No').val(data.vList.Mobile_No);
            $('#UpdateGender').val(data.vList.Sex);
            $('#UpdateDOB').val(data.vList.DOB);
            $('#UpdateAddress').val(data.vList.Address);
            $('#UpdatePostcode').val(data.vList.Postcode);
            $('#UpdateCity').val(data.vList.City);
            $('#UpdateMobile_No').val(data.vList.Mobile_No);
            $('#UpdateEmail').val(data.vList.Email);

            UpdateUserIDs = UserID;

            var date = new Date(parseInt(data.vList.DOB.substr(6)));
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            var vdate = day + "/" + month + "/" + year;

            $('#UpdateDOB').val(vdate);

            $.each(data.OList, function (i, val) {
                UpdateOrgName.append(
                    $("<option></option>").val(val.CompanyID).html(val.CompanyName)
                );
            });

            var UpdateCountryID = $("#UpdateCountryID");
            var UpdateStateID = $("#UpdateStateID");
            UpdateStateID.empty();
            UpdateCountryID.val(data.vList.Country);
            var CountryVal = data.vList.Country;

            $.each(data.sState, function (i, val) {
                UpdateStateID.append(
                    $("<option></option>").val(val.StateID).html(val.StateName)
                );
            });
            UpdateStateID.val(data.vList.State);

            var UpdateOrgStateID = $("#UpdateOrgStateID");
            UpdateOrgStateID.empty();
            UpdateOrgStateID.append($("<option></option").val("").html("Select State"));
            var UpdateOrgCountryID = $("#UpdateOrgCountryID");
            UpdateOrgCountryID.empty();
            UpdateOrgCountryID.append($("<option></option").val("").html("Select Country"));
            var UpdateProject = $("#UpdateProject");
            UpdateProject.empty();
            UpdateProject.append($("<option></option").val("").html("Select Project"));
            $('#UpdateOrgRegNo').val('');
            $('#UpdateOrgAddress').val('');
            $('#UpdateOrgPostcode').val('');
            $('#UpdateOrgCity').val('');
            $('#UpdateOrgFaxNo').val('');
            $('#UpdateOrgTelNo').val('');

            $("#updatepersonalDetails").show();
            $("#updatebutton1").show();
            $("#updateroleDetails").hide();
            $("#updatebutton2").hide();
            $('#updateusermodal').modal({
                show: true,
                backdrop: 'static',
                keyboard: true
            });

            $.LoadingOverlay("hide");
        },
        error: function () {
            $.LoadingOverlay("hide");
        }
    });
}

$("#UpdateOrgName").change(function () {

    var UpdateOrgStateID = $("#UpdateOrgStateID");
    UpdateOrgStateID.empty();
    UpdateOrgStateID.append($("<option></option").val("").html("Select State"));

    var UpdateOrgCountryID = $("#UpdateOrgCountryID");
    UpdateOrgCountryID.empty();
    UpdateOrgCountryID.append($("<option></option").val("").html("Select Country"));

    var UpdateProject = $("#UpdateProject");
    UpdateProject.empty();
    UpdateProject.append($("<option></option").val("").html("Select Project"));

    var OrgID = parseInt($("#UpdateOrgName").val());
    if (!isNaN(OrgID)) {
        $("#updateOrgDetails").LoadingOverlay("show");

        $.ajax({
            url: '../UserAdmin/GetUpdateOrg/',
            type: "POST",
            data: { OrgID: OrgID },
            dataType: "json",
            success: function (data) {
                $('#UpdateOrgRegNo').val(data.CList.RegistrationNo);
                $('#UpdateOrgAddress').val(data.CList.RegistrationNo);
                $('#UpdateOrgPostcode').val(data.CList.Postcode);
                $('#UpdateOrgCity').val(data.CList.City);
                $('#UpdateOrgFaxNo').val(data.CList.Fax_No);
                $('#UpdateOrgTelNo').val(data.CList.Mobile_No);

                $.each(data.uState, function (i, val) {
                    UpdateOrgStateID.append(
                        $("<option></option>").val(val.StateID).html(val.StateName)
                    );
                });
                $.each(data.uCountry, function (i, val) {
                    UpdateOrgCountryID.append(
                        $("<option></option>").val(val.CountryID).html(val.CountryName)
                    );
                });
                $.each(data.uProject, function (i, val) {
                    UpdateProject.append(
                        $("<option></option>").val(val.ProjectId).html(val.ProjectName)
                    );
                });
                $('#UpdateOrgCountryID').val(data.CList.Country);
                $('#UpdateOrgStateID').val(data.CList.State);
                $('#UpdateProject').val(data.CList.ProjectId);
                $("#updateOrgDetails").LoadingOverlay("hide", true);
            },
            error: function () {
                $("#updateOrgDetails").LoadingOverlay("hide", true);
            }
        });
    } else {
        $('#UpdateOrgRegNo').val('');
        $('#UpdateOrgAddress').val('');
        $('#UpdateOrgPostcode').val('');
        $('#UpdateOrgCity').val('');
        $('#UpdateOrgFaxNo').val('');
        $('#UpdateOrgTelNo').val('');
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
            }
        });
    }
});

$('#btnUpdate').click(function () {

    var UpdateUserFormz1 = $("#UpdateUserFormz1");

    if (UpdateUserFormz1.valid()) {
        //var $btn = $(this).button('loading')
        var r = confirm("Are you sure UPDATE?");
        if (r == true) {
            var updateuserzJson = {
                //IDType: $('#IDType').val(),
                UpdateUserIDs: UpdateUserIDs,
                UpdateICNo: $('#UpdateICNo').val(),
                UpdateName: $('#UpdateName').val(),
                UpdateEmail: $('#UpdateEmail').val(),
                UpdateMobile_No: $('#UpdateMobile_No').val(),
                UpdateGender: $('#UpdateGender').val(),
                UpdateDOB: $('#UpdateDOB').val(),
                UpdateAddress: $('#UpdateAddress').val(),
                UpdateCountryID: $('#UpdateCountryID').val(),
                UpdateStateID: $('#UpdateStateID').val(),
                UpdatePostcode: $('#UpdatePostcode').val(),
                UpdateCity: $('#UpdateCity').val()
            };

            $.ajax({
                url: '/UserAdmin/UpdateUser',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(updateuserzJson),
                dataType: 'json',
                success: function (data) {
                    if (data.Result = "OK") {
                        toastr["success"](data.Message);
                        //$('#updateusermodal').modal('hide');
                        $('#UserTableContainer').jtable('load');
                    }
                    else {
                        toastr["error"](data.Message);
                    }
                },
                error: function (errorThrown) {
                    toastr["error"](errorThrown);
                }
            });
        }
    }

});

$('#btnOrgUpdate').click(function () {

    var UpdateOrgForm = $("#UpdateOrgForm");

    UpdateOrgForm.validate({
        rules: {
            UpdateOrgName: {
                required: true
            },
            UpdateOrgRegNo: {
                required: true
            },
            UpdateOrgAddress: {
                required: true
            },
            UpdateOrgCountryID: {
                required: true
            },
            UpdateOrgStateID: {
                required: true
            },
            UpdateOrgPostcode: {
                required: true
            },
            UpdateOrgCity: {
                required: true
            },
            UpdateOrgTelNo: {
                required: true
            },
            UpdateProject: {
                required: true
            }
        }
    });

    if (UpdateOrgForm.valid()) {
        var r = confirm("Are you sure UPDATE?");
        if (r == true) {
            $("#updateOrgDetails").LoadingOverlay("show");
            var UpdateOrguserJson = {
                UpdateOrgName: $('#UpdateOrgName').val(),
                UpdateOrgRegNo: $('#UpdateOrgRegNo').val(),
                UpdateOrgAddress: $('#UpdateOrgAddress').val(),
                UpdateOrgCountryID: $('#UpdateOrgCountryID').val(),
                UpdateOrgStateID: $('#UpdateOrgStateID').val(),
                UpdateOrgPostcode: $('#UpdateOrgPostcode').val(),
                UpdateOrgCity: $('#UpdateOrgCity').val(),
                UpdateOrgFaxNo: $('#UpdateOrgFaxNo').val(),
                UpdateOrgTelNo: $('#UpdateOrgTelNo').val(),
                UpdateOrgProjectID: $('#UpdateProject').val()
            };

            $.ajax({
                url: '/UserAdmin/UpdateOrgUser',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(UpdateOrguserJson),
                dataType: 'json',
                success: function (data) {
                    if (data.Result = "OK") {
                        //toastr["success"](data.Message);
                        $("#updateOrgDetails").LoadingOverlay("hide", true);
                        //bootbox.dialog({
                        //    message: data.Message,
                        //    title: "<i class='fa fa-info-circle'></i>" + "Info",
                        //    buttons: {
                        //        ok: {
                        //            label: "OK",
                        //            className: "btn-success",
                        //            callback: function () {
                        //            }
                        //        }
                        //    }
                        //});
                        toastr["success"](data.Message);
                        //$('#updateusermodal').modal('hide');
                        $('#UserTableContainer').jtable('load');
                    }
                    else {
                        $("#updateOrgDetails").LoadingOverlay("hide", true);
                        toastr["error"](data.Message);
                    }
                },
                error: function (errorThrown) {
                    $("#updateOrgDetails").LoadingOverlay("hide", true);
                    toastr["error"](errorThrown);
                }
            });
        }
    }
});

//REGION FOR ADD NEW ORG
$('#btnAddNewOrg').click(function () {

    var NewAddOrgStateID = $("#NewAddOrgStateID");
    NewAddOrgStateID.empty();
    NewAddOrgStateID.append($("<option></option").val("").html("Select State"));

    var NewAddOrgCountryID = $("#NewAddOrgCountryID");
    NewAddOrgCountryID.empty();
    NewAddOrgCountryID.append($("<option></option").val("").html("Select Country"));

    var NewAddOrgProject = $("#NewAddOrgProject");
    NewAddOrgProject.empty();
    NewAddOrgProject.append($("<option></option").val("").html("Select Project"));

    $.ajax({
        url: '../UserAdmin/GetUpdateOrgNew/',
        type: "POST",
        //data: { OrgID: OrgID },
        dataType: "json",
        success: function (data) {
            $.each(data.uState, function (i, val) {
                NewAddOrgStateID.append(
                    $("<option></option>").val(val.StateID).html(val.StateName)
                );
            });
            $.each(data.uCountry, function (i, val) {
                NewAddOrgCountryID.append(
                    $("<option></option>").val(val.CountryID).html(val.CountryName)
                );
            });
            $.each(data.uProject, function (i, val) {
                NewAddOrgProject.append(
                    $("<option></option>").val(val.ProjectId).html(val.ProjectName)
                );
            });
        },
        error: function (errorThrown) {
        }
    });

    $("#UpdateOrgForm").hide();
    $("#NewOrgForm").show();
});
$('#btnExistingProject').click(function () {
    $("#UpdateOrgForm").show();
    $("#NewOrgForm").hide();
});
$('#btnSaveAddNewOrg').click(function () {

    var NewOrgForm = $("#NewOrgForm");

    NewOrgForm.validate({
        rules: {
            NewAddOrgName: {
                required: true
            },
            NewAddOrgRegNo: {
                required: true
            },
            NewAddOrgAddress: {
                required: true
            },
            NewAddOrgCountryID: {
                required: true
            },
            NewAddOrgStateID: {
                required: true
            },
            NewAddOrgPostcode: {
                required: true
            },
            NewAddOrgCity: {
                required: true
            },
            NewAddOrgTelNo: {
                required: true
            },
            NewAddOrgProject: {
                required: true
            }
        }
    });

    if (NewOrgForm.valid()) {
        var r = confirm("Are you sure ADD NEW ORGANIZATION?");
        if (r == true) {
            $("#NewOrgForm").LoadingOverlay("show");
            var UpdateOrguserJson = {
                NewAddUserID: UpdateUserIDs,
                NewAddOrgName: $('#NewAddOrgName').val(),
                NewAddOrgRegNo: $('#NewAddOrgRegNo').val(),
                NewAddOrgAddress: $('#NewAddOrgAddress').val(),
                NewAddOrgCountryID: $('#NewAddOrgCountryID').val(),
                NewAddOrgStateID: $('#NewAddOrgStateID').val(),
                NewAddOrgPostcode: $('#NewAddOrgPostcode').val(),
                NewAddOrgCity: $('#NewAddOrgCity').val(),
                NewAddOrgFaxNo: $('#NewAddOrgFaxNo').val(),
                NewAddOrgTelNo: $('#NewAddOrgTelNo').val(),
                NewAddOrgProject: $('#NewAddOrgProject').val()
            };

            $.ajax({
                url: '/UserAdmin/AddNewOrgUser',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(UpdateOrguserJson),
                dataType: 'json',
                success: function (data) {
                    if (data.Result = "OK") {
                        //toastr["success"](data.Message);
                        $("#NewOrgForm").LoadingOverlay("hide", true);
                        toastr["success"](data.Message);
                        //$('#updateusermodal').modal('hide');
                        $('#UserTableContainer').jtable('load');
                    }
                    else {
                        $("#NewOrgForm").LoadingOverlay("hide", true);
                        toastr["error"](data.Message);
                    }
                },
                error: function (errorThrown) {
                    $("#NewOrgForm").LoadingOverlay("hide", true);
                    toastr["error"](errorThrown);
                }
            });
        }
    }
});

//GET USER VIEW
function getView(UserID) {

    var vUserID = UserID;

    $.ajax({
        url: '../UserAdmin/ViewUsersList/',
        type: "POST",
        data: { UserID: vUserID },
        dataType: "json",
        success: function (data) {
            $('#ViewIDType').html(data.BO.IDType);
            $('#ViewICNo').html(data.BO.ICNo);
            $('#ViewName').html(data.BO.Name);
            $('#ViewEmail').html(data.BO.Email);
            $('#ViewTelNo').html(data.BO.Mobile_No);
            var vGender = "";
            if (data.BO.Sex == "M") {
                vGender = "Male";
            } else if (data.BO.Sex == "F") {
                vGender = "Female";
            } else {
                vGender = "Unknown";
            }
            $('#ViewGender').html(vGender);
            $('#ViewAddress').html(data.BO.Address);
            $('#ViewCountry').html(data.BO.Country);
            $('#ViewState').html(data.BO.State);
            $('#ViewPostcode').html(data.BO.Postcode);
            $('#ViewCity').html(data.BO.City);
            $('#ViewRole').html(data.BO.RoleName);
            $('#ViewDepartment').html(data.BO.DepartmentName);

            var date = new Date(parseInt(data.BO.DOB.substr(6)));
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            var vdate = day + "/" + month + "/" + year;
            $('#ViewDOB').html(vdate);

            var Avdate = "";
            if (data.BO.ActiveDate == "" || data.BO.ActiveDate == null) {
                Avdate = "User Not Active Yet";
            } else {
                var Adate = new Date(parseInt(data.BO.ActiveDate.substr(6)));
                var Amonth = Adate.getMonth() + 1;
                var Aday = Adate.getDate();
                var Ayear = Adate.getFullYear();
                Avdate = Aday + "/" + Amonth + "/" + Ayear;
            }
            $('#ViewActiveDate').html(Avdate);

            $('#viewUserModal').modal({
                show: true,
                backdrop: 'static',
                keyboard: true
            });
        },
        error: function () {
        }
    });
}

$('#is').on('ifChecked', function (event) {
    $("#OrgName").val(" SDN BHD");
    $("#OrgRegNo").val("457608-K");
    $("#OrgAddress").val("NO 3-20 & 3-22, JALAN JALIL PERKASA 14, AKED ESPLANED");
    $("#OrgCountryID").val("135");
    $("#OrgPostcode").val("57000");
    $("#OrgCity").val("KUALA LUMPUR");
    $("#OrgFaxNo").val("0389928811");
    $("#OrgTelNo").val("0389928888");

    $.ajax({
        url: '../UserAdmin/GetCreateStates/',
        type: "POST",
        data: { CountryID: "135" },
        dataType: "json",
        success: function (data) {
            $.each(data.State, function (i, val) {
                $("#OrgStateID").append(
                    $("<option></option>").val(val.StateID).html(val.StateName)
                );
            });
            $("#OrgStateID").val(14);
        },
        error: function () {
        }
    });
});
$('#is').on('ifUnchecked', function (event) {
    $("#OrgName").val('');
    $("#OrgRegNo").val('');
    $("#OrgAddress").val('');
    $("#OrgCountryID").val("");
    $("#OrgStateID").val("");
    $("#OrgPostcode").val('');
    $("#OrgCity").val('');
    $("#OrgFaxNo").val('');
    $("#OrgTelNo").val('');
});