var isFirst = true;
var spCateJsons;
var selSPs;
/*var dummySelSPJson = [
						{"id":"4028819d474d2df401474d2e01440014","name":"简书 - 首页"},
					  	{"id":"4028819d475166e9014751670e680000","name":"天涯 - 天涯杂谈"},
					  	{"id":"4028819d474d2df401474d2e0111000c","name":"天涯 - 热帖"}
					 ];*/
var dummySelSPJson = new Array();


function befShow(parDivId, subDivId,selDivId){
	if(isFirst){
		ajaxSPCate(parDivId,subDivId,selDivId,initParAndSubLi);
		
		/*initSelLi(dummySelSPJson,selDivId);*/
		
		isFirst = false;
	}else{
		/*initParAndSubLiCall(spCateJsons, parDivId, subDivId);
		initSelLi(dummySelSPJson,selDivId);*/
		
	}
}

function ajaxSPCate(parDivId, subDivId,selDivId, initParAndSubLiCall){
	
	// 1 get cate sp list
	$.ajax({
        type:"GET" ,
        url:"/cateSP",
        cache: false,
        success: function(result){
        	jsonList=eval('('+result+')');
        	spCateJsons = jsonList;
        	initParAndSubLiCall(spCateJsons, parDivId, subDivId);
        	initSelLi(dummySelSPJson,selDivId);
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
				subLiStr = subLiStr + "<li style='width:150px;' ><a class='btn-small btn-link sub'id='sub_" + sub.id + "'>" + sub.spName +"</a></li>";
			});
			subLiStr += "</ul>";
		});

		parLiStr += "</ul>";
		$("#" + parDivId).html(parLiStr);
		$("#" + subDivId).html(subLiStr);
		
		// 3.par li bind click
		$("a[id^='par_']").each(function(){
			$(this).bind("click",{ele:$(this)},bindParLiClick);
		});
		
		// 4. sub li bind click
		$("a[id^='sub_']").each(function(){
			$(this).bind("click",{ele:$(this)},bindSubLiClick);
		});
		
	}
	
}

function ajaxSel(selDivId){
	
}

function initSelLi(jsons,selDivId){

	//TODO ajax get selSPs instead of dummy
	var selStr = "";
	selStr += "<ul class='inline' id='selUl'>";
	
	$.each(jsons,function(i,sp){
		selStr = selStr + "<li ><a class='btn btn-warning' id='sel_" + sp.id + "'>" + sp.name + "</a></li>";
	});
	selStr += "</ul>";
	$("#" + selDivId).html(selStr);
	

	$("a[id^='sel_']").each(function(){
		//sync sel and sub
		var uid = $(this).attr('id').split('_')[1];
		$("#sub_" + uid).attr('class','btn-small btn-warning sub');
		
		//bind click for selli
		$(this).bind("click",{ele:$(this)},bindSelLiClick);
	});

}
function bindParLiClick(event){
	var $par = event.data.ele;
	changeParAndSub($par);
}

function bindSubLiClick(event){
	var $sub = event.data.ele;
	if($sub.attr('et') != 'e'){
		selectOrDeSelectSP(dummySelSPJson, true, $sub, null, $("#selUl"));
	}
	
}
function bindSelLiClick(event){
	var $sel = event.data.ele;
	var uid = $sel.attr('id').split('_')[1];
	var $sub = $("#sub_" + uid);
	selectOrDeSelectSP(dummySelSPJson, false, $sub, $sel, $("#selUl"));
}

function changeParAndSub($par){
	//change par css
	$("a[id^='par_']").each(function(){
		$(this).attr('class','btn btn-info par');
	});
	$par.attr('class','btn btn-primary par');
	
	// show/hide sub ul
	var i = $par.attr('id').split('_')[1];
	$("ul[id^='ul_']").each(function(){
		$(this).hide();
	});
	$("#ul_" + i).show();
}

function selectOrDeSelectSP(jsons,isSelect, $subSP, $selSP, $selUl){
	if (isSelect) {
		var isExsited = false;
		// check if select sp is exsited in selSPJson
		var uid = $subSP.attr('id').split('_')[1];
		if(jsons.length >= 8){
			return;
		}
		for(var i = 0; i < jsons.length; i++ ){
			if (uid == jsons[i].id) {
				isExsited = true;
				break;
			}
		}

		if(!isExsited){
			// add sp in selSPJson
			var newSelSP = {"id":uid,"name":$subSP.html()};
			jsons.push(newSelSP);
			// add <li><a> in selDIv ul
			var newSelSPStr = "<li ><a class='btn btn-warning' id='sel_" + newSelSP.id + "'>" + newSelSP.name + "</a></li>"
			var oriHtml = $selUl.html();
			$selUl.html(oriHtml + newSelSPStr);

			//bind click event for new selSP
			//$("#sel_" + newSelSP.id ).on("click",{ele:$("#sel_" + newSelSP.id)},bindSelLiClick);
			$("a[id^='sel_']").each(function(){
				$(this).bind("click",{ele:$(this)},bindSelLiClick);
			});

			// change css
			$subSP.attr('class','btn-small btn-warning sub');
			$subSP.attr('et','e');
		}
	}else{
		// remove sp in selSPJson
		var uid = $selSP.attr('id').split('_')[1];
		for(var i = 0; i < jsons.length; i++ ){
			if (uid == jsons[i].id) {
				jsons.splice(i,1);
				break;
			}
		}

		// remove <li><a> in selDIv ul
		$selSP.parent().remove();
		//$selSP.remove();

		// change css
		$subSP.attr('class','btn-small btn-link sub');
		$subSP.attr('et','');
	}
}

function syncSubAndSel(){
	
}
