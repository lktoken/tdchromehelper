/*! TD Spider v1.0 | (c) lktoken */
console.log('TD Spider loaded.');

title = window.document.title;

var html = document.getElementsByTagName('html')[0];


currUrl = window.location.href;
if(currUrl.indexOf('nimitz') != -1){
	origin = window.location.origin;
	currPath = currUrl.substring( origin.length);
	if (currPath.startsWith('/project')){
		var script = window.document.createElement('script');
		script.src = chrome.extension.getURL('inject.js');
		html.appendChild(script);
	}
}
// phpMyAdmin
else if(title.toLowerCase().indexOf('phpmyadmin') != -1){
	var script = window.document.createElement('script');
	script.src = chrome.extension.getURL('phpmyadmin.inject.js');
	html.appendChild(script);
}
// Wiki
else if(currUrl.toLowerCase().indexOf('wiki') != -1 && currUrl.toLowerCase().indexOf('editpage.action') != -1){
	var script = window.document.createElement('script');
	script.src = chrome.extension.getURL('jquery.js');
	html.appendChild(script);
	script = window.document.createElement('script');
	script.src = chrome.extension.getURL('wiki.inject.js');
	html.appendChild(script);
}
