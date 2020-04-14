$(document).ready(function () {
    if(datas){
        for(var i=0;i< datas.length; i++) {
            var data = datas[i];
            var html = "<tr role='row' class='odd'>" +
                "<td class='text-center'>"+ data.linenumber +"</td>" +
                "<td class='text-center'>"+ data.partNo +"</td>" +
                "<td class='text-center'>"+ data.partName +"</td>" +
                "<td class='text-center'>"+ data.reqQty +"</td>" +
                "<td class='text-center'>"+ data.shipQty + "</td>" +
                "<td class='text-center'>"+ data.unit +"</td>" +
                "<td class='text-center'>"+ data.barcode  +"</td>" +
                "<td class='text-center'>"+ data.dockRecFlage +"</td>" +
                "</tr>";
            $('#details').append(html);
        }
    }else{
        alert('没有明细数据');
    }
});