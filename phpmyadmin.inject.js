jQuery(function($) {

console.log('Batis Helper loaded.');

function aopwrap(orign, before, after){
    if(typeof orign != 'function'){
        return orign;
    }

    return function(){
        if(typeof before == 'function'){
            before.apply(this, arguments);
        }

        orign.apply(this, arguments);

        if(typeof after == 'function'){
            after.apply(this, arguments);
        }
    }
}

function dumpSql(tablename, list){
	sql = 'insert into  ' + tablename + ' \n ('
	for(var i=0; i < list.length; i++){
		sql += ' `' + list[i] + '`,';
	}

	sql = sql.substring(0, sql.length -1);
	sql += ')\n values\n ( '

	for(i=0; i<list.length; i++){
		sql += ' #{' + underLine2Camel(list[i])+ '},';
	}
	sql = sql.substring(0, sql.length -1);
	sql += ')';

	return sql;
}

function dumpClassDef(tablename, list, typeList) {
	
	var fieldsDef = dumpFields(list, typeList);
	var classDef = '';
	if(fieldsDef.indexOf('Timestamp') != -1){
		classDef += 'import java.sql.Timestamp;\n';
	}
	if(fieldsDef.indexOf('Date') != -1){
		classDef += 'import java.sql.Date;\n';
	}

	classDef += '\n';



	var className = tablename[0].toUpperCase() + underLine2Camel(tablename.substring(1)) + 'DO';

	var datestr =  (new Date()).pattern("yyyy-MM-dd hh:mm:ss");
	classDef += '/**\n * Created By Batis JS Helper on ' + datestr  + '\n'  + ' */\n' + 
		'public class ' + className + ' {\n\n' + fieldsDef + '\n}';

	return classDef;
}

function dumpFields(list, typeList){
	classStr = ''
	for(var i=0; i< list.length; i++){
		fieldStr = '\tprivate ';
		fieldType = typeList[i];
		if (fieldType.indexOf('int') != -1){
			fieldStr += 'Integer';
		} else if (fieldType.indexOf('char') != -1){
			fieldStr += 'String';
		} else if (fieldType.indexOf('datetime') != -1){
			fieldStr += 'Timestamp';
		} else if(fieldType.indexOf('text') != -1 ){
			fieldStr += 'String';
		} else if(fieldType.indexOf('double') != -1 ){
			fieldStr += 'Double';
		} else if(fieldType.indexOf('date') != -1 ){
			fieldStr += 'Date';
		} else{
			fieldStr += 'Unknow';
		}

		fieldStr += ' ';
		fieldStr += underLine2Camel(list[i]);
		fieldStr += ";";

		classStr += fieldStr + "\n";
	}

	return classStr;
}


function underLine2Camel(ustr){
	n = '';
	for(var i=0; i<ustr.length; i++){
		if('_' == ustr[i]){
			while('_' == ustr[i]) i++;
			if( i >= ustr.length){
				break;
			}
			n += ustr[i].toUpperCase(); 
		} else {
			n += ustr[i];
		}
	}

	return n;
}


function dumpMapperXml(list){
	mapstr = '';
	for(var i=0; i< list.length; i++){
		line = '<result property="' + underLine2Camel(list[i]) + '" column="' + list[i] + '" />';
		mapstr += line  + "\n";
	}

	return mapstr;
}

function injectBtn(){
	aname = $('#topmenu .tabactive').text();
	if( aname && aname.indexOf('结构') != -1){
		if($('#gen_batis_info').length == 0){
			btn = '<a href="javascript:;" id="gen_batis_info"><span class="nowrap"><img src="themes/dot.gif" title="Generate Batis Code" alt="Generate Batis Code" class="icon ic_b_move"> Generate Batis Code</span></a>';
			$('#move_columns_anchor').after(btn);
			$('#gen_batis_info').click(showBatisCode);
		}
	}
}


// 侦听ajax事件
var obegin = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = aopwrap(obegin, function(){
	this.onloadend = function(){
		injectBtn();
	}
});

injectBtn();

function showBatisCode(e){

	var list = []
	var typeList = []

	labels = $('#tablestructure tr .nowrap label');
	for(var i=0; i< labels.length; i++){
		list.push( labels.eq(i).text());
	}
	labels = $('#tablestructure tr .nowrap bdo');
	for(var i=0; i< labels.length; i++){
		typeList.push( labels.eq(i).text());
	}

	var tablename = $('#serverinfo .item').last().text().split(':')[1].trim();
	if(!tablename){
		tablename = 'TABLENAME';
	}

	
	prettyShow( 'DO定义', dumpClassDef(tablename, list, typeList), 'do_class_define');
	prettyShow( 'Insert sql', dumpSql(tablename, list), 'insert_sql_str');
	prettyShow( 'Mapper Result Map', dumpMapperXml(list), 'mapper_result_map');
	return false;
}

function prettyShow(title, content, id){
	lineCount = content.split('\n').length + 2;
	if(id){
		if($('#' + id).length > 0){
			ret = '<legend>' + title + '</legend>\
    	<div class="" ><textarea style="width:100%;height:' + lineCount + 'em;">' + content + '</textarea></div>';
    		$('#' + id).html(ret);
    		return;
		}
	}


	idstr = 'id="' + id + '"';
	ret =  '<fieldset '+ idstr +' ><legend>' + title + '</legend>\
	<div class="" ><textarea style="width:100%;height:' + lineCount + 'em;">' + content + '</textarea></div></fieldset>';
	$('#page_content').children('.clearfloat').prepend(ret);
}


	/**       
 * 对Date的扩展，将 Date 转化为指定格式的String       
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符       
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)       
 * eg:       
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423       
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04       
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04       
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04       
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18       
 */          
Date.prototype.pattern=function(fmt) {           
    var o = {           
    "M+" : this.getMonth()+1, //月份           
    "d+" : this.getDate(), //日           
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时           
    "H+" : this.getHours(), //小时           
    "m+" : this.getMinutes(), //分           
    "s+" : this.getSeconds(), //秒           
    "q+" : Math.floor((this.getMonth()+3)/3), //季度           
    "S" : this.getMilliseconds() //毫秒           
    };           
    var week = {           
    "0" : "/u65e5",           
    "1" : "/u4e00",           
    "2" : "/u4e8c",           
    "3" : "/u4e09",           
    "4" : "/u56db",           
    "5" : "/u4e94",           
    "6" : "/u516d"          
    };           
    if(/(y+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));           
    }           
    if(/(E+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);           
    }           
    for(var k in o){           
        if(new RegExp("("+ k +")").test(fmt)){           
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
        }           
    }           
    return fmt;           
}

});