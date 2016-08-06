$(document).ready(function () {
    var cachedClassIDOptions = null;
    var cachedGroupOptions = null;
    $('#CertificateProcedureContainer').jtable({
        title: 'Certificate Procedure',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'ProcedureId ASC',
        actions: {
            listAction:
                function (postData, jtParams) {
                    console.log("Loading from custom function...");
                    return $.Deferred(function ($dfd) {
                        $.ajax({
                            url: '/CertificateProcedure/CertificateProcedureList?jtStartIndex=' + jtParams.jtStartIndex + '&jtPageSize=' + jtParams.jtPageSize + '&jtSorting=' + jtParams.jtSorting,
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
            createAction:
                 function (postData) {
                     return $.Deferred(function ($dfd) {
                         $.ajax({
                             url: '/CertificateProcedure/CreateCertificateProcedure',
                             type: 'POST',
                             dataType: 'json',
                             data: postData,
                             success: function (data) {
                                 $dfd.resolve(data);
                                 if (data.Result == 'OK') {
                                     alert(data.Message);
                                     return;
                                 }
                             },
                             error: function () {
                                 $dfd.reject();
                             }
                         });
                     });
                 },
            deleteAction:
              function (postData) {
                  return $.Deferred(function ($dfd) {
                      $.ajax({
                          url: '/CertificateProcedure/DeleteCertificateProcedure',
                          type: 'POST',
                          dataType: 'json',
                          data: postData,
                          success: function (data) {
                              $dfd.resolve(data);
                              if (data.Result == 'OK') {
                                  alert(data.Message);
                                  return;
                              }
                          },
                          error: function () {
                              $dfd.reject();
                          }
                      });
                  });
              },
            updateAction:
             function (postData) {
                 return $.Deferred(function ($dfd) {
                     $.ajax({
                         url: '/CertificateProcedure/UpdateCertificateProcedure',
                         type: 'POST',
                         dataType: 'json',
                         data: postData,
                         success: function (data) {
                             $dfd.resolve(data);
                             if (data.Result == 'OK') {
                                 alert(data.Message);
                                 return;
                             }
                             //alert(data.Message);
                         },
                         error: function () {
                             $dfd.reject();
                         }
                     });
                 });
             }

        },
        fields: {
            ProcedureId: {
                key: true,
                create: false,
                edit: false,
                list: false
            },
            ProcedureName: {
                title: 'Procedure Name',
                width: '23%',
                visibility: 'fixed',

            },

            ClassID: {
                title: 'ClassID',
                width: '13%',
                options: function () {
                    if (cachedClassIDOptions) { //Check for cache
                        return cachedClassIDOptions;
                    }
                    var options = [];
                    $.ajax({ //Not found in cache, get from server
                        url: '/CertificateProcedure/GetClassID',
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        success: function (data) {
                            if (data.Result != 'OK') {
                                alert(data.Message);
                                return;
                            }
                            options = data.Options;
                        }
                    });
                    return cachedClassIDOptions = options; //Cache results and return options
                }

            },
            StartDate: {
                title: 'Start Date',
                width: '13%',
                type: 'date',
                displayFormat: 'yy-mm-dd'
            },
            EndDate: {
                title: 'End Date',
                width: '13%',
                type: 'date',
                displayFormat: 'yy-mm-dd'
            },
            Status: {
                title: 'Status',
                type: 'checkbox',
                width: '12%',
                values: { '0': 'Inactive', '1': 'Active' },
                defaultValue: '1'

            },


        }
    });

    //Load list from server
    $('#CertificateProcedureContainer').jtable('load');
});

