$(document).ready(function () {

// $("#customerOrderNo").inputarea();
	var now = new Date();
	var nowYear = now.getFullYear();
	var nowMounth = now.getMonth() + 1;
	if(nowMounth < 10) {
		nowMounth = "0" + nowMounth;
	}
	var nowDay = now.getDate();
	if(nowDay < 10) {
		nowDay = "0" + nowDay;
	}
	var nowTime = nowYear + '-' + nowMounth + '-' + nowDay;
	var time = new Date().getTime() + 1000*60*60*24*30;
	var timeEndStart = new Date(time).toLocaleDateString().replace(/\//g,'-');
	if(timeEndStart.split('-')[1] < 10) {
		timeEndStart = timeEndStart.split('-')[0] + "-" + "0" + timeEndStart.split('-')[1] + "-" + timeEndStart.split('-')[2];
	}
	if(timeEndStart.split('-')[2] < 10) {
		timeEndStart = timeEndStart.split('-')[0] + "-" + timeEndStart.split('-')[1] + "-" + "0" + timeEndStart.split('-')[2];
	}
	var timeNormal = nowTime + " - " + timeEndStart;
	$('#planPackageDate').val(timeNormal) // 给搜索时间赋值
  var table = $('table#table').DataTable({
	  scrollX : true,
	  autoWidth : true,
    ajax : {
		url : baseUrl + '/datatable',
// type : "POST",
		data : function(d) {
			//传给后端
			var planPackageDate = $("#planPackageDate").val();
    		d.planPackageDate = planPackageDate;
    		d.leveloneBarcode = $("#leveloneBarcode").val();
    		d.customerOrderNo = $("#customerOrderNo").val();
    		d.customerCode = $("#customerCode").val();
    		d.status = $("#status").val();
    		return d;
		}
	},
    order: [
      [2, 'asc'],[3, 'asc']
    ],
    columns: [{
      data: 'id',
      sortable: false,
      defaultContent: '',
      'class': 'text-center',
      render: function (data, type, row, meta) {
        return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
      }
    }, 
    {data: 'leveloneBarcode',name:'leveloneBarcode','class': 'text-center',defaultContent: ''}, 
    {
        data: 'status',
        render: function (data, type, row, meta) {
          return VALUES_MAP_DICT_STATUS && VALUES_MAP_DICT_STATUS[data] ? VALUES_MAP_DICT_STATUS[data].text : '';
        }
    },
    {data: 'packageBatch.customerCountry',name:'packageBatch.customerCountry','class': 'text-center',defaultContent: ''}, 
    {data: 'packageBatch.customerOrderNo',name:'packageBatch.customerOrderNo','class': 'text-center',defaultContent: ''}, 
    {data: 'packageBatch.customerCode',name:'packageBatch.customerCode','class': 'text-center',defaultContent: ''}, 
    {data: 'partNo',name:'partNo','class': 'text-center',defaultContent: ''}, 
    {data: 'partName',name:'partName','class': 'text-center',defaultContent: ''}, 
    {data: 'supplier.no',name:'supplier.no','class': 'text-center',defaultContent: ''}, 
    {data: 'requiredQty',name:'requiredQty', 'class': 'text-center',defaultContent: ''},
    {data: 'packageQty',name:'packageQty', 'class': 'text-center',defaultContent: ''},
    {data: 'gross',name:'gross', 'class': 'text-center',defaultContent: ''},
    {data: 'weight',name:'weight', 'class': 'text-center',defaultContent: ''},
    //{data: 'packageBatch.planPackageDate',name:'packageBatch.planPackageDate', 'class': 'text-center',defaultContent: ''},
    {
      data: "",
      defaultContent: '',
      sortable: false,
      'class': 'text-center',
      render: function (data, type, row, meta) {
    	  var div = "";
    	  if (row.status == '0' || row.status == '1' ) {
        	  div = '<div class="btn-group">' +
      		'<a class="btn btn-default btn-xs" id="change" title="修改" href="' + baseUrl + '/edit/' + row.id + '">修改</a>' +
    		'</div>' +'&nbsp;&nbsp;'+
        '<a class="btn btn-danger " title="打印一级标签" href="' + baseUrl + '/print/'
        + row.id + '">打印一级标签</a>' +
        '&nbsp;&nbsp;';
          }else{
        	  div = '<div class="btn-group">' +
        	  '<a disabled class="btn btn-default btn-xs" id="change" title="修改" href="#">修改</a>' +
        	  '</div>' +'&nbsp;&nbsp;'+
        		  '<a class="btn btn-danger " title="打印一级标签" href="' + baseUrl + '/print/' + row.id + '">打印一级标签</a>' +
        	  '&nbsp;&nbsp;';
          }
          return div;
//        return (
//        		'<div class="btn-group">' +
//        		'<a disabled class="btn btn-default btn-xs" id="change" title="修改" href="' + baseUrl + '/edit/' + row.id + '">修改</a>' +
//        		'</div>' +'&nbsp;&nbsp;'+
//            '<a class="btn btn-danger " title="打印一级标签" href="' + baseUrl + '/print/'
//            + row.id + '">打印一级标签</a>' +
//            '&nbsp;&nbsp;');
      }
    }]
  });
  
   
  
  $('#search').on("click", function (e) {
	  var searchTime = $('#planPackageDate').val(); // 判断时间间隔
	  	if(searchTime) {
	  		console.log(searchTime)
	  		var searchStart = searchTime.split(' - ')[0];
		  	var searchEnd = searchTime.split(' - ')[1];
		  	var searchTimeCha = (new Date(searchEnd).getTime() - new Date(searchStart).getTime())/1000/60/60/24;
		  	console.log(searchTimeCha)
		  	if(searchTimeCha > 60) {
		  		bootbox.alert('一级箱包装计划变更单次查询日期范围最大值为60天！')
		  		return false;
		  	}
	  	}
	  	//input值 在这边set了 上面的ajax data 就不用传给后端了，注意find('【input】（这个地方copy时容易疏忽，有的是【select】）#pickBatchCode')
	  	var packageBatchCode = $.trim($('.search-form').find('input#packageBatchCode').val());
	    var customerOrderNo = $('.search-form').find('input#customerOrderNo').val();
	    var status = $('.search-form').find('select[name="status"]').val();
	    var locNo = $('.search-form').find('select[name="locNo"]').val();
	    var customerCode = $('.search-form').find('select[name="customerCode"]').val();
	    table.column('packageBatchCode:name').search(packageBatchCode);
	    table.column('customerOrderNo:name').search(customerOrderNo);
	    table.column('status:name').search(status);
	    table.column('locNo:name').search(locNo);
	    table.column('customerCode:name').search(customerCode);
	    table.draw();
	    // 阻止表单submit
	    return false;
	  });
  
  $('#clear').on("click", function (e) {
    table.columns().search('').draw();
  });
  
  // 客户下拉搜索
  $("#customer").select2({
    ajax: {
      url: rootUrl + "/api/master/customers",
    }
  });
  
  //包装库位下拉搜索
  $("#locId").select2({
    ajax: {
      url: rootUrl + "/api/master/locs",
    }
  });
  
  $('#planPackageDate').daterangepicker({
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
	        fromLabel : '起始时间',
	        toLabel : '结束时间',
	        customRangeLabel : '自定义',
	        firstDay : 1
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
	    $('#planPackageDate').val(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
	  });
  
});
