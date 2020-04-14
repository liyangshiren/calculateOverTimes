$(document).ready(function () {
    $("#plant").select2({
        ajax: {
            url: rootUrl + "/api/master/plants"
        }
    });
    // link select controls
    $("#souWarehouse").linkSelect2("plant", rootUrl + "/api/master/warehouses","plant");
    $("#desWarehouse").linkSelect2("plant", rootUrl + "/api/master/warehouses","plant");
    // 道口联动于工厂
    $("#desDock").linkSelect2("plant", rootUrl + "/api/master/docks","plant");
    // $("#dLine").linkSelect2("plant", rootUrl + "/api/master/dLines","plant");

    $('.form_datetime').datetimepicker({
        format: 'yyyy-mm-dd hh:ii:ss',
        todayBtn: "linked",
        calendarWeeks: true,
        autoclose: true,
        pickerPosition: "bottom-left"
    });

    $("#crpMgtForm").validate({
        rules : {
            reqArriveTime : {
                required: true
            }
        }
    });
});
