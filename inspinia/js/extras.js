// Extras 基础的JS功能
jQuery.extend({
	empty : function(v) {
		var undef;
		if (v == undef || v == null || $.trim(v) == '') {
			return true;
		}
		return false;
	},
	replaceAll : function(s, find, replace) {
		return s.replace(new RegExp(find, "gm"), replace);
	}

});

(function($) {
	/**
	 * 链接两个select2控件进行联动
	 * 
	 * @param to
	 *            联动源控件id，该控件值onChange时触发联动查询
	 * @url 联动查询url，url将动态解析to的值作为querystring
	 *      参数，url也可以为回调函数，关联select2的值会作为回调函数的参数传递
	 * @paramName 联动传给URL参数的参数名，默认为to控件的name属性
	 * @data 附加属性对象
	 */
	$.fn.linkSelect2 = function(to, url, paramName, data) {
		var target = $("#" + to);
		var that = this;
		var paramName = paramName ? paramName : $(target).attr("name")
		$(this).select2({
			ajax : {
				url : function() {
					var value = target.val();
					if ($.isFunction(url)) {
						return url(value);
					} else {
						return url;
					}
				},
				data : function(params) {
					params.q = params.term;
					params = $.extend({}, params, data);
					var value = target.val();
					params[paramName] = value;
					return params;
				}
			}
		});

		$(target).on("change", function() {
			$(that).val(null).trigger("change");
		});
	};

	/**
	 * 一个下拉框有多个关联项时的联动
	 * 
	 * @param to
	 *            联动关联控件, 应该为一个数组
	 * @url 
	 * 			  联动查询url，url将动态解析to的值作为querystring参数，url也可以为回调函数，关联select2的值会作为回调函数的参数传递
	 * @paramName 
	 * 			联动传给URL参数的参数名，默认为to控件的name属性, 应该为一个数组, 个数应等于第一个参数的个数
	 * @data 附加属性对象
	 */
	$.fn.linkSelect2WithControls = function(to, url, paramName, data) {
		if ((to instanceof Array) == false) {
			console.log("第一个参数必须为数组")
			return
		}
		if ((paramName instanceof Array) == false) {
			console.log("第三个参数必须为数组")
			return
		}
		
		if(to.length != paramName.length) {
			console.log("第一个参数和第三个参数的数量不一致")
			return
		}
		
		var that = this;
		$(this).select2({
			ajax : {
				url : function() {
					return url;
				},
				data : function(params) {
					params.q = params.term;
					params = $.extend({}, params, data);
					if (to instanceof Array) {
						$.each(to, function(index, element) {
							var value = element.val();
							params[paramName[index]] = value;
						});
					}
					return params;
				}
			}
		});

		$.each(to, function(index, element) {
			$(element).on("change", function() {
				$(that).val(null).trigger("change");
			});
		});
	}

	/**
	 * 链接两个html select控件进行联动
	 * 
	 * @param to
	 *            联动源控件id，该控件值onChange时触发联动查询
	 * @url 联动查询url，url返回json结果(服务器端的PageResult)，结果中conten属性为内容
	 * @options 选项 选项包括： 1. paramName：联动传给URL参数的参数名，默认为to控件的name属性 2.
	 *          addBlank：是否添加“请选择空选项”，默认true 3. valueProp:
	 *          联动添加option的value值取自于返回结果的属性名称，默认为"value" 4. textProp:
	 *          联动添加option的显示文本取自于返回结果的属性名称，默认为"text"
	 */
	$.fn.linkSelect = function(to, url, options) {
		var target = $("#" + to);
		var that = this;
		var paramName = $(target).attr("name")
		var defaultOptions = {
			paramName : paramName,
			addBlank : true,
			valueProp : 'value',
			textProp : 'text'
		};
		options = $.extend(defaultOptions, options);
		var valueProp = options.valueProp;
		var textProp = options.textProp;
		var addBlank = typeof options.addBlank == undefined ? true : options.addBlank;
		paramName = options.paramName;

		target.on("change", function() {
			$(that).find("option").remove();
			if (addBlank) {
				$(that).append('<option value="">请选择</option>');
			}
			// 如果是搜索框，则需要找到对应id值
			var param = $(target).val();
			var srcId = $(target).attr("id");
			var vId = $("#" + srcId + "Id").val();
			if (vId) {
				param = vId;
			}
			if (!param)
				return;
			var q = {
				ajax : true
			};
			q[paramName] = param;

			// ajax填充数据
			$.getJSON(url, q, function(res) {
				if (res && res.content && res.content.length) {
					$.each(res.content, function(i, item) {
						$(that).append(
								'<option value="' + (valueProp ? item.id : eval("item." + valueProp)) + '">' + (textProp ? item.displayLabel : eval("item." + textProp))
										+ '</option>');
					});
				}
			});
		});
	};
})(jQuery);
