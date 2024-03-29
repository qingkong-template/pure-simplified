//back to top
$(".back2top").hide();$(window).scroll(function(){if($(this).scrollTop()>200){$(".back2top").fadeIn(100)}else{$(".back2top").fadeOut(200)}});$(".back2top").click(function(){$("body,html").animate({scrollTop:0},400);return false});

//重载
function overloaded(){
	//导航菜单
	menu_click("topMenu", "menu_click", "menu_close", true);
	function menu_click(btn, on, off, flag) {
		(btn = document.getElementById(btn)).onclick = function () {
			btn.setAttribute("class", (flag = !flag) ? on : off);
		}
	}
	
    jQuery(document).ready(function(){
        jQuery("a[rel='external'],a[rel='external nofollow'],#commentform a,.single a").click(
            function(){window.open(this.href);return false})
        $(".navigation a,.comment-body a,.page-numbers").addClass("no-ajax");//排除规则
    });
    $('div.navigation').slice(0,1).remove()//删除一个评论分页导航
    
    index_overloaded(); //外部重载
}
overloaded();

//PJAX
var pjax_main = '.pjax' , // 容器
pjax_a = 'a[target!=_blank][rel!=nofollow][class!=no-ajax][date-ajax!=false]' , // 排除规则
pjax_form = '.search form' , // 搜索表单form
pjax_key = '.search_key' ; // 搜索表单input
function reload_func(){
  overloaded();
}
$(function() {    
    a();
});
function body_am(id) { 
    id = isNaN(id) ? $('#' + id).offset().top : id;
    $("body,html").animate({
        scrollTop: id
    }, 0);
    return false;
}
function to_am(url) { 
    var anchor = location.hash.indexOf('#');
    anchor = window.location.hash.substring(anchor + 1);
    body_am(anchor);
}
var home_url = document.location.href.match(/\/\/([^\/]+)\//i)[0]; 
function getFormJson(frm) {
    var o = {};
    var a = $(frm).serializeArray();
    $.each(a,
        function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
        });
    return o;
}
function l(){
    history.replaceState(
    {    url: window.document.location.href,
       title: window.document.title,
        html: $(document).find(pjax_main).html(),
    }, window.document.title, document.location.href);
}
function a(){
    window.addEventListener( 'popstate', function( e ){
        if( e.state ){
            document.title = e.state.title;
            $(pjax_main).html( e.state.html );
            window.load =reload_func();
        }
    });    
}
//AJAX核心
function ajax(reqUrl, msg, method, data) {
    if (msg == 'pagelink' || msg == 'search') { // 页面、搜索
    $("body,html").animate({scrollTop:0}, 500);
    $("html").addClass("load");
    }
    $.ajax({
        url: reqUrl, 
        type: method,
        data: data,
        beforeSend : function () {
            l();
        },
        success: function(data) {
            if (msg == 'pagelink' || msg == 'search') {
                $(pjax_main).html($(data).find(pjax_main).html()) ;
        $("html").removeClass("load");
            }
            document.title = $(data).filter("title").text();
            if (msg != 'comment') {
                var state = {
                    url: reqUrl,
                    title: $(data).filter("title").text(),
                    html: $(data).find(pjax_main).html(),
                };
                window.history.pushState(state, $(data).filter("title").text(), reqUrl);
            }
        },
        complete: function() {
            if (msg == 'pagelink') {
                to_am(reqUrl) ;
            } 
            window.load =reload_func();
        },
        timeout: 10000,
        error: function(request) {
            if (msg == msg == 'pagelink' || msg == 'search'){
                location.href = reqUrl;
            }else {
                location.href = reqUrl;
            }
        },
    });
}