$(document).ready(function () {
  /* form init validation */
  var form = $("#productionPlanForm");

  // JQuery validate 插件看文档
  // form validation
/*  form.validate({
    rules: {
      sailingNo: {
          maxlength: 50
      }
    }
  });*/
  var newDate = new Date();
  var t = newDate.toJSON(); 
  $('.form_datetime').datetimepicker({
	  format: 'yyyy-mm-dd',
      todayBtn: "linked",
      calendarWeeks: true,
      autoclose: true,
      pickerPosition: "bottom-left",
      weekStart: 1, 
      startDate:new Date(t)
  });
});
