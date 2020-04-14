$(document).ready(function () {
	/**
	 * 完成
	 */
  $('.search-form').on("submit", function (e) {
	//扫描零件标签(C00050412|10|P03090|P1711076013095|D||)
    var barcodeStr = $('.search-form').find('input#no').val();
    if(!barcodeStr){
    	toastr.warning('零件标签无法识别', '提示信息!');
    	resetInputNo();
    	return false;
    }
    barcodeStr = barcodeStr.split('|');
    var partNo = barcodeStr[0];//零件号
    var pQty = barcodeStr[1];//包装数量
    var supplNo = barcodeStr[2];//供应商
    var barcode = barcodeStr[3];//零件标签
    var packageNo = barcodeStr[4];//包装编号
    var mDate = barcodeStr[5];//制造日期
    var pDate = barcodeStr[6];//打印日期
    if(mDate){
    	var m = new Date(mDate);
    	if(m == 'Invalid Date'){
    		alert('制造日期格式错误');
    		resetInputNo();
    		return false;
    	}
    }
    if(!pDate){
    	var m = new Date(pDate);
    	if(m == 'Invalid Date'){
    		alert('打印日期格式错误');
    		resetInputNo();
    		return false;
    	}
    }
    if(barcodes.indexOf(barcode) > -1){
    	toastr.warning('此箱零件已收货', '提示信息!');
    	resetInputNo();
    	return false;
    }
    
    if(datas){
    	var bl = false;//数据是否异常
    	var partFlag = false;
    	var data;
    	var errMsg = '';
    	//检查零件是否存在
    	datas.forEach(function(d){
    		if(barcode == d.barcode){
    			partFlag = true;
    			return;
    		}
    	});
    	//零件存在的基础上检查其他
    	if(partFlag){
    		datas.forEach(function(d){
				if(barcode == d.barcode){
					if(partNo != d.partNo){
    					errMsg = '标签的零件号与单据中不一致，请确认';
    					return;
    				}
    				if(packageNo != d.packNo){
    					errMsg = '零件标签的包装编号与单号中的包装编号不一致，请确认';
    					return;
    				}
    				if('1' == d.dockRecFlag){
    					errMsg = '零件已收货';
    					return;
    				}
    				if((pQty - 0) > d.reqQty){
    					errMsg = '收货数量>要货数量，不能收货';
    					return;
    				}
    				if(!checkPartSuppl(partNo, supplNo)){
    					errMsg = '零件:'+ partNo +',供应商:'+ supplNo +',缺少零件供应商关系';
    					return;
    				}
    				//已收货数量增加
    				d.recQty = (d.recQty - 0) + (pQty - 0);
    				barcodes = barcodes + ","+ barcode;//记录已收货的零件标签
    				bl = true;
    				data = d;
    				return;
    			}
    		});
    	} else {
    		errMsg = '标签不在发运清单中，请确认';
    	}
    	
    	if(bl){
    		var html = "<tr role='row' class='odd'>" +
    		"<td class='text-center'>"+ data.sheetNo +"</td>" +
    		"<td class='text-center'>"+ data.linenumber +"</td>" +
    		"<td class='text-center'>"+ data.partNo +"</td>" +
    		"<td class='text-center'>"+ supplNo +"</td>" +
    		"<td class='text-center'>"+ data.packNo + "</td>" +
    		"<td class='text-center'>"+ pQty +"</td>" +
    		"<td class='text-center'>"+ 1 +"</td>" +
    		"<td class='text-center'>"+ batchNum + "</td>" +
    		"<td class='text-center'>"+ barcode  +"</td>" +
    		"<td class='text-center'>"+ mDate  +"</td>" +
    		"<td class='text-center'>"+ pDate  +"</td>" +
    		"<td class='text-center'><a class='btn btn-default btn-xs del' title='删除' href='#'><i class='fa fa-trash-o'></i></a></td>" +
    		"</tr>";
    		$('#details').append(html);
    		i++;
    	}else{
    		toastr.warning(errMsg, '提示信息!');
    	}
    }
    resetInputNo();
    return false;
  });
  
  function resetInputNo(){
	  $('.search-form').find('input#no').val('');
      $('.search-form').find('input#no').focus();
  }
  
  function craeteHidden(name, val, i){
	  return "<input type='hidden' name='items["+ i +"]."+ name +"' value='"+ val +"' />";
  }
  
  /**
   * 验证零件和供应商关系是否存在
   */
  function checkPartSuppl(partNo, supplNo){
	  if(!partSuppls){
		  return false;
	  }
	  var flag = false;
	  partSuppls.forEach(function(d){
		  if(d && d.partNo == partNo && d.supplNo == supplNo){
			  flag = true;
		  }
	  });
	  return flag;
  }
  
  /**
   * 完成，提交扫描的数据
   */
  function submitScan(rows, canFullReceive) {
	  var mainId = $("#mainId").val();
	  $.ajax({
		  type:'POST',
		  url : baseUrl + '/receive/save/' + mainId,
//		  contentType: "application/json",
		  data:{ 
			  vehicleNo: $("#vehicleNo").val(),
			  items: JSON.stringify(rows),
			  canFullReceive : canFullReceive
		  },
		  success:function(data){
			  console.log(data);
			  if (data) {
				  if (data.success) {
					  bootbox.alert({  
			            message: data.message,  
			            callback: function() {  
			            	$('#cancel').click();
			            },  
			            title: '提示信息',  
			        });
				  } else {
					  toastr.error(data.message, '错误信息!', { timeOut: 0 });
				  }
			  }
	　　　　 },
	      error: function (XMLHttpRequest, textStatus, errorThrown){  
			toastr.error("异常：" + errorThrown, '错误信息!', { timeOut: 0 });
	　　　　 }
	　　});
  }
  
  /**
   * 完成，提交数据
   */
  $('#end').on("click", function (e) {
	  var rows = [];
	  $('#details').find("tr").each(function(i, tr){
		  var row = {};
		  $(tr).find("td").each(function(j, td){
			  var val = $(td).text();
			  //单号
			  if(j == 0) row.sheetNo = val;
			  // 行号
			  else if(j == 1) row.linenumber = val;
			  //零件
			  else if(j == 2) row.partNo = val;
			  //供应商
			  else if(j == 3) row.supplNo = val;  
			  //包装
			  else if(j == 4) row.packNo = val;  
			  //包装数量
			  else if(j == 5) row.pQty = val;
			  //批次
			  else if(j == 7) row.batchNum = val;
			  //零件标签
			  else if(j == 8) row.barcode = val;
			  //制造日期
			  else if(j == 9) row.mDate = val;
			  //打印日期
			  else if(j == 10) row.pDate = val;
		  });
		  rows.push(row);
	  })
	  var canFullReceive = $("#canFullReceive").val();
	  if(rows.length == 0){
		  if (canFullReceive == 'true') {
			  bootbox.confirm("单据可以整单收货，是否继续?", function (result) {
		        if (result) {
		        	submitScan(rows, canFullReceive);
		        }
		      });
		  } else {
			  toastr.warning('请扫描零件标签', '提示信息!');
			  return false;
		  }
	  } else {
		  submitScan(rows, canFullReceive);
	  }
	  
  });
  
  /**
   * 取消，返回上一页
   */
  $('#cancel').on("click", function (e) {
	  window.location.href = baseUrl + "/" + $("#sheetNo").val();
  });
  
  /**
   * 删除此行数据
   */
  $('body').on('click','.del', function(e){
	 $(this).closest("tr").remove();
	 
	 var linenumber = 0;//行号
	 var partNo = '';//零件号
	 var pQty = 0; //包装数量
	 $(this).closest("tr").find("td").each(function(j ,td){
		 if(j == 1){
			 linenumber =  $(td).text();
		 }
		 if(j == 2){
			 partNo =  $(td).text();
		 }
		 if(j == 5){
			 pQty =  $(td).text() - 0;
		 } 
		 if(j == 8){
			//删除 barcodes 存储的已扫描的零件标签
			 barcodes = barcodes.replace($(td).text(), '');
		 }
	 });
	 //根据零件+行号，恢复这行已扣除的可收数量消耗
	 datas.forEach(function(d){
		if(d && d.partNo == partNo && d.linenumber == linenumber){
			d.receiveQty = d.receiveQty - pQty;
		}
	 });
  });
});

