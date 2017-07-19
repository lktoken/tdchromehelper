
var NEW_LINE = '<tr><td rowspan="3" class="confluenceTd"><span style="color: rgb(153,153,153);">15</span><br><br></td><td rowspan="3" class="confluenceTd"></td><td rowspan="3" class="confluenceTd">&nbsp;</td><td rowspan="3" class="confluenceTd"></td><td rowspan="3" class="confluenceTd"></td><td rowspan="3" class="confluenceTd"></td><td colspan="1" class="confluenceTd"><span style="color: rgb(153,153,153);">估计</span></td><td rowspan="3" class="confluenceTd"><span style="color: rgb(153,153,153);">&nbsp;</span><span style="color: rgb(153,153,153);">&nbsp;</span><br><br><br></td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd"></td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td class="confluenceTd">&nbsp;</td></tr>\
<tr><td class="confluenceTd"><span style="color: rgb(153,153,153);">&nbsp;</span></td><td colspan="1" class="confluenceTd"><span style="color: rgb(153,153,153);">实际</span></td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd"></td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td class="confluenceTd">&nbsp;</td></tr>\
<tr><td class="confluenceTd"><span style="color: rgb(153,153,153);">&nbsp;</span></td><td colspan="1" class="confluenceTd"><span style="color: rgb(153,153,153);">备注</span></td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd"><p>&nbsp;</p></td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td colspan="1" class="confluenceTd">&nbsp;</td><td class="confluenceTd">&nbsp;</td></tr>';

var text_ifr = document.getElementById('wysiwygTextarea_ifr');
var dest_tb = text_ifr.contentDocument.getElementsByClassName('confluenceTable');
// dest_tb.innerHTML = dest_tb.innerHTML + NEW_LINE;

window.alos_in_table = [];
window.now_select = null;
jQuery(function($){
	var add_tag_dom = $('<a href="javascript:(void);" id="addTableLine"  style="display:none;background:#EEE;position:fixed;line-height:40px;padding:0 10px;height:40px;cursor:pointer;" >拷贝一行</a>');
	// $(dest_tb).after(add_tag_dom);
	$('body').append(add_tag_dom);
	var scrollPanel = $(text_ifr.contentDocument);
	$(dest_tb).delegate('tr td', 'mouseenter', function(e){
		window.alos_in_table.push(1);

		var thisDOM = $(this);
		var rowspan = parseInt(thisDOM.attr('rowspan'));
		if(rowspan <= 1){
			return;
		}
		window.now_select = thisDOM;
		var base_height = $('#rte-toolbar').height();
		add_tag_dom.css('left', thisDOM.position().left - add_tag_dom.width() - scrollPanel.scrollLeft() - 17);
		add_tag_dom.css('top', 60 + base_height + thisDOM.position().top - scrollPanel.scrollTop() + (thisDOM.height() - add_tag_dom.height()) - 8);
		add_tag_dom.show();
		// $(this).after();
	});

	$(dest_tb).delegate('tr td', 'mouseleave', function(e){
		window.alos_in_table.pop();
	})

	$('body').click(function(){
		if(window.alos_in_table.length < 1 ){
			add_tag_dom.hide()
		}
	});

	add_tag_dom.click(function(e){
		if(window.now_select){
			var selected_trs = [];

			var ntd = window.now_select;
			var ntr = window.now_select.parent();
			var startform = ntr;
			var rows = parseInt(ntd.attr('rowspan'));

			selected_trs.push(ntr);

			if(rows && rows > 1){
				for(var i=1; i<rows; i++){
					ntr = ntr.next();
					selected_trs.push(ntr);
				}
				startform = ntr;
			} else {
				rows = 1;
			}
			for(var i=0; i<selected_trs.length; i++){
				var trclone = selected_trs[i].clone();
				startform.after(trclone);
				startform = trclone;
			}

			var allPreTrs = window.now_select.parent().prevAll();
			var firstLineTds = allPreTrs.eq(allPreTrs.length - 1).children('td');
			var rowspan_max = allPreTrs.length + selected_trs.length;
			for(var i=0; i<firstLineTds.length; i++){
				var rowspan = parseInt(firstLineTds.eq(i).attr('rowspan'));
				console.log( 'td text' + firstLineTds.eq(i).text() +' | rowspan:'+rowspan + ' | length: ' + rowspan_max + ' | ' + rows );
				if(rowspan && rowspan >= rowspan_max){
					firstLineTds.eq(i).attr('rowspan', rowspan + rows);
				}
			}
		}
	});

	// $(dest_tb).delegate('tr td', 'mouseleave', function(e){
	// 	window.alos_in_table.pop();

	// 	setTimeout('check', 1000);
	// });

});



