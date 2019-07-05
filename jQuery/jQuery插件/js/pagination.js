(function ($,window) {
    var document = window.document;
    //默认参数
    var defaultOpts = {
        current:3,//当前页
        totalPage:5,//总页码
        activeClass:'active',//选中样式
        // pageBtnClass:'pagebtn',//按钮样式
        // prevClass:'prev',//上一页按钮样式
        // nextClass:'next',//下一页按钮样式
        prevText:'上一页',//上一页文字样式
        nextText:'下一页',//下一页文字样式
        // firstClass:'first-page',//首页样式
        // endClass:'end-page',//尾页样式
        firstText:'首页',
        endText:'尾页',
        pageBtnNum:5,//每页展现的按钮数
        coping:false,//是否开启首页尾页（默认不开启）
        backfn:function (page) {},//回调函数
    };

    function Page(obj,opts){
        this.elem = obj;
        this.opts = opts;
        var firstpage = createElem('a',{'class':'first-page'}),
            prevpage = createElem('a',{'class':'prev-page'}),
            nextpage = createElem('a',{'class':'next-page'}),
            endpage = createElem('a',{'class':'end-page'}),
            boxpage = createElem('div',{'class':'box-page'});
        //移除内容
        this.elem.empty();
        //添加元素
        if (this.opts.coping){
            this.elem.append(firstpage).append(prevpage).append(boxpage).append(nextpage).append(endpage);
        }else {
            this.elem.append(prevpage).append(boxpage).append(nextpage);
        }
        //设置HTML内容
        this.setHtml({
            '.first-page':this.opts.firstText,
            '.prev-page':this.opts.prevText,
            '.next-page ':this.opts.nextText,
            '.end-page ':this.opts.endText,
        });
        this.render();
        this.event();
    }

    //设置HTML内容
    Page.prototype.setHtml=function(obj) {
        return $.each(obj,function (elem,value) {
            $(elem).html(value)
        })
    };

    Page.prototype.render = function () {

        let current =this.opts.current;
        if (current<=1){
            current=1;
            $('.prev-page').addClass('disabled');
            $('.next-page').removeClass('disabled');
        }else if (current>=this.opts.totalPage){
            current=this.opts.totalPage;
            $('.next-page').addClass('disabled');
            $('.prev-page').removeClass('disabled');
        }else {
            $('.next-page').removeClass('disabled');
            $('.prev-page').removeClass('disabled');
        }
        //页码
        var pagehtml = '';

        //第一个
        if (current==1) {
            pagehtml+='<a href="javascript:;" class="'+this.opts.activeClass+'" data-pageIndex="1">1</a>'
        }else{
            pagehtml+='<a href="javascript:;" data-pageIndex="1">1</a>'
        }

        var start,end;

        //中间部分
        if (this.opts.totalPage<=this.opts.pageBtnNum){//无省略号
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
        }

        //最后一个
        if (current==this.opts.totalPage){
            pagehtml+='<a href="javascript:;" class="'+this.opts.activeClass+'" data-pageIndex="'+this.opts.totalPage+'">'+this.opts.totalPage+'</a>'
        }else{
            pagehtml+='<a href="javascript:;" data-pageIndex="'+this.opts.totalPage+'">'+this.opts.totalPage+'</a>'
        }
        this.setHtml({'.box-page':pagehtml})
    };

    Page.prototype.setPage=function(current,start,end){
        var str = '';
        for (;start<=end;start++){
            if (current==start){
                str+='<a href="javascript:;" class="'+this.opts.activeClass+'" data-pageIndex="'+start+'">'+start+'</a>'
            }else{
                str+='<a href="javascript:;" data-pageIndex="'+start+'">'+start+'</a>'
            }
        }
        return str;
    }

    Page.prototype.event = function () {
        let self =this;
        this.elem.on('click',function (e) {
            let elem = e.target;
            if ($(elem).hasClass('prev-page')) { //上一页
                if (self.opts.current<1){return}
                self.opts.current-=1;
            }else if ($(elem).hasClass('next-page')) {//下一页
                if (self.opts.current>self.opts.totalPage){return}
                self.opts.current+=1;
            }else if ($(elem).hasClass('first-page')){
                if (self.opts.current<=1){return}
                self.opts.current=1;
            } else if ($(elem).hasClass('end-page')) {
                if (self.opts.current>self.opts.totalPage){return}
                self.opts.current=self.opts.totalPage;
            }else if ($(elem).attr('data-pageindex')!=undefined) {
                self.opts.current=parseInt($(elem).attr('data-pageindex'));
            }
            if (isFunction(self.opts.backfn)) {
                self.opts.backfn(self.opts.current)
            }
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
        console.log()
        return Object.prototype.toString.call(fn).slice(8,-1)==='Function';
    }

    $.fn.Pagination = function (opts) {
        //参数合并
        var options = $.extend({},defaultOpts,opts);
        return new Page(this,options);
    };

})(jQuery,window);
