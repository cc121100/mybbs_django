var isFirst = true;
var spCateJsons;
var selSPs;
var dummySelSPJson = [
						{"id":"4028819d474d2df401474d2e01440014","name":"简书 - 首页"},
					  	{"id":"4028819d475166e9014751670e680000","name":"天涯 - 天涯杂谈"},
					  	{"id":"4028819d474d2df401474d2e0111000c","name":"天涯 - 热帖"}
					 ];


function befShow(parDivId, subDivId,selDivId){
	if(isFirst){
		initSPCate(parDivId,subDivId,initParAndSubLi);
		
		// 4. init sel li
		initSelLi(selDivId);
		
		// 5. sel li bin click
		
		
		isFirst = false;
	}else{
		
	}
}

function initSPCate(parDivId, subDivId, initParAndSubLiCall){
	
	// 1 get cate sp list
	$.ajax({
        type:"GET" ,
        url:"/cateSP",
        cache: false,
        success: function(result){
        	jsonList=eval('('+result+')');
        	initParAndSubLiCall(jsonList, parDivId, subDivId);
        },
        error:function(result){
        	alert("error when initSPCate");
        }
    });
}

function initParAndSubLi(jsonList, parDivId, subDivId){
	
	if(jsonList == null || jsonList=='undefined'){
		
	}else{
		
		// 2. init par and sub li
		var parLiStr = ''; 
		var subLiStr = ''; 
		
		parLiStr += "<ul class='nav nav-pills nav-stacked'>";
		
		$.each(jsonList,function(i,cateJson){
			if(i != 0){
				parLiStr = parLiStr + "<li><a class='btn btn-info par' id='par_" + i + "'>" + cateJson.name + "</a></li>";
				subLiStr += "<ul class='inline' id='ul_" + i + "' style='display:none;'>";
			}else{
				parLiStr = parLiStr + "<li><a class='btn btn-primary par' id='par_" + i + "'>" + cateJson.name + "</a></li>";
				subLiStr += "<ul class='inline' id='ul_" + i + "'>";
			}
			$.each(cateJson.subs,function(j,sub){
				subLiStr = subLiStr + "<li style='width:150px;' ><a class='btn-small btn-link sub'id='sub_" + i + "_" + j + "' uid='" + sub.id + "'>" + sub.spName +"</a></li>";
			});
			subLiStr += "</ul>";
		});

		parLiStr += "</ul>";
		$("#" + parDivId).html(parLiStr);
		$("#" + subDivId).html(subLiStr);
		
		// 3.par li bind click
		$("a[id^='par_']").each(function(){
			$(this).bind("click",{id:$(this).attr('id')},bindParLiClick);
		});
		
		// 4. sub li bind click
		$("a[id^='sub_']").each(function(){
			$(this).bind("click",{ele:$(this)},bindSubLiClick);
		});
		
	}
	
}

function initSelLi(selDivId){

	//TODO ajax get selSPs instead of dummy
	var selStr = "";
	selStr += "<ul class='inline' id='selUl'>";
	$.each(dummySelSPJson,function(i,sp){
		selStr = selStr + "<li ><a class='btn btn-warning' id='sel_" + i + "' uid='" + sp.id + "'>" + sp.name + "</a></li>";
	});
	selStr += "</ul>";
	$("#" + selDivId).html(selStr);

	//bind click for selli
	$("a[id^='sel_']").each(function(){
		$(this).bind("click",{ele:$(this)},bindSelLiClick);
	});

}
function bindParLiClick(event){
	var parId = event.data.id;
	//change par css
	$("a[id^='par_']").each(function(){
		$(this).attr('class','btn btn-info par');
	});
	$("#" + parId).attr('class','btn btn-primary par');
	
	// show/hide sub ul
	var i = parId.split('_')[1];
	$("ul[id^='ul_']").each(function(){
		$(this).hide();
	});
	$("#ul_" + i).show();
	
}

function bindSubLiClick(event){
	var $sub = event.data.ele;
	if($sub.attr('et') != 'e'){
		selectOrDeSelectSP(dummySelSPJson, true, $sub, null, $("#selUl"));
	}
	
}
function bindSelLiClick(event){
	var $del = event.data.ele;
	selectOrDeSelectSP(dummySelSPJson, false, $("a[uid='" + $del.uid +"']"), $del, $("#selUl"));
}

function selectOrDeSelectSP(jsons,isSelect, $subSP, $selSP, $selUl){
	if (isSelect) {
		var isExsited = false;
		// check if select sp is exsited in selSPJson
		for(var i = 0; i < jsons.length; i++ ){
			if ($subSP.attr('uid') == jsons[i].id) {
				isExsited = true;
				break;
			}
		}

		if(!isExsited){
			// add sp in selSPJson
			var newSelSP = {"id":$subSP.attr('uid'),"name":$subSP.html()};
			jsons.push(newSelSP);
			// add <li><a> in selDIv ul
			var newSelSPStr = "<li ><a class='btn btn-warning' uid='" + newSelSP.id + "'>" + newSelSP.name + "</a></li>"
			var oriHtml = $selUl.html();
			$selUl.html(oriHtml + newSelSPStr);

			//bind click event for new selSP
			$("a[uid='" + newSelSP.id + "']").live("click",{ele:$(this)},bindSelLiClick);

			// change css
			$subSP.attr('class','btn-small btn-warning sub');
			$subSP.attr('et','e');
		}
	}else{
		// remove sp in selSPJson
		for(var i = 0; i < jsons.length; i++ ){
			if ($selSP.attr('uid') == jsons[i].id) {
				jsons.splice(i);
				break;
			}
		}

		// remove <li><a> in selDIv ul
		$selSP.remove();

		// change css
		$subSP.attr('class','btn-small btn-link sub');
		$subSP.attr('et','');
	}
}
