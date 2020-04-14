$(document).ready(function () {
    var sdsNo = $("#sdsNo").html();
    resetInputNo();
    /**
     * 扫描收货
     */
    $('.search-form').on("submit", function (e) {
        var label = $('.search-form').find('input#barcode').val();
        if(!label){
            alert('零件标签无法识别');
            resetInputNo();
            return false;
        }
        if(label.search("|") == -1 || label.split('|').length != 9){
            alert('标签格式不正确');
            resetInputNo();
            return false;
        }
        var barcodeStr = label.split('|');
        var partNo = barcodeStr[0];//零件号
        var receiveQty = barcodeStr[1];//包装数量
        var supplNo = barcodeStr[2];//供应商
        var barcode = barcodeStr[3];//零件标签
        var packNo = barcodeStr[4];//包装编号
        var productDate = barcodeStr[6];//生产日期
        var repackFlag = barcodeStr[7];//翻包标识
        var plantNo = barcodeStr[8];//工厂
        if(isEmpty(partNo)
            || isEmpty(receiveQty)
            || isEmpty(supplNo)
            || isEmpty(barcode)
            || isEmpty(packNo)
            || isEmpty(productDate)
            || isEmpty(repackFlag)
            || isEmpty(plantNo)){
            alert('标签数据不正确');
            resetInputNo();
            return false;
        }
        if(isNaN(receiveQty) || receiveQty <= 0){
            alert('标签零件数量有误');
            resetInputNo();
            return false;
        }
        var m = new Date(productDate);
        if(productDate.split("-").length != 3 || m == 'Invalid Date'){
            alert('生产日期格式错误');
            resetInputNo();
            return false;
        }
        if(!isEmpty(barcodeStr[5])){
            if(new Date(barcodeStr[5]) == 'Invalid Date'){
                alert('打印日期格式错误');
                resetInputNo();
                return false;
            }
        }
        var row = {};
        // 零件
        row.partNo = partNo;
        row.receiveQty = receiveQty;
        row.supplNo = supplNo;
        row.barcode = barcode;
        row.packNo = packNo;
        row.productDate = productDate;
        row.repackFlag = repackFlag;
        row.plantNo = plantNo;
        row.sdsNo = sdsNo;
        console.log(JSON.stringify(row));
        doReceiving(row);
        resetInputNo();
        return false;
    });

    // 收货
    function doReceiving(row){
        $.ajax({
            url : baseUrl + "/doReceiving",
            type : "POST",
            dataType: "json",
            data : {
                item : JSON.stringify(row)
            },
            success : function(data){
                if(data){
                    if(data.hasError){
                        alert(data.hasError);
                    }
                    if(data.isError){
                        if(confirm(data.isError)){
                            row.checkPackFlag = "1";
                            doReceiving(row);
                        }
                    }
                    if(data.success){
                        toastr.info(data.success);
                    }
                }
            },
            error : function(msg){
                console.log(JSON.stringify(msg));
                alert("操作失败");
            }
        })
    }


    function resetInputNo(){
        $('.search-form').find('input#barcode').val('');
        $('.search-form').find('input#barcode').focus();
    }

    //判断字符是否为空的方法
    function isEmpty(obj){
        if(typeof obj == "undefined" || obj == null || obj == ""){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 取消，返回上一页
     */
    $('#cancel').on("click", function (e) {
        window.location.href = baseUrl;
    });

});

