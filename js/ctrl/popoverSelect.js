
var applicArray=null;
var applicUL=null;
//选中时
function getCheck(ind,names){
    if(inArray(applicArray,ind)){
        remove(ind,names);
    }else{
        applicArray.unshift({id:ind,label:names});
        var li =  '<li id="'+ind+'" class="checkboxli">'+names+'<a onclick="remove('+(applicArray[applicArray.length-1].id)+',\''+names+'\')">X</a></li>';
        $("#"+applicUL).append(li);
    }
}
//初始化下拉内容
function ContentMethod(origArray,kindOpt) {
    var str="";
    for(var i=0;i<kindOpt.length;i++){
        if(origArray&&inArray(origArray,kindOpt[i].id)){
            str+='<input type="checkbox" id="checkboxname'+i+'" checked="checked" onclick="remove('+kindOpt[i].id+',\''+kindOpt[i].label+'\')" value="'+kindOpt[i].id+'">'+kindOpt[i].label+'</br>';
        }else{
            str+='<input type="checkbox" id="checkboxname'+i+'" onclick="getCheck('+kindOpt[i].id+',\''+kindOpt[i].label+'\')" value="'+kindOpt[i].id+'">'+kindOpt[i].label+'</br>';
        }
    }
    applicArray=origArray;
    return str;
}

//判断是否在数组里
function inArray(arr, item) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == item) {
            return true;
        }
    }
    return false;
}
//删除数据
function remove(ind,names){
    for (var i = 0; i < applicArray.length; i++) {
        if (applicArray[i].id == ind) {
            applicArray.splice(i,1);
        }
    }
    var s=document.getElementById(applicUL);
    var t=s.childNodes;
    for (var i=0;i<t.length;i++)
    {
        if (t[i].id==ind)
        {
            s.removeChild(s.childNodes[i]);
        }
    }
}

//返回最终结果
function getEndArray(){
    return 	applicArray;
}

//初始化数据项及下拉框
function  initOrig(origArray,vehicleOptions,ul){

    //下拉框方法
    $("#"+ul).popover({
        trigger: 'click',
        placement: 'bottom', //top, bottom, left or right
        html: 'true',
        content:function(){ return ContentMethod(origArray,vehicleOptions)}
    });

    applicUL=ul;
    if(origArray){
        for(var j=0;j<origArray.length;j++){
            var li = '<li id="'+origArray[j].id+'" class="checkboxli">'+origArray[j].label+'<a onclick="remove('+(origArray[j].id)+',\''+origArray[j].label+'\')">X</a></li>';
            $("#"+ul).append(li);
        }
        applicArray=origArray;
    }

}

function initdiv(ul){
    applicUL=ul;
}


//十进制转二进制
function dec2bin(dec){
    var bin = "";
    while (dec > 0) {
        if (dec%2 != 0) { bin = "1" + bin; }
        else { bin = "0" + bin; }
        dec = parseInt(dec/2);
    }
    return bin;
}
//二进制转10进制
function bin2dec(bin){
    c = bin.split("");
    len = c.length;
    var dec = 0;
    for(i=0; i<len; i++){
        temp = 1;
        if(c[i] == 1){
            for(j=i+1; j<len; j++) temp *= 2;
            dec += temp;
        } else if(c[i] != 0) {
            //false
            return  0;
        }
    }
    return dec;
}



