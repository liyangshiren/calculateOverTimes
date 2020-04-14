$(document).ready(
    function () {

        $("#partNo").inputarea();
        //$("#locNo").inputarea();
        $("#barcodeNo").inputarea();

        var table = $('table#table').DataTable({
            autoWidth: true,
            ajax: {
                url: baseUrl + '/inventoryLocDatatable',
                type: "POST",
                data: function (d) {
                    d.warehouse = $("#warehouse").val();//根据warehouse的id查询
                    d.dloc = $("#dloc").val();//根据dloc的id查询
                    d.loc = $("#loc").val();//loc的id查询
                    d.suppl = $("#suppl").val();//suppl的id查询
                    d.partNo = $("#partNo").val();//需要联合零件表查询
                    d.partName = $("#partName").val();
                    d.isFreeze = $("#isFreeze").val();//根据字段查询
                    d.batch = $("#batch").val();//根据字段查询
                    var times = $("#timeRange").val();
                    d.times = times;
                    d.barcodeNo = $("#barcodeNo").val();//根据字段查询
                    d.isDelete = 0;
                    d.dlocType="3";
                    return d;
                }
            },
            order: [[6, 'asc'], [7, 'asc'], [8, 'asc'], [9, 'asc'], [10, 'asc']],
            columns: [
                {name: "warehouse", data: "warehouse.id", defaultContent: '', visible: false},
                {name: "dloc", data: "dloc.id", defaultContent: '', visible: false},
                {name: "loc", data: "loc.id", defaultContent: '', visible: false},
                {name: "suppl", data: "suppl.id", defaultContent: '', visible: false},
                {name: "part", data: "part.id", defaultContent: '', visible: false},
                {data: "warehouse.no", defaultContent: ''},
                {data: 'dloc.no', defaultContent: ''},
                {data: 'loc.no', defaultContent: ''},
                {name: 'partNo', data: 'part.no', defaultContent: ''},
                {name: 'partName', data: 'part.name', defaultContent: ''},
                {data: 'suppl.no', defaultContent: ''},
                {data: 'barcode'},
                {data: 'batch', name: 'batch'},
                {data: 'pack.no', defaultContent: ''},
                {data: 'inStorageDate'},
                {data: 'quantity'},
                {data: 'lockQty'},
                {data: 'onwayQty'},
                {data: 'isFreeze',name:'isFreeze', render: function (data, type, row, meta) {
                        if (data == '0') {
                            return "未冻结";
                        } else if (data == '1') {
                            return "已冻结";
                        }
                    },
                    defaultContent: ''
                },
                {data: 'freezeReason'},
                // {
                //     data: "",
                //     defaultContent: '',
                //     sortable: false,
                //     'class': 'text-center',
                //     render: function (data, type, row, meta) {
                //         return ('<div class="btn-group">' +
                //             '<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl + '/adjust/' + row.id + '"><i class="fa fa-edit"></i></a>' +
                //             '</div>' +
                //             '&nbsp;&nbsp;');
                //     }
                // }
                {
                    data: "",
                    defaultContent: '',
                    sortable: false,
                    'class': 'text-center',
                    render: function (data, type, row, meta) {
                        var div = '<div class="btn-group">';
                        //alert(row.isRack);
                        if (row.isFreeze == '0') {
                            div += '<a class="btn btn-default btn-xs " title="冻结" href="'+baseUrl+'/adjustFreeze/'+ row.id + '"><i class="fa fa-fire-extinguisher"></i></a>' +
                                '</div>' +
                                '&nbsp;&nbsp;';
                        }
                        if (row.isFreeze == '1') {
                            // '+baseUrl+'/adjustUnFreeze/'+ row.id + '
                            div += '<a class="btn btn-default btn-xs unFreeze" title="解冻" href="'+baseUrl+'/adjustUnFreeze/'+ row.id + '"><i class="fa fa-fire"></i></a>' +
                                '</div>' +
                                '&nbsp;&nbsp;';
                        }
                        div += '</div>&nbsp;&nbsp;';
                        return div;
                    }
                }]
        });

        // table.on('click', '.unFreeze', function () {
        //     var id = table.row($(this).parents('tr')).data().id;
        //     $("#delForm #ids").val(id);
        //     if (id) {
        //         bootbox.confirm("确定要解除冻结吗?", function (result) {
        //             if (result) {
        //                 $("#delForm").submit();
        //             }
        //         });
        //     }
        // });

        $('#timeRange').daterangepicker({
            format: 'YYYY-MM-DD HH:mm:ss',
            showDropdowns: true,
            showWeekNumbers: true,
            timePicker: true,
            timePickerIncrement: 1,
            timePicker24Hour: true,
            opens: 'right',
            drops: 'down',
            locale: {
                applyLabel: '确认',
                cancelLabel: '取消',
                fromLabel: '起始时间',
                toLabel: '结束时间',
                customRangeLabel: '自定义',
                firstDay: 1
            },
            ranges: {
                '今天': [moment(), moment()],
                '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '近7天': [moment().subtract(6, 'days'), moment()],
                '近30天': [moment().subtract(29, 'days'), moment()],
                '当月': [moment().startOf('month'), moment().endOf('month')],
                '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            startDate: moment().subtract(1, 'days'),
            endDate: moment()
        }, function (start, end) {
            $('#timeRange').val(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
        });
        $('#timeRange').val(moment({
            hour: 0,
            minute: 0,
            second: 0
        }).subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment({
            hour: 23,
            minute: 59,
            second: 59
        }).format('YYYY-MM-DD HH:mm:ss'));
        $("#warehouse").select2({
            ajax: {
                url: rootUrl + "/api/master/warehouses"
            }
        });
        $("#suppl").select2({
            ajax: {
                url: rootUrl + "/api/master/suppls"
            }
        });
        $("#dloc").linkSelect2("warehouse", rootUrl + "/api/master/dlocsHold", "warehouse");
        $("#loc").linkSelect2("dloc", rootUrl + "/api/master/locs", "dloc");

        $('.search-form').on("submit", function (e) {
            var wh = $('.search-form').find('select[name="warehouse"]').val();
            var dloc = $('.search-form').find('select[name="dloc"]').val();
            var loc = $('.search-form').find('select[name="loc"]').val();
            var suppl = $('.search-form').find('select[name="suppl"]').val();
            var partNo = $('.search-form').find('input[name="partNo"]').val();
            var partName = $('.search-form').find('input[name="partName"]').val();
            var isFreeze = $('.search-form').find('select[name="isFreeze"]').val();
            var batch = $('.search-form').find('input[name="batch"]').val();
            var barcode = $('.search-form').find('input[name="barcodeNo"]').val();
            var timeRange = $("#timeRange").val();
            if (!wh && !dloc && !loc && !suppl && !partNo
                && !partName && !isFreeze && !batch && !barcode && !timeRange) {
                bootbox.alert("请选择查询条件进行查询");
                return false;
            }

            table.column('warehouse:name').search(wh);
            table.column('dloc:name').search(dloc);
            table.column('loc:name').search(loc);
            table.column('suppl:name').search(suppl);
            //table.column('partNo:name').search(partNo);
            table.column('partName:name').search(partName);
            table.column('isFreeze:name').search(isFreeze);
            table.column('batch:name').search(batch);
            //table.column('barcode:name').search(barcode);
            table.draw();
            // 阻止表单submit
            return false;
        });
    });
