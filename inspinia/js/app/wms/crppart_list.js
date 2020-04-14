$(document).ready(function () {
    //打开界面时，搜索框获得焦点
    $('.search-form').find('input#no').focus();

    var table = $('table#table').DataTable({
        responsive: true,
        ajax: {
            url : baseUrl + '/datatable',
            data : function(d) {
                d.crpId = crpId;
                return d;
            }
        },
//    searchCols: [{
//        search: crpId
//      }],
        order: [
            [1, 'asc']
        ],
        columns: [
            {data: 'crp.id', name : 'crp', defaultContent : '', visible : false},
            {
                data: 'id',
                sortable: false,
                defaultContent: '',
                'class': 'text-center',
                render: function (data, type, row, meta) {
                    return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
                }
            },
            {data: 'linenumber', name: 'linenumber', defaultContent: '', 'class': 'text-center'},
            {data: 'part.no', name: 'partNo', defaultContent: '', 'class': 'text-center'},
            {data: 'part.name', name: 'partNameC', defaultContent: '', 'class': 'text-center'},
            {data: 'suppl.no', name: 'supplNo', defaultContent: '', 'class': 'text-center'},
            {data: 'suppl.name', name: 'supplName', defaultContent: '', 'class': 'text-center'},
            {data: 'pack.no', name: 'packageNo', defaultContent: '', 'class': 'text-center'},
            {data: 'reqQty', name: 'reqQty', defaultContent: '', 'class': 'text-center'},
            {data: 'receiveQty', name: 'receiveQty', defaultContent: '', 'class': 'text-center'},
            {data: 'pQty', name: 'pQty', defaultContent: '', 'class': 'text-center'},
            {data: 'reqBoxnum', name: 'reqBoxnum', defaultContent: '', 'class': 'text-center'},
            {data: 'recBoxnum', name: 'recBoxnum', defaultContent: '', 'class': 'text-center'},
            {
                data: "",
                defaultContent: '',
                sortable: false,
                'class': 'text-center',
                render: function (data, type, row, meta) {
                    var div = "";
                    if(sheetStatus == '1'){
                        div += '<div class="btn-group">' +
                            '<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl + '/edit/' + row.id + '/'+ crpId +'"><i class="fa fa-edit"></i></a> &nbsp;' +
                            '<a class="btn btn-default btn-xs del" title="删除" href="#"><i class="fa fa-trash-o"></i></a>' +
                            '</div>' +
                            '&nbsp;';
                    }
                    div += "<a class='btn btn-default btn-xs detail' title='收货记录' href='"
                        + rootUrl + "/wms/crpsheet/" + crpId + "/" + row.linenumber +
                        "'><i class='fa fa-list'></i></a>";
                    return div;
                }
            }]
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
});
