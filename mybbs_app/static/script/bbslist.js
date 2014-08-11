var pageSize = 8;
var isFirst = true;
var spCateJsons;
var selSPs;
/*var selSPJsons = [
						{"id":"4028819d474d2df401474d2e01440014","name":"简书 - 首页"},
					  	{"id":"4028819d475166e9014751670e680000","name":"天涯 - 天涯杂谈"},
					  	{"id":"4028819d474d2df401474d2e0111000c","name":"天涯 - 热帖"}
					 ];*/
var selSPJsons = new Array();


function befShow(parDivId, subDivId,selDivId){
	if(isFirst){
		ajaxSPCate(parDivId,subDivId,selDivId,initParAndSubLi);
		isFirst = false;
	}else{
		
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
        	initSelLi(selSPJsons,selDivId);
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

function initSelLi(jsons,selDivId){

	//TODO ajax get selSPs instead of dummy
	var selStr = "";
	selStr += "<ul class='inline' id='selUl'>";
	
	$.each(jsons,function(i,sp){
		selStr = selStr + "<li ><a class='btn-small btn-warning' id='sel_" + sp.id + "'>" + sp.name + "</a></li>";
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
		selectOrDeSelectSP(selSPJsons, true, $sub, null, $("#selUl"));
	}
	
}
function bindSelLiClick(event){
	var $sel = event.data.ele;
	var uid = $sel.attr('id').split('_')[1];
	var $sub = $("#sub_" + uid);
	selectOrDeSelectSP(selSPJsons, false, $sub, $sel, $("#selUl"));
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
			var newSelSPStr = "<li ><a class='btn-small btn-warning' id='sel_" + newSelSP.id + "'>" + newSelSP.name + "</a></li>"
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

function loadbbslist(){
	$.ajax({
        type:"GET" ,
        url:"/list",
        //data:"aip=" + ILData[0] ,
        cache: false,
        success: function(result){
            
            //clean div_list
            $("#div_list1").html('');
            $("#div_list2").html('');
            $("#div_list3").html('');
            
            generateList(result);
            
        },
        error:function(result){
     	   alert("error");
        },
        beforeSend:function(r){
        	//$('#loadingDiv').modal('show');6371 1467
        },
        complete:function(r){
        	//$('#loadingDiv').modal('hide');
        }
  });
}

function generateList(result){
	var bbss = eval('(' + result + ')');
    $.each(bbss.list,function(i,bbs){
       if(isFirst &&　bbss.c == 'U'){
    	   var newSelSP = {"id":bbs.id,"name":bbs.name};
    	   selSPJsons.push(newSelSP);
       }
  	   var links = bbs.links.split('|_|');
       var totalp = 0;
  	   if(links.length % pageSize == 0 ){
  		 totalp = links.length / pageSize;
  	   }else{
  		 totalp = Math.floor((links.length / pageSize) + 1);
  	   }
 	   //alert(bbs.name);
 	   var str = '';
 	   str += "<br/><div class='row'>";
 	   str = str + "<article class='span11 post'>"
   	   	 + "<div class='inside'>"
   	   	 + "<p class='bbs-title'><a href='" + bbs.url + "' target='_blank'> <img class='img-rounded' src='/media/" + bbs.logo + "' alt=''/></a>&nbsp;&nbsp;" + bbs.name + "<p>"
  		 + "<div class='entry-content' id='div_list_" + i + "' curp='1' totalp='" + totalp + "'>";
 	   
 	   for(var j = 1;j <= totalp; j++ ){
 		 if(j == 1){
     		 str = str + "<table class='table' id='tb_" + i + "_" + j + "'>";
 		 }else{
     		 str = str + "<table class='table' id='tb_" + i + "_" + j + "' style='display:none;'>";
 		 }
 		 var from = (j-1) * pageSize;
 		 var to;
 		 if(j == totalp){
 			to = links.length - 1;
 		 }else{
 			to = j * pageSize;
 		 }
 		 for(var k = from; k < to; k++){
 			 str = str + "<tr><td>"
 			           + links[k]
	   	               + "</td></tr>";
 		 }
 		 str = str + "</table>";
 	   }
 	   
 	   str = str + "<div class='pagination pagination-right'>"
 	   			 + "<ul>"
 	   			 + "<li class=''><a id='pre_" + i + "' class='btn_pre' onclick='previousClick(this.id);'>前一页</a></li>"
 	   			 + "<li class=''><a id='next_" + i + "' class='btn_next' onclick='nextClick(this.id);'>后一页</a></li>"
 	   			 + "</ul>"
 	   			 + "</div>";
 	   str = str + "</div>"
		   	 + "</div>"
		   	 + "</article>";
		   	 + "</div>";
	   var content = '';
	   if((i+1) % 3 == 1 ){
		   content = $("#div_list1").html();
		   $("#div_list1").html(content + str);
	   }else if((i+1) % 3 == 2){
		   content = $("#div_list2").html();
		   $("#div_list2").html(content + str);
	   }else if((i+1) % 3 == 0){
		   content = $("#div_list3").html();
		   $("#div_list3").html(content + str);
	   }
    });
}
 
function previousClick(id){
	 var div_id = id.split('_')[1];
	 var div_list_id = 'div_list_' + div_id;
	 var curp ;
	 var totalp;
	 try{
		 curp = parseInt($("#" + div_list_id).attr("curp")); 
		 totalp = parseInt($("#" + div_list_id).attr("totalp")); 
	 }catch(e){
		 curp = 1;
		 totalp = 1;
	 }
	 if(curp <= 1){
		 
	 }else{
		// hide current table
		 $("#tb_" + div_id + "_" + curp).hide();
		 
		 //show previous table
		 curp -= 1;
		 $("#tb_" + div_id + "_" + curp).show();
		 
		 //update div_list's attr(curp)
		 $("#" + div_list_id).attr("curp",curp);
	 }
 }
 
function nextClick(id){
	 var div_id = id.split('_')[1];
	 var div_list_id = 'div_list_' + div_id;
	 var curp ;
	 var totalp;
	 try{
		 curp = parseInt($("#" + div_list_id).attr("curp")); 
		 totalp = parseInt($("#" + div_list_id).attr("totalp")); 
	 }catch(e){
		 curp = 1;
		 totalp = 1;
	 }
	 if(curp >= totalp){
		 
	 }else{
		 // hide current table
		 $("#tb_" + div_id + "_" + curp).hide();
		 
		 //show next table
		 curp += 1;
		 $("#tb_" + div_id + "_" + curp).show();
		 
		 //update div_list's attr(curp)
		 $("#" + div_list_id).attr("curp",curp);
	 }
}

function uptsp(){
	$('#btnUpt').button('loading');
	var newsps = new Array();
	for(var i = 0 ;i < selSPJsons.length; i ++){
		newsps.push(selSPJsons[i].id);
	}
	$.ajax({
        type:"POST" ,
        url:"/uptsp",
        data:{'newsps':newsps},
        cache: false,
        success: function(result){
            alert('success');
            $('#btnUpt').button('reset');
            $('#selectSPDiv').modal('hide');
            loadbbslist();
        },
        error:function(result){
     	   alert("error");
     	   $('#btnUpt').button('reset');
        }
  });
}
