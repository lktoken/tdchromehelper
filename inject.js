jQuery(function($) {
	
    // window.ctrlPanel = $('#ProjectListCtrl');
    // angular = window.angular;
    // $scope = angular.element(ctrlPanel).scope();

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



    function getViewBtn(br, appName){
        
        if(!appName){
            appName = br.substring(0, br.length  - 12);
        }

        if( 'forseti-api' == appName ){
            appName = 'forseti';
        }
        
        reviewurl = 'https://gitlab.fraudmetrix.cn/app/' + appName + '/compare/master...' + br;

        return '<a href="' + reviewurl + '" class="reviewurl" target="_blank" style="color: blue;" >Review</a>';
    }

    function showViewbtns(){
        $('#ProjectListCtrl tr').each(function(){ 
            var branchcell = $(this).children('td').eq(1);
            branchcell.children('span').each(function(){
                br = $(this).text().trim();
                $(this).after(getViewBtn(br));
            }
            );
        });
    }

    // 侦听ajax事件
    var obegin = pageBind;
    pageBind = aopwrap(obegin, undefined, function(){
        
        setTimeout( showViewbtns, 100);
        console.log('wraped');
    });

    showViewbtns();
    // setTimeout( showViewbtns, 1000);
    console.log('Nimitz helper loaded!');

});
