$(document).ready(function() {
//  $("#pack").hide();
//  $("#pack").attr("disabled", true);

    // form validation
    $("#crpPartForm").validate({
        rules: {
            part: {
                remote: {
                    type: 'get',
                    url: baseUrl+"/check/part",
                    data: {
                        crpId: crpId,
                        oldPartId: oldPart,
                        oldSupplId: oldSuppl,
                        partId: function(){
                            return $("#part").val();
                        },
                        supplId: function(){
                            return $("#suppl").val();
                        }
                    }
                }
            }
        },
        messages: {
            part: {
                remote: "该零件和供应商已被存在!"
            }
        }
    });

    $("#part").select2({
        ajax: {
            url: rootUrl + "/api/master/parts",
            data: function(obj){
                obj.q = obj.term;
                obj.warehouse = warehouse;
                return obj;
            },
        }
    });

    $("#suppl").linkSelect2("part", rootUrl + "/api/master/supplsByPart","part");

//  $("#pack").linkSelect2(rootUrl + "/api/master/packs");

//  $("#pack").select2({
//    ajax: {
//      url: rootUrl + "/api/master/packs"
//    }
//  });

    $("#pack").linkSelect2("part", rootUrl + "/api/master/packsByPart","part");

    $("#part").on("change",function(){
        var partId = $("#part").val();
        //查找零件下的线边包装容量
        $.ajax({
            url: rootUrl + "/master/part/getOne?id="+ partId,
            type: 'get',
            success: function(data){
                if(data){
                    $("#pQty").val(data.linePackageNum);
                }
            }
        })
    })

    //计算包装箱数
    $("#reqQty").on('blur', function(){
        var reqQty = this.value;
        var pQty = $("#pQty").val();
        getBoxnum(reqQty, pQty);
    })

    $("#pQty").on('blur', function(){
        var pQty = this.value;
        var reqQty = $("#reqQty").val();
        getBoxnum(reqQty, pQty);
    })

    function getBoxnum(reqQty, pQty){
        console.log(reqQty, pQty);
        if(!reqQty){
            $("#reqBoxnum").val(0);
        }
        if(!pQty){
            $("#reqBoxnum").val(0);
        }
        $("#reqBoxnum").val(reqQty / pQty);
    }

//	  if(partId){
//		  $("#pack").linkSelect2("part", rootUrl + "/api/master/packsByPart","part");
//	  }else{
//		  $("#pack").linkSelect2(rootUrl + "/api/master/packs");
//	  }

//	 $.ajax({
//	   async:false,
//       url: rootUrl + "/master/part/getOne",
//       data: {
//    	  id: function() {
//    		  return $("#part").val();
//    	  }
//       },
//	   success: function(data){
//		  $("#unit").val(data['unit']);
//		  $("#unitTmp").val(data['unit']);
//
//		  $.ajax({
//			  async:false,
//		      url: rootUrl + "/master/partSuppl/getOne",
//		      data: {
//		    	  suppl: supplId,
//		    	  part: function() {
//		    		  return $("#part").val();
//		    	  }
//		      },
//	  		  success: function(data){
//	  			  $("#pQty").val(data['packageQty']);
//	  			  if (null != data["pack"]){
//	  				  $("#pack").val(data["pack"].id)
//	  	  			  $("#packTmp").val(data["pack"].no +"-"+data["pack"].name);
//	  			  }
//	  		  }
//		 });
//	   }
//	 });
//  });

});
