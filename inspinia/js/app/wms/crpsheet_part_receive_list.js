$(document).ready(function () {
    if(datas){
    	for(var i=0;i< datas.length; i++) {
    		var data = datas[i];
    		var html = "<tr role='row' class='odd'>" +
    		"<td class='text-center'>"+ data.partNo +"</td>" +
    		"<td class='text-center'>"+ data.partName +"</td>" +
    		"<td class='text-center'>"+ data.requiredQty +"</td>" +
    		"<td class='text-center'>"+ data.receiveQty + "</td>" +
    		"<td class='text-center'>"+ data.packageNo + "-" + data.packageName +"</td>" +
    		"<td class='text-center'>"+ data.pQty  +"</td>" +
    		"<td class='text-center'>"+ data.reqBoxNum +"</td>" +
    		"<td class='text-center'>"+ data.recBoxNum + "</td>" +
    		"<td class='text-center'>"+ data.barcode + "</td>" +
    		"<td class='text-center'>"+ data.batch + "</td>" +
    		"</tr>";
    		$('#details').append(html);
    	}
    }else{
		alert('没有明细数据');
	}
});
