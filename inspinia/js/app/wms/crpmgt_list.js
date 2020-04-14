$(document).ready(function () {
    var table = $('table#table').DataTable({
        ajax: {
            url:baseUrl + '/datatable',
            data: function(d){
                var reqArriveTime = $("#reqArriveTime").val();
                d.reqArriveTime = reqArriveTime;
                d.souWarehouseId = $("#souWarehouse").val();
                d.desWarehouseId = $("#desWarehouse").val();
                d.desDockId = $("#desDock").val();
                //不需要送货路径
                // d.dLineId = $("#dLine").val();
                d.partId = $('.search-form').find('select[name="partNo"]').val();
                d.sheetNo = $('#sheetNo').val();
                d.sheetStatus = $('.search-form').find('select[name="sheetStatus"]').val();
                d.isEmergent = $("#isEmergent").val();
                d.createdDate = $("#createdDate").val();
                return d;
            }
        },
        order: [
            [1, 'DESC']
        ],
        columns : [{
            data: 'id',
            sortable: false,
            defaultContent: '',
            'class': 'text-center',
            render: function (data, type, row, meta) {
                return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
            }
        },
            {name: 'sheetNo', data: 'sheetNo', defaultContent: ''},
            {
                data: 'sheetStatus',
                name: 'sheetStatus',
                render: function (data, type, row, meta) {
                    return VALUES_MAP_DICT_STATUS && VALUES_MAP_DICT_STATUS[data] ? VALUES_MAP_DICT_STATUS[data].text : '';
                }
            },
            {data: 'souWarehouse.no', defaultContent: ''},
            {data: 'desWarehouse.no', defaultContent: ''},
            {data: 'desDock.no', defaultContent: ''},
            // {data: 'dLine.no', defaultContent: ''},
            {data: 'reqArriveTime', defaultContent: ''},
            {data: 'issuesTime', defaultContent: ''},
            {data: 'createdBy', defaultContent: ''},
            {data: 'createdDate', defaultContent: ''},
            {
                data: 'isEmergent',
                name: 'isEmergent',
                render: function (data, type, row, meta) {
                    return data == "1" ? "是" : "否";
                }
            },
            {
                data: "id",
                defaultContent: '',
                sortable: false,
                'class': 'text-center',
                render: function (data, type, row, meta) {
                    return '<a class="btn btn-default btn-xs" title="明细" href="'+rootUrl+'/wms/crppart/'+ row.id + '"><i class="fa fa-list"></i></a>'
                        + '&nbsp;&nbsp;'
                        + '<a class="btn btn-default btn-xs" target="_Blank" title="打印" href="'+rootUrl + '/wms/crpsheet/print/'+row.id + '"><i class="fa fa-print"></i></a>';
                }
            },
            {
                data: "",
                defaultContent: '',
                sortable: false,
                'class': 'text-center',
                render: function (data, type, row, meta) {
                    var div = "";
                    if (row.sheetStatus == '1') {
                        div= '<div class="btn-group">' +
                            '<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl + '/edit/' + row.id + '"><i class="fa fa-edit"></i></a>' +
                            '<a class="btn btn-default btn-xs del" title="删除" href="#"><i class="fa fa-trash-o"></i></a>' +
                            '</div>' +
                            '&nbsp;&nbsp;';
                    }
                    return div;
                }
            }]
    });

    $("#desWarehouse").select2({
        ajax: {
            url: rootUrl + "/api/master/warehouses",
        }
    });

    $("#souWarehouse").select2({
        ajax: {
            url: rootUrl + "/api/master/warehouses",
        }
    });

    $("#desDock").select2({
        ajax: {
            url: rootUrl + "/api/master/docks",
        }
    });

    // $("#dLine").select2({
    //     ajax: {
    //         url: rootUrl + "/api/master/dLines",
    //     }
    // });

    $("#partNo").select2({
        ajax : {
            url : rootUrl + "/api/master/parts",
            data : function(params) {
                params.q = params.term;
                return params;
            }
        }
    });

    $('#reqArriveTime').daterangepicker({
        format : 'YYYY-MM-DD HH:mm:ss',
        showDropdowns : true,
        showWeekNumbers : true,
        timePicker : true,
        timePickerIncrement : 1,
        timePicker24Hour : true,
        opens : 'right',
        drops : 'down',
        locale: {
            applyLabel: '确认',
            cancelLabel: '取消',
            fromLabel : '起始时间',
            toLabel : '结束时间',
            customRangeLabel : '自定义',
            firstDay : 1
        },
        ranges : {
            '今天' : [ moment({hour: 0, minute: 0, second: 0}), moment({hour: 23, minute: 59, second: 59}) ],
            '昨天' : [ moment({hour: 0, minute: 0, second: 0}).subtract(1, 'days'), moment({hour: 23, minute: 59, second: 59}).subtract(1, 'days') ],
            '近7天' : [ moment({hour: 0, minute: 0, second: 0}).subtract(6, 'days'), moment({hour: 23, minute: 59, second: 59}) ],
            '近30天' : [ moment({hour: 0, minute: 0, second: 0}).subtract(29, 'days'), moment({hour: 23, minute: 59, second: 59}) ],
            '当月' : [ moment().startOf('month'), moment().endOf('month') ],
            '上月' : [ moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month') ]
        },
        startDate : moment().subtract(1, 'days'),
        endDate : moment()
    }, function(start, end) {
        $('#reqArriveTime').val(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
    });

    $('#createdDate').daterangepicker({
        format : 'YYYY-MM-DD HH:mm:ss',
        showDropdowns : true,
        showWeekNumbers : true,
        timePicker : true,
        timePickerIncrement : 1,
        timePicker24Hour : true,
        opens : 'right',
        drops : 'down',
        locale: {
            applyLabel: '确认',
            cancelLabel: '取消',
            fromLabel : '起始时间',
            toLabel : '结束时间',
            customRangeLabel : '自定义',
            firstDay : 1
        },
        ranges : {
            '今天' : [ moment({hour: 0, minute: 0, second: 0}), moment({hour: 23, minute: 59, second: 59}) ],
            '昨天' : [ moment({hour: 0, minute: 0, second: 0}).subtract(1, 'days'), moment({hour: 23, minute: 59, second: 59}).subtract(1, 'days') ],
            '近7天' : [ moment({hour: 0, minute: 0, second: 0}).subtract(6, 'days'), moment({hour: 23, minute: 59, second: 59}) ],
            '近30天' : [ moment({hour: 0, minute: 0, second: 0}).subtract(29, 'days'), moment({hour: 23, minute: 59, second: 59}) ],
            '当月' : [ moment().startOf('month'), moment().endOf('month') ],
            '上月' : [ moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month') ]
        },
        startDate : moment().subtract(1, 'days'),
        endDate : moment()
    }, function(start, end) {
        $('#createdDate').val(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
    });

    table.on('click', '.del', function () {
        var id = table.row($(this).parents('tr')).data().id;
        $("#delForm #ids").val(id);
        if (id) {
            bootbox.confirm("确定要删除数据吗?", function (result) {
                if (result) {
                    $("#delForm").submit();
                }
            });
        }
    });
    $(".btn.delAll").on("click", function (e) {
        var ids = [];
        $('#table>tbody input:checked').each(function (i, item) {
            ids.push($(item).val());
        });
        $("#delForm #ids").val(ids.join(","));
        if (ids.length > 0) {
            bootbox.confirm("确定要删除选中的数据吗?", function (result) {
                if (result) {
                    $("#delForm").submit();
                }
            });
        } else {
            bootbox.alert("请选择要删除的数据.");
        }
    });
    $(".btn.sendAll").on("click", function (e) {
        var ids = [];
        $('#table>tbody input:checked').each(function (i, item) {
            ids.push($(item).val());
        });
        $("#sendForm #sendIds").val(ids.join(","));
        if (ids.length > 0) {
            bootbox.confirm("确定要发布选中的数据吗?", function (result) {
                if (result) {
                    $("#sendForm").submit();
                }
            });
        } else {
            bootbox.alert("请选择要发布的数据.");
        }
    });

    $('#search').on("click", function (e) {
        table.draw();
        //阻止表单submit
        return false;
    });

    /**
     * 关闭单据
     */
    $("#closeSheetButton").on("click", function(e) {
        var ids = [];
        $('#table>tbody input:checked').each(function(i, item) {
            ids.push($(item).val());
        });
        if(ids.length == 0) {
            bootbox.alert("请选择要关闭的单据数据.");
        } else {
            bootbox.confirm("确定要关闭选中的单据数据吗?",
                function(result) {
                    if (!result) {
                        return;
                    } else { for (var i = 0; i < ids.length; i++) {
                        $.post(baseUrl + "/close", {
                            ids: ids
                        }, function (res) {
                            toastr.info('操作成功!');
                            $('#table>tbody input:checked').each(function(i, item) {
                                this.checked = false;
                            });
                        });
                    }
                    }
                });
        }
    });

    //导出 动态组织form提交
    $(".btn.export").on("click", function (e) {
        $("#exportForm .param").remove();
        var $frm = $("#exportForm");
        var array = $('.search-form').serializeArray();
        for (i = 0, length = array.length; i < length; i++) {
            key = array[i].name;
            value = array[i].value;
            $frm.append($('<input class="param" type="hidden" name = "' + key + '" value = "' + value + '" />'));
        }

        $frm.append($('<input class="param" type="hidden" name = "requiredTimes" value = "' + $("#reqArriveTime").val() + '" />'));
        $frm.append($('<input class="param" type="hidden" name = "souWarehouseId" value = "' + $("#souWarehouse").val() + '" />'));
        $frm.append($('<input class="param" type="hidden" name = "desWarehouseId" value = "' + $("#desWarehouse").val() + '" />'));
        $frm.append($('<input class="param" type="hidden" name = "desDockId" value = "' + $("#desDock").val() + '" />'));
        // $frm.append($('<input class="param" type="hidden" name = "dLineId" value = "' + $("#dLine").val() + '" />'));
        $frm.append($('<input class="param" type="hidden" name = "partId" value = "' + $('.search-form').find('select[name="partNo"]').val() + '" />'));
        $frm.append($('<input class="param" type="hidden" name = "sheetNo" value = "' + $("#sheetNo").val() + '" />'));
        $frm.append($('<input class="param" type="hidden" name = "sheetStatus" value = "' + $("#sheetStatus").val() + '" />'));
        $frm.append($('<input class="param" type="hidden" name = "isEmergent" value = "' + $("#isEmergent").val() + '" />'));
        $frm.submit();
        // 阻止默认行为
        e.preventDefault();
        return false;
    });
});
