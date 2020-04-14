// datatables default options
var defaultDom = "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>";
$.extend($.fn.dataTable.defaults, {
	"language" : {
		"url" : theme + '/plugins/datatables/Chinese.json'
	},
	dom : "<'row'<'col-sm-12'tr>><'row m-t-xs'<'col-sm-4'i><'col-sm-3'l><'col-sm-5'p>>",
	//	buttons : {
	//		buttons : [ 'copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5' ]
	//	},
	lengthMenu: [ 10, 50, 100, 200, 500 ],
	autoWidth : false,
	processing : false,
	lengthChange : true,
	searching : true,
	serverSide : true,
	stateSave: true
});

// select2 default options
$.fn.select2.defaults.set("theme", "bootstrap");
$.fn.select2.defaults.set("width", "resolve");
$.fn.select2.defaults.set("placeholder", "请选择");
$.fn.select2.defaults.set("language", "zh-CN");
$.fn.select2.defaults.set("allowClear", "true");
$.fn.select2.defaults.set("ajax--delay", 1000);
$.fn.select2.defaults.set("ajax--data", function(params) {
	params.q = params.term;
	return params;
});
$.fn.select2.defaults.set("ajax--processResults", function(data, q, page) {
	var more = false;
	if (data.totalPages > 1) {
		more = page < data.totalPages;
	}
	return {
		results : data.content,
		pagination : {
			more : more
		}
	};
});

// page default actions
$(document).ready(function() {
//	$('.form-control').attr('readonly', 'readonly');
	// form required label
	$("form .required:not(label)").each(function(el) {
		$(this).parents('.form-group').find('label.control-label').addClass('required');
	});
	$('body').on('draw.dt', 'table', function() {
		$(this).parents('div:hidden').fadeIn();
		// $(this).find('input:checkbox').iCheck({
		// checkboxClass: 'icheckbox_square-green',
		// radioClass: 'iradio_square-green',
		// });
	});
	// Ladda buttons
	$("button[type=submit]").addClass("ladda-button").attr("data-style", "slide-down").attr("data-spinner-size", 20).ladda('bind', {
		timeout : 2000
	});
	$(".ladda-button").attr("data-style", "slide-down").attr("data-spinner-size", 20).ladda('bind', {
		timeout : 2000
	});
	$('body').on('click', 'a.selectAll', function(e) {
		var text = $(this).text();
		if ('全选' == text) {
			$(this).text("反选");
			$(this).attr("title", "反选");
			$(this).parents('table').find('tbody input:checkbox').iCheck('check');
			$(this).parents('div.dataTables_scroll').find('div.dataTables_scrollBody tbody input:checkbox').iCheck('check');
		} else {
			$(this).text("全选");
			$(this).attr("title", "全选");
			$(this).parents('table').find('tbody input:checkbox').iCheck('uncheck');
			$(this).parents('div.dataTables_scroll').find('div.dataTables_scrollBody tbody input:checkbox').iCheck('uncheck');
		}
	});
	$('body').on('click', '.pagination a', function(e) {
		$("body a.selectAll").text("全选");
		$("body a.selectAll").attr("title", "全选");
		$("body a.selectAll").parents('table').find('tbody input:checkbox').iCheck('uncheck');
		$("body a.selectAll").parents('div.dataTables_scroll').find('div.dataTables_scrollBody tbody input:checkbox').iCheck('uncheck');
	});
	$('form.search-form').on('reset', function() {
		console.log("search form reset");
		$(this).find("select.select2").each(function(idx, el) {
			$(el).val(null).trigger("change");
		});
	});
	
	// keep search form data
	var searchForm = $('form.search-form');
	if(searchForm){
		var key = (baseUrl?baseUrl : '')+'searchForm';
		console.log("form data with key", key);
		loadFormData(key, searchForm);
		searchForm.on('submit', function(){
			saveFormData(key, this);
		});
	}
	toastr.options.timeOut = 10000;
	toastr.options.extendedTimeOut = 0;
	toastr.options.closeButton = true;
	toastr.options.progressBar = true;
	toastr.options.showMethod = 'slideDown';
	toastr.options.preventDuplicates = true;
	if (info)
		toastr.info(info);
	if (success)
		toastr.success(success);
	if (warning)
		toastr.warning(warning, '警告信息!', {
			timeOut : 0
		});
	if (error)
		toastr.error(error, '错误信息!', {
			timeOut : 0
		});
});

function saveFormData(key, form){
	if(sessionStorage){
		var data = $(form).serializeArray();
		if(data) sessionStorage.setItem(key, JSON.stringify(data));
	}
}

function loadFormData(key, form){
	if(sessionStorage){
		var data = sessionStorage.getItem(key);
		if(data)
			$(form).deserialize(JSON.parse(data));
	}
}
