
$('#btnPublicRevokeConfirm').click(function (e) {
    e.preventDefault();

    var r = confirm("Are you CONFIRM to Request Revoke!");
    if (r == true) {

        $.LoadingOverlay("show");

        var idList = new Array();
        var idList2 = new Array();
        var loopCounter = 0;
        var loopCounter2 = 0;

        //find all the checked checkboxes
        jQuery("input[name='V1Reason']:checked").each
        (
          function () {
              //fill the array with the values
              idList[loopCounter] = jQuery(this).val();
              loopCounter += 1;
          }
        );

        //find all the checked checkboxes
        jQuery("input[name='V2Reason']:checked").each
        (
          function () {
              //fill the array with the values
              idList2[loopCounter2] = jQuery(this).val();
              loopCounter2 += 1;
          }
        );

        var revokeidreason = {
            V1Reason: idList,
            V2Reason: idList2,
            ReasonOthers: $('#revothers').val()
        };
        $.ajax({
            url: '/Public/saveRequestRevoke',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(revokeidreason),
            dataType: 'json',
            success: function (data) {
                if (data.Result == "OK") {
                    window.location.href = data.urlSent;
                    //alert(data.Message);
                }
                else if (data.Result == "WARNING") {
                    $.LoadingOverlay("hide");
                    alert(data.Message);
                    //window.location.href = data.urlSent;
                }
                else {
                    $.LoadingOverlay("hide");
                    alert(data.Message);
                    //window.location.href = data.urlSent;
                }
            },
            error: function (errorThrown) {
                $.LoadingOverlay("hide");
                alert(errorThrown)
            }
        });
    } else {
    }
});

$('#revokeFile').on('change', function (e) {
    var files = e.target.files;
    var type = "";
    var myID = "Revocation Authorization Letter";
    if (files.length > 0) {
        if (window.FormData !== undefined) {
            var data = new FormData();
            for (var x = 0; x < files.length; x++) {
                data.append("file" + x, files[x]);
                if (files[x].size > 1000000) {
                    toastr["error"]("File size is more than 1MB");
                    return false;
                }
                type = files[x].type;
                if (type == "application/pdf" || type == "image/jpeg" || type == "image/png") {

                }
                else {
                    toastr["error"]("File type allowed only pdf,png,jpg");
                    $('#revokeFile').val("");
                    return false;
                }
            }

            $.ajax({
                type: "POST",
                url: '/Public/uploadRequestRevokeFile?id=' + myID,
                contentType: false,
                processData: false,
                data: data,
                success: function (result) {
                    if (result.status == "Failed") {
                        toastr["error"]("Failed to upload Revocation Authorization Letter");
                        $('#revokeFile').val("");
                    }
                    else {
                        toastr["success"]("Revocation Authorization Letter Upload Success");
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