$(document).ready(function () {

    var cachedCountryOptions = null;

    $('#MenuTableContainer').jtable({
        title: 'Menu List',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'Menu_ID ASC',
        recordsLoaded: function (event, data) {
            var rowCount = data.records.length;
            if (rowCount >= 1) {
               // $('#MenuTableContainer').find('.jtable-toolbar-item.jtable-toolbar-item-add-record').remove();
               
            }
        },
        actions: {
            listAction:
                    function (postData, jtParams) {
                        console.log("Loading from custom function...");
                        return $.Deferred(function ($dfd) {
                            $.ajax({
                                url: '/Menu/MenuList?jtStartIndex=' + jtParams.jtStartIndex + '&jtPageSize=' + jtParams.jtPageSize + '&jtSorting=' + jtParams.jtSorting,
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
                                url: '/Menu/CreateNewMenu',
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
                        url: '/Menu/DeleteMenu',
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
            updateAction: function (postData) {
                return $.Deferred(function ($dfd) {
                    $.ajax({
                        url: '/Menu/UpdateMenu',
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

        },
        fields: {
            Menu_ID: {
                title:'Menu ID',
                key: true,
                create: false,
                edit: false,
                list: true
            },
            Menuname: {
                title: 'Name',
                width: '23%'
            },
            MenuparentID: {
                title: 'MenuparentID',
                Width: '10%'
            },
            Menu_URL: {
                title: 'Menu_URL',
                Width:'10%'
            },
            ModuleSeqNo: {
                title: 'ModuleSeqNo',
                Widht:'10%'
            },
            SubMenuParentID: {
                title: 'SubMenuParentID',
                Widht:'10%'
            }
        },
    });
    $('#MenuTableContainer').jtable('load');
});