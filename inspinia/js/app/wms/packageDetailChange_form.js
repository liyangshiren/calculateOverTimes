$(document).ready(function() {
	
	
	
	var form = $("#packageDetailChangeForm");
	
	
	form.validate({
		rules : {
			requiredQty : {
				required: true,    //要求输入不能为空
                number: true,     //输入必须是数字
                min: 0         //输入的数字不能为0或者负数
			}
		},
		messages : {
			requiredQty: {
                required: "请输入数量",
                number: "请正确输入数字",
                min: "不能小于0"
            }
		}
	});
	
	console.log(form)
	$(".baocunBtn2").hide();
	
	var status = $("#status")[0].value
//	$(".status")[0].value = "2";
	console.log(status);
	
	if(status!=0 && status!=1){
		alert('状态非新建跟未封箱,禁止修改!')
		$(".baocunBtn1").hide();
		$(".baocunBtn2").show();
	}
});
$(".requiredQty").bind("change",function(){
	console.log('xiugaile');
	var packageQty = $(".packageQty")[0].value
	console.log(packageQty)
	var requiredQty = $(".requiredQty")[0].value
	console.log(packageQty);
	if(Number(requiredQty)<Number(packageQty)){
		alert('修改的计划装箱量需大于等于已装箱量')
		$(".baocunBtn1").hide();
		$(".baocunBtn2").show();
	}else{
		if($("#status")[0].value != 0 && $("#status")[0].value != 1){
			$(".baocunBtn1").hide();
			$(".baocunBtn2").show();
		}else{
//			if(Number(requiredQty)==Number(packageQty)){
//				$("#status")[0].value = 2
//			}
//			console.log($("#status")[0].value);
			$(".baocunBtn2").hide();
			$(".baocunBtn1").show();
		}
	}
})

