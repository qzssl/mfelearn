(function ($,window) {
    var document = window.document;
    //默认参数
    var defaultOpts = {
        current: 1,//当前页
        count: 10,//总页码,总数据
        limit: 5,//每页显示条数
        activeClass: 'active',//选中样式
        prevText: '上一页',//上一页文字样式
        nextText: '下一页',//下一页文字样式
        // firstClass:'first-page',//首页样式
        // endClass:'end-page',//尾页样式
        firstText: '首页',
        endText: '尾页',
        pageBtnNum: 5,//每页展现的按钮数
        coping: false,//是否开启首页尾页（默认不开启）
        backfn: function (page) {},//回调函数
    };

    function Page(obj, opts) {
        this.elem = obj;
        this.opts = opts;
        //移除内容
        this.elem.empty();
        //添加元素
        this.elem.append('<div class="box-page"></div>');
        this.render();
        this.event();
    }

    Page.prototype.render = function () {
        var opts = this.opts;
        var current = opts.current||1, // 总页数
            count = opts.count,//总数据
            pagebtnnum = opts.pageBtnNum,//显示按钮数
            consbtn=pagebtnnum-2;//连续按钮
            limit = opts.limit||10,
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
        var firsttext=opts.firstText,
            endtext=opts.endText,
            pretext=opts.prevText,
            nexttext=opts.nextText,
            coping=opts.coping;

        var  view = {
            firstpage:function(){
                return '<a href="javascript:;" class="first-page' + " " +(1 == current ? " " + r : "")+'" data-page=1>' + firsttext + "</a>";
            }(),
            prev: function () {
                return '<a href="javascript:;" class="prev-page'+(1 == current?" "+r:"")+'" data-page="'+(current - 1)+'">' + pretext + "</a>"
            }(),
            page: function () {
                var e = [];
                if (count < 1) return "";
                //第一个按钮
                current==1?
                    e.push('<span class="page-active">1</span>')
                    :e.push('<a href="javascript:;" data-page="1">1</a>');

                if (consbtn<current&&pages>pagebtnnum) {
                    e.push('<span class="layui-laypage-spr">&#x2026;</span>')
                }
                var start = current-Math.ceil(consbtn/2)+1;//连续按钮开始位置
                var end = start+consbtn-1;//连续按钮结束位置
                var k=pages>pagebtnnum?
                    (current<consbtn+1?2:(pages-current>=consbtn
                        ?start:pages-consbtn))
                    :2;
                var n=pages>pagebtnnum?
                    (current<consbtn+1?consbtn+1:(pages-current>=consbtn?end:pages-1))
                    :pages-1;
                console.log("开始：",k,n);
                for (;k<=n;k++){
                    k === current ? e.push('<span class="page-active">' + k + '</em></span>')
                        : e.push('<a href="javascript:;" data-page="' + k + '">' + k + "</a>");

                }
                if (pages>pagebtnnum&&pages-n>1) {
                    e.push('<span class="layui-laypage-spr">&#x2026;</span>');
                }
                //最后一个按钮
                return pages>1?pages==current?e.push('<span class="page-active">' + pages + '</em></span>')
                    : e.push('<a href="javascript:;" title="&#x5C3E;&#x9875;"  data-page="' + pages + '">' + pages+ "</a>"):"",
                    e.join("")
            }(),
            next: function () {
                return '<a href="javascript:;" class="next-page'+(current == pages ? " " + r : "")+'" data-page="'+(current + 1)+'">'+nexttext+"</a>"
            }(),
            endpage:function () {
                return '<a href="javascript:;" class="first-page' + " " +(current == pages ? " " + r : "")+'" data-page='+pages+'>'+endtext+'</a>';
            }(),
        };
        var nav =coping? ["firstpage","prev", "page", "next","endpage"]: ["prev", "page", "next"];
        pagehtml+=[
            function () {
                var e = [];
                return $.each(nav, function (a, t) {
                    view[t] && e.push(view[t])
                }),
                    e.join("")
            }()].join("")

        this.setHtml({'.box-page': pagehtml});
        //回调函数
        if (isFunction(opts.backfn)) {
            let a={
                current: opts.current,
                limit: opts.limit
            };
            this.opts.backfn(a)
        }
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

    //设置HTML内容
    Page.prototype.setHtml = function (obj) {
        return $.each(obj, function (elem, value) {
            $(elem).html(value)
        })
    };

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
