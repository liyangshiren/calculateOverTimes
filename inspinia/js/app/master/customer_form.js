$(document).ready(function () {
  /* form init validation */
  var form = $("#customerForm");

  // JQuery validate 插件看文档
  // form validation
  form.validate({
    rules: {
      code: {
        remote: baseUrl + "/check/code?oldCode=" + oldCode,
        alnum : true,
		maxlength: 50
      },
      name: {
        remote: baseUrl + "/check/name?oldName=" + oldName,
		maxlength: 50
      },
      comp: {
        maxlength: 50
      },
      addr: {
        maxlength: 200
      },
      countryNo: {
          maxlength: 50
      }
    },
    messages: {
      code: {
        remote: "该客户编号已被使用!"
      },
      name: {
        remote: "该客户名称已经被使用!"
      }
    }
  });
});
