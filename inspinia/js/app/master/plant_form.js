$(document).ready(function () {
  /* form init validation */
  var form = $("#plantForm");

  // JQuery validate 插件看文档
  // form validation
  form.validate({
    rules: {
      no: {
        remote: baseUrl + "/check/no?oldNo=" + oldNo,
        alnum : true,
		maxlength: 4
      },
      /**sapPlantNo: {
        remote: baseUrl + "/check/sapPlantNo?oldSapPlantNo=" + oldSapPlantNo,
        alnum : true,
  		maxlength: 4
      },**/
      name: {
        remote: baseUrl + "/check/name?oldName=" + oldName,
		maxlength: 128
      },
      nameCS: {
        maxlength: 128
      },
      addr: {
        maxlength: 128
      }
    },
    messages: {
      no: {
        remote: "该工厂编号已被使用!"
      },
      /**sapPlantNo: {
    	remote: "该SAP工厂编号已被使用!"
      },**/
      name: {
        remote: "该工厂中文名称已经被使用!"
      }
    }
  });
});
