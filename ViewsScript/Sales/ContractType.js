$(document).ready(function () {
    var cachedDepartmentOptions = null;
    var cachedGroupOptions = null;
    $('#ContractTypeContainer').jtable({
        title: 'Contractor Type',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'ContractorTypeID ASC',
        actions: {
            listAction:
                function (postData, jtParams) {
                    console.log("Loading from custom function...");
                    return $.Deferred(function ($dfd) {
                        $.ajax({
                            url: '/ContractorType/ContractorTypeList?jtStartIndex=' + jtParams.jtStartIndex + '&jtPageSize=' + jtParams.jtPageSize + '&jtSorting=' + jtParams.jtSorting,
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
                             url: '/ContractorType/CreateContractType',
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
                          url: '/ContractorType/DeleteContractType',
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
                         url: '/ContractorType/UpdateContractType',
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
            ContractorTypeID: {
                key: true,
                create: false,
                edit: false,
                list: true
            },

            ContractorTypeName: {
                title: 'ContractorType Name',
                width: '23%',
                visibility: 'fixed',

            },

        }
    });

    //Load list from server
    $('#ContractTypeContainer').jtable('load');
});

