function selectFile() {
    document.getElementById('file').click();
}

// 读取本地excel文件
function readWorkbookFromLocalFile(file, callback) {
    var reader = new FileReader();
    reader.onload = function (e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {type: 'binary'});
        if (callback) callback(workbook);
    };
    reader.readAsBinaryString(file);
}

// 从网络上读取某个excel文件，url必须同域，否则报错
function readWorkbookFromRemoteFile(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (e) {
        if (xhr.status == 200) {
            var data = new Uint8Array(xhr.response)
            var workbook = XLSX.read(data, {type: 'array'});
            if (callback) callback(workbook);
        }
    };
    xhr.send();
}

// 读取 excel文件
function outputWorkbook(workbook) {
    var sheetNames = workbook.SheetNames; // 工作表名称集合
    sheetNames.forEach(name => {
        var worksheet = workbook.Sheets[name]; // 只能通过工作表名称来获取指定工作表
        for (var key in worksheet) {
            // v是读取单元格的原始值
            console.log(key, key[0] === '!' ? worksheet[key] : worksheet[key].v);
        }
    });
}

/**
 * STEP2
 * Excel已经读进来了，通过操作workbook
 * 可以选中多张Excel表格
 * */
function readWorkbook(workbook) {
    var sheetNames = workbook.SheetNames; // 工作表名称集合
    var worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
    /**
     * t：表示内容类型，s表示string类型，n表示number类型，b表示boolean类型，d表示date类型，等等
     v：表示原始值；
     f：表示公式，如B2+B3；
     h：HTML内容
     w：格式化后的内容
     * */
    //默认遍历顺序从左到右
    // for(const key in worksheet) {
    //     // v是读取单元格的原始值
    //     console.log(key, key[0] === '!' ? worksheet[key] : worksheet[key].v);
    // }
    /**
     * 按行遍历
     * */
    let tempData = [];
    tempData.push(["人员工号", "人员姓名", "考勤日期", "星期", "班次时间", "上班打卡", "下班打卡", "加班时间（小时）"])
    let j = 2;
    let i = "A2";
    let C = "C2";
    let D = "D2";
    let E = "E2";
    let F = "F2";
    let I = "I2";
    let N = "N2";
    let O = "O2";
    let P = "P2";
    while (worksheet[i] != null) {
        console.log(" 处理" + i + "数据中...")
        let row_temp = [];
        // 人员工号
        row_temp.push(worksheet[C].v);
        // 人员姓名
        row_temp.push(worksheet[D].v);
        // 考勤日期
        row_temp.push(worksheet[E].w);
        // 星期
        row_temp.push(worksheet[F].v);
        // 班次时间
        if (worksheet[I].w == "0") {
            row_temp.push("非工作日");
        } else {
            row_temp.push(worksheet[I].w);
        }
        let toDayCardTimeStart = null;
        // 上班打卡时间
        if (worksheet[N]) {
            row_temp.push(worksheet[N].w);
            toDayCardTimeStart = worksheet[N].w;
        } else {
            row_temp.push("");
        }
        let toDayCardTimeEnd = null;
        // 下班打卡时间
        if (worksheet[O]) {
            row_temp.push(worksheet[O].w);
            toDayCardTimeEnd = worksheet[O].w;
        } else {
            row_temp.push("");
        }
        // 计算加班时间
        let TS = null;
        let TE = null;
        if (worksheet[I].w == "0") {
            TS = 0;
            TE = 0;
        } else {
            TS = worksheet[E].w + " " + worksheet[I].w.split('-')[0];
            TE = worksheet[E].w + " " + worksheet[I].w.split('-')[1];
        }
        let TE_ = null;
        if (worksheet[P].w.split(':').length == 2) {
            TE_ = worksheet[E].w + " " + worksheet[P].w;
        }

        row_temp.push(calculateExtraWorkingTime(TS, TE, TE_, null, toDayCardTimeStart, toDayCardTimeEnd));
        if (worksheet[P].w.split(':').length == 2) {
            row_temp.push("是");
        }
        tempData.push(row_temp);
        j++;
        i = "A" + j;
        C = "C" + j;
        D = "D" + j;
        E = "E" + j;
        F = "F" + j;
        I = "I" + j;
        N = "N" + j;
        O = "O" + j;
        P = "P" + j;
    }

    // TODO  拿到了原始数据，开始业务逻辑处理，处理完之后开始渲染处理后的表格
    const result_data = tempData;
    let worksheet_temp = XLSX.utils.aoa_to_sheet(result_data);
    /* Add the worksheet to the workbook */
    // XLSX.utils.book_append_sheet(workbook, ws, result_sheetName);
    const csv = XLSX.utils.sheet_to_csv(worksheet_temp);
    document.getElementById('result').innerHTML = csv2table(csv);
    /***
     * 直接导出结果
     */
    exportSpecialExcel(worksheet_temp);
}

/**
 * 处理完数据开始绘制表格显示到页面上
 * */
// 将csv转换成表格
function csv2table(csv) {
    var html = '<table class="table table-striped table-bordered table-hover dataTables-example" >';
    var rows = csv.split('\n');
    rows.pop(); // 最后一行没用的
    html += '<thead>\n' +
        '                                    <tr>\n' +
        '                                        <th>序号</th>\n' +
        '                                        <th>人员工号</th>\n' +
        '                                        <th>人员姓名</th>\n' +
        '                                        <th>考勤日期</th>\n' +
        '                                        <th>星期</th>\n' +
        '                                        <th>班次时间</th>\n' +
        '                                        <th>上班打卡</th>\n' +
        '                                        <th>下班打卡</th>\n' +
        '                                        <th>加班时间</th>\n' +
        '                                        <th>是否综合工时</th>\n' +
        '                                    </tr>\n' +
        '                                    </thead>';
    rows.forEach(function (row, idx) {
        var columns = row.split(',');
        columns.unshift(idx + 1); // 添加行索引
        if (idx == 0) { // 添加列索引
            html += '<tr>';
            for (var i = 0; i < columns.length; i++) {
                html += '<th>' + (i == 0 ? '' : String.fromCharCode(65 + i - 1)) + '</th>';
            }
            html += '</tr>';
        }
        html += '<tr>';
        columns.forEach(function (column) {
            html += '<td>' + column + '</td>';
        });
        html += '</tr>';
    });
    html += '</table>';
    return html;
}

function table2csv(table) {
    var csv = [];
    $(table).find('tr').each(function () {
        var temp = [];
        $(this).find('td').each(function () {
            temp.push($(this).html());
        })
        temp.shift(); // 移除第一个
        csv.push(temp.join(','));
    });
    csv.shift();
    return csv.join('\n');
}

// csv转sheet对象
function csv2sheet(csv) {
    var sheet = {}; // 将要生成的sheet
    csv = csv.split('\n');
    csv.forEach(function (row, i) {
        row = row.split(',');
        if (i == 0) sheet['!ref'] = 'A1:' + String.fromCharCode(65 + row.length - 1) + (csv.length - 1);
        row.forEach(function (col, j) {
            sheet[String.fromCharCode(65 + j) + (i + 1)] = {v: col};
        });
    });
    return sheet;
}

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {type: "application/octet-stream"});

    // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    return blob;
}

/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
function openDownloadDialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}

/**
 * STEP1
 * 程序起始点，读取选中的Excel
 * 调用readWorkbook
 */
$(function () {

    document.getElementById('file').addEventListener('change', function (e) {
        var files = e.target.files;
        if (files.length == 0) return;
        var f = files[0];
        if (!/\.xlsx$/g.test(f.name)) {
            alert('仅支持读取xlsx格式！');
            return;
        }
        readWorkbookFromLocalFile(f, function (workbook) {
            readWorkbook(workbook);
        });
    });
    loadRemoteFile('./sample/test.xlsx');
});

function loadRemoteFile(url) {
    readWorkbookFromRemoteFile(url, function (workbook) {
        readWorkbook(workbook);
    });
}

function exportExcel() {
    var csv = table2csv($('#result table')[0]);
    var sheet = csv2sheet(csv);
    var blob = sheet2blob(sheet);
    openDownloadDialog(blob, '导出.xlsx');
}

function exportSpecialExcel(sheet) {
    openDownloadDialog(sheet2blob(sheet), '统计结果.xlsx');
}


/**
 * 计算加班时间，内含部门计算加班时间主要逻辑
 * @TS 真实的班次开始时间（科室）
 * @TE 真实的班次结束时间（科室）
 * @toDayIsWorker 今天这个人是不是(值班)综合工时
 * @toDayCardTimeStart 这个人今天的上班打卡时间
 * @toDayCardTimeEnd  这个人今天下班的打卡时间
 * */
function calculateExtraWorkingTime(TS, TE, TE_, toDayIsWorker, toDayCardTimeStart, toDayCardTimeEnd) {
    let extraTime = 0; //默认加班时间为0
    //根据有没有填写生产结束时间判定是否按综合工时
    if (!TE_) {
        toDayIsWorker = 0;
    } else {
        toDayIsWorker = 1;
    }
    if (TE == TS) { //今天非科室工作日，即周末  疑问，需要扣除半小时吃饭
        let result = countWorkOverTime(new Date(toDayCardTimeStart), new Date(toDayCardTimeEnd)).split('-');
        if (result[0]) { //首位是标记位，判断拿到的数据是不是正常,这里判断上下班时间是不是填反了
            extraTime = parseFloat(result[5]) - 0.5 <= 0 ? 0 : parseFloat(result[5]) - 0.5;
        } else {
            console.log("数据异常，可能是上下班时间反向输入了!");
        }
    } else if (toDayIsWorker) {//今天甲是综合工时
        //甲今天的工作时长
        let workingLen = countWorkOverTime(new Date(toDayCardTimeStart), new Date(toDayCardTimeEnd)).split('-')[5];
        //今天的规定工作时长
        let shouldLen = countWorkOverTime(new Date(TS), new Date(TE)).split('-')[5];
        if (shouldLen < workingLen) {
            //加班了
            if (isTime1MoreThanTime2(TE_, TE_.substr(0, TE_.length - 5) + " 18:00")) { //今天的生产时间>=18:00
                if (isTime1MoreThanTime2(toDayCardTimeStart.substr(0, TE_.length - 5) + " 7:10", toDayCardTimeStart)) {//早上打卡时间在7:15之前
                    extraTime += 1.5;//早上算加班1.5h
                }
                if (isTime1MoreThanTime2(toDayCardTimeEnd, TE)) {
                    let tempResult = countWorkOverTime(new Date(TE), new Date(toDayCardTimeEnd)).split('-');
                    if (tempResult[0]) {
                        extraTime += parseFloat(tempResult[5]);//下午加班时间
                    }
                }
            } else {//今天的生产时间没超过下午6点
                if (isTime1MoreThanTime2(toDayCardTimeStart.substr(0, TE_.length - 5) + " 7:10", toDayCardTimeStart)) {//早上打卡时间在7:15之前
                    extraTime += 1.5;//早上算加班1.5h
                }
                if (isTime1MoreThanTime2(toDayCardTimeEnd, TE)) {
                    let tempResult = countWorkOverTime(new Date(TE), new Date(toDayCardTimeEnd)).split('-');
                    if (tempResult[0]) {
                        extraTime += parseFloat(tempResult[5]) - 0.5 >= 0 ? parseFloat(tempResult[5]) - 0.5 : 0;//下午加班时间
                    }
                }

            }
        } else {
            //没有加班，甚至欠班
            console.log("欠班： " + parseFloat(shouldLen) - parseFloat(workingLen) + "小时");
        }

    } else {//今天甲是科室工时
        //拿到早上的时间差
        let morning = countWorkOverTime(new Date(toDayCardTimeStart), new Date(TS)).split('-');
        //拿到晚上的时间差
        let afternoon = countWorkOverTime(new Date(TE), new Date(toDayCardTimeEnd)).split('-');
        //拿到规定上班时长
        let shouldLen = countWorkOverTime(new Date(TS), new Date(TE)).split('-');
        //拿到实际上班时长
        let workLen = countWorkOverTime(new Date(toDayCardTimeStart), new Date(toDayCardTimeEnd)).split('-');
        //判定数据都是有效的
        if (morning[0] && afternoon[0] && shouldLen[0] && workLen[0] && (morning[5] >= 0.5 || afternoon[5] >= 0.5) && (workLen[5] - shouldLen[5] > 0)) {
            //这个科室人员加班成功了
            if (isTime1MoreThanTime2(toDayCardTimeStart.substr(0, TS.length - 5) + " 7:10", toDayCardTimeStart)) {//早上打卡时间在7:15之前
                extraTime += 1.5;//早上算加班1.5h
            }
            if (isTime1MoreThanTime2(toDayCardTimeEnd, TE)) {
                let tempResult = countWorkOverTime(new Date(TE), new Date(toDayCardTimeEnd)).split('-');
                if (tempResult[0]) {
                    extraTime += parseFloat(tempResult[5]) - 1 >= 0 ? parseFloat(tempResult[5]) : 0;//下午加班时间
                }
            }
        } else {
            console.log("这个科室人员没有加班，且有可能欠班: " + (parseFloat(workLen[5]) - parseFloat(shouldLen[5])) + "小时");
        }
    }
    return extraTime;
}

/**
 * 计算加班时间，上午段，下午段需要分别调用
 * @startTime 起始时间 以绝对时间传入 示例 new Date().getTime()
 * @endTime 结束时间
 * */
function countWorkOverTime(startTime, endTime) {
    let diff = '';
    let day = 0;
    let hour = 0;
    let minute = 0;
    //result存放业务值，具体加班n.5/n.0小时
    let result = 0;
    let isNormal = 1;
    let time_diff = endTime - startTime;
    //时间输入值反了，或者欠班
    if (time_diff < 0) {
        isNormal = 0;
        time_diff = -time_diff;
    }
    // 计算相差天数
    let days = Math.floor(time_diff / (24 * 3600 * 1000));
    if (days > 0) {
        diff += days + '天';
        day = days;
    }
    // 计算相差小时数
    let leave1 = time_diff % (24 * 3600 * 1000);
    let hours = Math.floor(leave1 / (3600 * 1000));
    if (hours > 0) {
        diff += hours + '小时';
        hour = hours;
    } else {
        if (diff !== '') {
            diff += hours + '小时';
        }
    }
    // 计算相差分钟数
    let leave2 = leave1 % (3600 * 1000);
    let minutes = Math.floor(leave2 / (60 * 1000));
    if (minutes > 0) {
        diff += minutes + '分';
        minute = minutes;
    } else {
        if (diff !== '') {
            diff += minutes + '分';
        }
    }
    // 计算相差秒数
    let leave3 = leave2 % (60 * 1000);
    let seconds = Math.round(leave3 / 1000);
    if (seconds > 0) {
        diff += seconds + '秒';
    } else {
        if (diff !== '') {
            diff += seconds + '秒';
        }
    }

    //默认认为数据有效，即day=0，只管小时
    result = (Math.floor((hour * 60 + minute) / 30)) / 2;
    return isNormal + '-' + diff + '-' + day + '-' + hour + '-' + minute + '-' + result;
}

/**
 * 时间比较器
 * time1>time2则返回 True
 * */
function isTime1MoreThanTime2(time1, time2) {
    return new Date(time1).getTime() > new Date(time2).getTime() ? 1 : 0;
}

