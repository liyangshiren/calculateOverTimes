$(document).ready(function () {
  $("#plant").select2({
    ajax: {
      url: rootUrl + "/api/master/plants"
    }
  });
  // link select controls
  // 道口联动于工厂
  $("#dock").linkSelect2("plant", rootUrl + "/api/master/docks","plant");
  // 供应商联动于工厂
  $("#suppl").linkSelect2("plant", rootUrl + "/api/master/suppls","plant");
	
  // form validation
  $("#receiveForm").validate({
    rules: {
      sdsNo: {
        remote: baseUrl + "/check/sdsNo?oldSdsNo=" + oldNo
      }
    },
    messages: {
      sdsNo: {
        remote: "该收货单据号已被使用!"
      }
    }
  });
  
  $('.form_datetime').datetimepicker({
	  format: 'yyyy-mm-dd hh:ii:ss',
      todayBtn: "linked",
      calendarWeeks: true,
      autoclose: true,
      pickerPosition: "bottom-left"
  });
  if($("#billType").val() == "90"){
	  $("#dsp").hide();
	  $("#dsw").hide();
  } else {
	  $("#dsp").show();
	  $("#dsw").show();
  }
  
  $('#billType').on('change',function(){
	//判断是否选取prompt属性，无返回值；
	  if($(this).val() == "90"){
		  $("#dsp").hide();
		  $("#dsw").hide();
	  } else {
		  $("#dsp").show();
		  $("#dsw").show();
	  }
});

});
