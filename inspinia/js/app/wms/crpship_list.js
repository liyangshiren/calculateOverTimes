$(document).ready(function () {
    var paramArea = "";
    var table = $('table#table').DataTable({
        ajax: {
            url:baseUrl + '/datatable',
            data: function(d){
                // d["crp.reqArriveTime"] = $("#reqArriveTime").val();
                d["sheetStatus"]= $('.search-form').find('select[name="sheetStatus"]').val();
                d["partId"] = $('.search-form').find('select#partNo').val();
                d["barcode"] = $('#barcode').val();
                return d;
            }
        },
        order: [
            [4, 'desc']
        ],
        searchCols: [{

        }],
        columns : [{
            data: 'id',
            sortable: false,
            defaultContent: '',
            'class': 'text-center',
            render: function (data, type, row, meta) {
                return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
            }
        }, {
            name: 'shipBillNo',
            data: 'shipBillNo'
        }, {
            name: 'sheetStatus',
            data: 'sheetStatus',
            visible : false
        }, {
            data: 'sheetStatus',
            render: function (data, type, row, meta) {
                return (data+"-")+(VALUES_MAP_DICT_STATUS && VALUES_MAP_DICT_STATUS[data] ? VALUES_MAP_DICT_STATUS[data].text : '');
            }
        }, {
            name: 'shipTime',
            data: 'shipTime'
        }, {
            name: 'sapAreaCode',
            data: 'sapAreaCode'
        }, {
            data: "id",
            defaultContent: '',
            sortable: false,
            'class': 'text-center',
            render: function (data, type, row, meta) {
                return '<a class="btn btn-default btn-xs" href="/"><i class="fa fa-list"><'+baseUrl + '/'+row.id + 'i></a>';
            }
        }]
    });

    $('.search-form').on("submit", function (e) {
        var shipBillNo = $('.search-form').find('input[name="shipBillNo"]').val();
        var sheetStatus = $('.search-form').find('select[name="sheetStatus"]').val();
        table.column('shipBillNo:name').search(shipBillNo);
        table.column('sheetStatus:name').search(sheetStatus);
        table.draw();
        //阻止表单submit
        return false;
    });

    // $('#reqArriveTime').daterangepicker({
    //     format: 'YYYY-MM-DD HH:mm:ss',
    //     showDropdowns: true,
    //     showWeekNumbers: true,
    //     timePicker: true,
    //     timePickerIncrement: 1,
    //     timePicker24Hour: true,
    //     opens: 'right',
    //     drops: 'down',
    //     locale: {
    //         applyLabel: '确认',
    //         cancelLabel: '取消',
    //         fromLabel : '起始时间',
    //         toLabel : '结束时间',
    //         customRangeLabel : '自定义',
    //         firstDay : 1
    //     },
    //     ranges: {
    //         '今天': [moment(), moment()],
    //         '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    //         '近7天': [moment().subtract(6, 'days'), moment()],
    //         '近30天': [moment().subtract(29, 'days'), moment()],
    //         '当月': [moment().startOf('month'), moment().endOf('month')],
    //         '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    //     },
    //     startDate: moment().subtract(1, 'days'),
    //     endDate: moment()
    // }, function (start, end) {
    //     $('#requiredTimeRange').val(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
    // });

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

    $("#partNo").select2({
        ajax : {
            url : rootUrl + "/api/master/parts",
        }
    });
});
