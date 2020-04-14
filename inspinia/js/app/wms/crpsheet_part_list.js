$(document).ready(function () {
    if(datas){
    	for(var i=0;i< datas.length; i++) {
    		var data = datas[i];
    		var html = "<tr role='row' class='odd'>" +
    		"<td class='text-center'>"+ data.linenumber +"</td>" +
    		"<td class='text-center'>"+ data.partNo +"</td>" +
    		"<td class='text-center'>"+ data.partName +"</td>" +
    		"<td class='text-center'>"+ data.requiredQty +"</td>" +
    		"<td class='text-center'>"+ data.receiveQty + "</td>" +
    		"<td class='text-center'>"+ data.packageNo + "-" + data.packageName +"</td>" +
    		"<td class='text-center'>"+ data.pQty  +"</td>" +
    		"<td class='text-center'>"+ data.reqBoxNum +"</td>" +
    		"<td class='text-center'>"+ data.recBoxNum + "</td>" +
    		"<td class='text-center'><a class='btn btn-default btn-xs del' title='收货记录' href='"
    			+ baseUrl + "/" + data.crpId + "/" + data.linenumber +
    		"'><i class='fa fa-list'></i></a></td>" +
    		"</tr>";
    		$('#details').append(html);
    	}
    }else{
		alert('没有明细数据');
	}
});
