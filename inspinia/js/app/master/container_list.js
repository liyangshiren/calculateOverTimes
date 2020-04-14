$(document).ready(function () {
    $("#barcode").inputarea();

    var now = new Date();
    var nowYear = now.getFullYear();
    var nowMounth = now.getMonth() + 1;
    if (nowMounth < 10) {
        nowMounth = "0" + nowMounth;
    }
    var nowDay = now.getDate();
    if (nowDay < 10) {
        nowDay = "0" + nowDay;
    }
    var nowTime = nowYear + '-' + nowMounth + '-' + nowDay;
    var time = new Date().getTime() - 1000 * 60 * 60 * 24 * 30;
    var timeEndStart = new Date(time).toLocaleDateString().replace(/\//g, '-');
    if (timeEndStart.split('-')[1] < 10) {
        timeEndStart = timeEndStart.split('-')[0] + "-" + "0" + timeEndStart.split('-')[1] + "-" + timeEndStart.split('-')[2];
    }
    if (timeEndStart.split('-')[2] < 10) {
        timeEndStart = timeEndStart.split('-')[0] + "-" + timeEndStart.split('-')[1] + "-" + "0" + timeEndStart.split('-')[2];
    }
    var timeNormal = timeEndStart + " - " + nowTime;
    $('#createdDate').val(timeNormal) // 给搜索时间赋值
    var table = $('table#table').DataTable({
        scrollX: true,
        autoWidth: true,
        ajax: {
            url: baseUrl + '/datatable',
            data: function (d) {
                var createdDate = $("#createdDate").val();
                d.createdDate = createdDate;
                d.status = $('.search-form').find('select[name="status"]').val();
                d.plant = $("#plant").val();
                d.barcode = $("#barcode").val();
                d.ladBillNo = $("#ladBillNo").val();
                d.customer = $("#customer").val();
                return d;
            }
        },
        order: [
            [2, 'asc']
        ],
        columns: [{
            data: 'id',
            sortable: false,
            defaultContent: '',
            'class': 'text-center checkBoxIput',
            render: function (data, type, row, meta) {
//    	  console.log(row)
                return '<div class="checkbox"><input type="checkbox" data-barcode="' + row.barcode + '" name="ids" value="' + data + '"/><label for="ids"/></div>'
            }
        },
            {
                data: 'id', sortable: false, 'class': 'text-center',
                render: function (data, type, row, meta) {

                    var div = "";
                    if (row.status == '0' || row.status == '1') {
                        div = '<div class="btn-group">' +
                            '<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl + '/edit/' + row.id + '"><i class="fa fa-edit"></i></a>' +
                            '</div>' + '&nbsp;&nbsp;' + '<a class="btn  btn-danger print" title="打印交接单" href="#">打印交接单  </a>' + '</div>' + '&nbsp;&nbsp;';
                        /*		            '<a class="btn btn-danger " title="发运" href="' + baseUrl + '/shipment/' + row.id + '">发运</a>'  +'&nbsp;&nbsp;' ;
                        */		           /* '<a disabled class="btn btn-danger " title="实发填报" href="#' + baseUrl + '/customerNo/' + row.id + '">实发填报</a>' +'</div>&nbsp;&nbsp;';*/

                    }

                    if (row.status == '2') {
                        div = '<div class="btn-group">' +
                            /*'<a disabled class="btn btn-default btn-xs" id="change" title="修改" href="#">修改</a>' +*/
                            '</div>' + '&nbsp;&nbsp;' + '<a class="btn  btn-danger print" title="打印交接单" href="#">打印交接单  </a>' + '</div>' + '&nbsp;&nbsp;' +
                            '<a class="btn btn-danger " title="发运" href="' + baseUrl + '/shipment/' + row.id + '">发运</a>' + '&nbsp;&nbsp;';
                        /*  '<a disabled class="btn btn-danger " title="实发填报" href="' + baseUrl + '/customerNo/' + row.id + '">实发填报</a>' +'</div>&nbsp;&nbsp;';*/

                    }

                    if (row.status == '3') {
                        div = '<div class="btn-group">' +
                            /* '<a disabled class="btn btn-default btn-xs" id="change" title="修改" href="#">修改</a>' +'</div>' +'&nbsp;&nbsp;' +*/
                            '<a class="btn  btn-danger print" title="打印交接单" href="#">打印交接单  </a>' + '</div>' + '&nbsp;&nbsp;' +
                            /* '<a class="btn btn-danger " title="发运" href="' + baseUrl + '/shipment/' + row.id + '">发运</a>'  +'&nbsp;&nbsp;' +*/
                            '<a class="btn btn-danger " title="实发填报" href="' + baseUrl + '/customerNo/' + row.id + '">实发填报</a>' + '</div>&nbsp;&nbsp;';
                    }
                    return div;
                }
            },
            {
                name: 'plant',
                data: 'plant.no'
            }, {
                name: 'barcode',
                data: 'barcode',
                'class': 'barcode',
            }, {
                name: 'customerCode',
                data: 'customerCode',
            }, {
                name: 'ladBillNo',
                data: 'ladBillNo'
            }, {
                name: 'sealNo',
                data: 'sealNo'
            }, {
                data: 'status',
                render: function (data, type, row, meta) {
                    return VALUES_MAP_DICT_STATUS && VALUES_MAP_DICT_STATUS[data] ? VALUES_MAP_DICT_STATUS[data].text : '';
                }
            }, {
                name: 'driver',
                data: 'driver'
            }, {
                name: 'vehicleNumber',
                data: 'vehicleNumber'
            }, {
                name: 'contact',
                data: 'contact'
            }, {
                name: 'sealer',
                data: 'sealer'
            }, {
                data: 'sealDate',
                'class': 'text-center',
                defaultContent: ''
            }, {
                name: 'shipper',
                data: 'shipper'
            }, {
                data: 'shipmentDate',
                'class': 'text-center',
                defaultContent: ''
            }, {
                name: 'invoiceNo',
                data: 'invoiceNo'
            }, {
                name: 'customsdeclNumber',
                data: 'customsdeclNumber'
            }, {
                name: 'etdDate',
                data: 'etdDate'
            }, {
                name: 'etaDate',
                data: 'etaDate'
            }, {
                data: 'lastModifiedBy',
                'class': 'text-center',
                defaultContent: ''
            }, {
                data: 'lastModifiedDate',
                'class': 'text-center',
                defaultContent: ''
            }, {
                data: 'createdDate',
                'class': 'text-center',
                defaultContent: ''
            }
        ]
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
    table.on('click', '.print', function () {
        var barcode = table.row($(this).parents('tr')).data().barcode;
        var ladBillNo = table.row($(this).parents('tr')).data().ladBillNo;
        var sealNo = table.row($(this).parents('tr')).data().sealNo;
        var vehicleNumber = table.row($(this).parents('tr')).data().vehicleNumber;
        var id = table.row($(this).parents('tr')).data().id;

        $("#printForm .param").remove();
        var $frm = $("#printForm");
        $frm.append($('<input class="param" type="hidden" name="id" id="barcode" value = \'' + id + '\' />'));
        $frm.append($('<input class="param" type="hidden" name="barcode" id="barcode" value = \'' + barcode + '\' />'));
        $frm.append($('<input class="param" type="hidden" name="ladBillNo" id="ladBillNo" value = \'' + ladBillNo + '\' />'));
        $frm.append($('<input class="param" type="hidden" name="sealNo" id="sealNo" value = \'' + sealNo + '\' />'));
        $frm.append($('<input class="param" type="hidden" name="vehicleNumber" id="vehicleNumber" value = \'' + vehicleNumber + '\' />'));
        $frm.submit();
        // 阻止默认行为
        e.preventDefault();
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

    $('.search-form').on("submit", function (e) {
        var searchTime = $('#createdDate').val(); // 判断时间间隔
        if (searchTime) {
            console.log(searchTime)
            var searchStart = searchTime.split(' - ')[0];
            var searchEnd = searchTime.split(' - ')[1];
            var searchTimeCha = (new Date(searchEnd).getTime() - new Date(searchStart).getTime()) / 1000 / 60 / 60 / 24;
            console.log(searchTimeCha)
            if (searchTimeCha > 60) {
                bootbox.alert('集装箱单次查询日期范围最大值为60天！')
                return false;
            }
        }
        var barcode = $('.search-form').find('input[name="barcode"]').val();
//    table.column('barcode:name').search(barcode);
        table.draw();
        //阻止表单submit
        return false;
    });

    //工厂下拉搜索
    $("#plant").select2({
        ajax: {
            url: rootUrl + "/api/master/plants",
        }
    });
    //客户下拉搜索
    $("#customer").select2({
        ajax: {
            url: rootUrl + "/api/master/customers",
        }
    });

    $('#createdDate').daterangepicker({
        format: 'YYYY-MM-DD',
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
//	    $('#createdDate').val(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
        $('#createdDate').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
    });


    var barcodes = [];
    var ids = [];
    $('#table tbody').on('click', 'input', function (e) {
        barcodes = [];
        ids = [];
        $('input:checked').each(function () {
            barcodes.push($(this).attr('data-barcode'));
            ids.push($(this).val());
        })
        console.log(barcodes);
        console.log(ids);
    })


    $('.selectAll').bind('click', function (e) {
//		console.log(e.target.title)
        barcodes = [];
        ids = [];
        if (e.target.title == '全选') {
            $('.checkBoxIput input').each(function () {
                barcodes.push($(this).attr('data-barcode'));
                ids.push($(this).val());
            })
        }
        console.log(barcodes);
        console.log(ids);
    })


    //导出 动态组织form提交
    $(".btn.export").on("click", function (e) {
        if (ids.length == 0) {
            alert('请勾选数据');
            return
        }
        $.get(baseUrl + '/export/check/' + ids.join(','), {}, function (res) {
            if (res) {
                alert('请选择相同客户下的集装箱');
                return
            } else {
                $("#exportForm .param").remove();
                var $frm = $("#exportForm");

                $frm.append($('<input class="param" type="hidden" name="ids" id="ids" value = \'' + ids.join(',') + '\' />'));
                $frm.submit();
                // 阻止默认行为
                e.preventDefault();
                return false;
            }
        })
    });

});




