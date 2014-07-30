var isFirst = true;
var spCateJsons;
var selSPs;


function befShow(parDivId, subDivId){
	if(isFirst){
		initSPCate(parDivId,subDivId,initParAndSubLi);
		
		// 4. init sel li
		
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
        	alert("error");
        }
    });
}

function getOwnSP(){
	
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
			$(this).bind("click",{id:$(this).attr('id')},bindSubLiClick);
		});
		
	}
	
}

function initSelLi(json){
	
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
	
}
function bindSelLiClick(){
	
}
