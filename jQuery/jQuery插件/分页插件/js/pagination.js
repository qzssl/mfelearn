(function ($,window) {
    var document = window.document;
    //默认参数
    var defaultOpts = {
        current: 1,//当前页
        count: 10,//总页码,总数据
        limit: 5,//每页显示条数
        activeClass: 'active',//选中样式
        // pageBtnClass:'pagebtn',//按钮样式
        // prevClass:'prev',//上一页按钮样式
        // nextClass:'next',//下一页按钮样式
        prevText: '上一页',//上一页文字样式
        nextText: '下一页',//下一页文字样式
        // firstClass:'first-page',//首页样式
        // endClass:'end-page',//尾页样式
        firstText: '首页',
        endText: '尾页',
        pageBtnNum: 5,//每页展现的按钮数
        coping: false,//是否开启首页尾页（默认不开启）
        backfn: function (page) {
        },//回调函数
    };

    function Page(obj, opts) {
        this.elem = obj;
        this.opts = opts;
        var boxpage = createElem('div', {'class': 'box-page'});
        //移除内容
        this.elem.empty();
        //添加元素
        this.elem.append(boxpage);
        this.render();
        this.event();
    }

    //设置HTML内容
    Page.prototype.setHtml = function (obj) {
        return $.each(obj, function (elem, value) {
            $(elem).html(value)
        })
    };

    Page.prototype.render = function () {
        var current = this.opts.current||1, // 总页数
            count = this.opts.count,//总数据
            pagebtnnum = this.opts.pageBtnNum,//显示按钮数
            consbtn=pagebtnnum-2;//连续按钮
            limit = this.opts.limit||10,
            pages = Math.ceil(count / limit) || 1;//每页显示数据

        if (current>pages){//当前页大于总页码，设置当前页等于总页码
            this.opts.current=current=pages;
        }
        if (consbtn<0){
            consbtn=1;
        }else if (consbtn>pages){
            consbtn=pages;
        }

        //页码
        var pagehtml = '',r = "disabled";
        var options=this.opts;
        var  view = {
            firstpage:function(){
                return '<a href="javascript:;" class="first-page' + " " +(1 == current ? " " + r : "")+'" data-page=1>' + options.firstText + "</a>";
            }(),
            prev: function () {
                return options.prevText ? '<a href="javascript:;" class="prev-page' + (1 == current ? " " + r : "") + '" data-page="' + (current - 1) + '">' + options.prevText + "</a>" : ""
            }(),
            page: function () {
                var e = [];
                if (count < 1) return "";
                //左有省略，第一个按钮
                current==1?
                    e.push('<span class="page-active">1</span>')
                :e.push('<a href="javascript:;" data-page="1"  title="&#x9996;&#x9875;">1</a>');
                var s = pages>pagebtnnum?2:1;

                if (consbtn<current&&s>1) {
                    e.push('<span class="layui-laypage-spr">&#x2026;</span>')
                }
                var i = current-Math.ceil(consbtn/2)+1;
                var k=pages>pagebtnnum?
                    (current<consbtn+1?2:(pages-current>=consbtn
                        ?i :pages-consbtn))
                    :2;
                var n=pages>pagebtnnum?
                    (current<consbtn+1?consbtn+1:(pages-current>=consbtn?i+consbtn-1:pages-1))
                    :pages-1;
                console.log("开始：",k,n);
                for (;k<=n;k++){
                    k === current ? e.push('<span class="page-active">' + k + '</em></span>')
                        : e.push('<a href="javascript:;" data-page="' + k + '">' + k + "</a>");

                }
                if (s>1&&pages-n>1) {
                    e.push('<span class="layui-laypage-spr">&#x2026;</span>');
                }
                //最后一个按钮
                return pages>1?pages==current?e.push('<span class="page-active">' + pages + '</em></span>')
                    : e.push('<a href="javascript:;" title="&#x5C3E;&#x9875;"  data-page="' + pages + '">' + pages+ "</a>"):"",
                    e.join("")
            }(),
            next: function () {
                return options.nextText ? '<a href="javascript:;" class="next-page' + (current == pages ? " " + r : "") + '" data-page="' + (current + 1) + '">' + options.nextText + "</a>" : ""
            }(),
            endpage:function () {
                return '<a href="javascript:;" class="first-page' + " " +(current == pages ? " " + r : "")+ '" data-page=' + pages + '>' + options.endText + '</a>';
            }(),
        };
        var nav =options.coping? ["firstpage","prev", "page", "next","endpage"]: ["prev", "page", "next"];
        pagehtml+=[
            function () {
                var e = [];
                return $.each(nav, function (a, t) {
                    view[t] && e.push(view[t])
                }),
                    e.join("")
            }()].join("")


        /*if (this.opts.totalPage<=this.opts.pageBtnNum){//无省略号
            start=2;end=this.opts.totalPage-1;
            pagehtml+=this.setPage(current,start,end)
        }else if (this.opts.pageBtnNum<this.opts.totalPage&&this.opts.totalPage<=this.opts.pageBtnNum+1){//只有一个省略号
            if (current<this.opts.pageBtnNum){
                start=2;end=this.opts.totalPage-2;
                pagehtml+=this.setPage(current,start,end);
                pagehtml+='<span>...</span>';
            } else{
                start=3;end=this.opts.totalPage-1;
                pagehtml+='<span>...</span>';
                pagehtml+=this.setPage(current,start,end);
            }
        }else{//两边会出现省略号
            if (current<this.opts.pageBtnNum-1){//右侧有省略
                start=2;
                end=this.opts.pageBtnNum-1;
                pagehtml+=this.setPage(current,start,end);
                pagehtml+='<span>...</span>';
            }else if (this.opts.pageBtnNum-1<=current&&current<=this.opts.totalPage-this.opts.pageBtnNum+2) {//两边都有
                let btn = this.opts.pageBtnNum-2;
                pagehtml+='<span>...</span>';
                start=current-Math.ceil((this.opts.pageBtnNum-2)/2)+1;
                end=start+btn-1;
                pagehtml+=this.setPage(current,start,end);
                pagehtml+='<span>...</span>';
            }else{ //左侧有
                pagehtml+='<span>...</span>';
                start=this.opts.totalPage-this.opts.pageBtnNum+2;
                end=this.opts.totalPage-1;
                pagehtml+=this.setPage(current,start,end);
            }
        }*/

        this.setHtml({'.box-page': pagehtml});
        //回调函数
        if (isFunction(this.opts.backfn)) {
            let a={
                current: this.opts.current,
                limit: this.opts.limit
            };
            this.opts.backfn(a)
        }
    };


    Page.prototype.setPage=function(current,start,end){
        var str = '';
        for (var i=start;i<=end;i++){
            if (current==i){
                str+='<a href="javascript:;" class="'+this.opts.activeClass+'" data-pageIndex="'+i+'">'+i+'</a>'
            }else{
                str+='<a href="javascript:;" data-pageIndex="'+i+'">'+i+'</a>'
            }
        }
        return str;
    };

    Page.prototype.event = function () {
        let self =this;
        this.elem.on('click',function (e) {
            let elem = e.target;
            var index = 0 | parseInt($(elem).attr("data-page"));
            if (index<2&&self.opts.current==1||index>=pages&&self.opts.current==pages){return}
            self.opts.current=index;
            self.render();
        })
    };

    //创建元素
    function createElem(elemName,attr){
        var elem = document.createElement(elemName);
        $.each(attr||{},function (key,value) {
            elem.setAttribute(key,value);
        });
        return elem;
    }

    //判断是否是函数
    function isFunction(fn) {
        return Object.prototype.toString.call(fn).slice(8,-1)==='Function';
    }

    $.fn.Pagination = function (opts) {
        //参数合并
        var options = $.extend({},defaultOpts,opts);
        return new Page(this,options);
    };

})(jQuery,window);
