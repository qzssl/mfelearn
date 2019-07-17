;(function($) {
    //当前时间
    var currentDate=new Date();
    var currentDateList={
        year:currentDate.getFullYear(),
        month:currentDate.getMonth()+1,
        day:currentDate.getDate()
    };
    //默认参数
    var defultopts={
        cur:currentDateList,
    };

    function Calendar(obj,opts){
        this.elem= $(obj);
        this.opts=opts;
        this.zIndex=0;//控件 0-日期  1-月份 2-年份
        this._init();
        // this.render();
        // this._event();
    }
    //初始准备
    Calendar.prototype._init=function(){
        var that=this,
            options=this.opts;
        //判断元素存不存在
        if (!that.elem[0])return;
        this.render();
        this.events();

    };
    Calendar.prototype.render=function(){
        var opts = this.opts;
        //创建元素
        var box = createElem('div',{
            'class':'box-calendar',
            'style':'top:'+(this.elem.offset().top+this.elem.height()+7)+'px'+'; '+'left:'+this.elem.offset().left+'px',
        });
        //控件头部
        var top = createElem('div',{'class':'calendar-top'});
        //控件中间
        var center = createElem('div',{'class':'calendar-center'});
        var table = createElem('table',{'id':'calendar-table'});
        //控件底部按钮
        var btns = createElem('div',{'calss':'calendar-btn'});
        $(center).append(table);
        $(box).append(top).append(center).append(btns);
        $('body').append(box);

        var arr=["prevyear","prevmonth","yaerandmonth","nextmonth","nextyear"];
        //头部渲染
        this.topView();
        // topview(opts.cur.year,opts.cur.month,arr);
        //中间日期渲染
        // centerview(opts.cur.year,opts.cur.month,opts.cur.day);
        this.mainView();
    };
    Calendar.prototype.topView=function(pYear,nYear){
        var self = this,
            opts=self.opts,
            year=opts.cur.year,
            month=opts.cur.month;
        var h={
            prevYear:function () {
                return '<span class="prev-year" '+(self.zIndex==2?'data-yy='+(pYear-1):'')+'>&lt;&lt;</span>';
            }(),
            prevMonth:function () {
                return self.zIndex?"":'<span class="prev-month">&lt;</span>';
            }(),
            ym:function () {
                return self.zIndex==2?'<div class="calendar-top-ym"><span class="scope-ym">'+pYear+'年-'+nYear+'年</span></div>'
                        :'<div class="calendar-top-ym"><span data-y="'+year+'">'+year+'年</span><span data-m="'+month+'">'+month+'月</span></div>'
            }(),
            nextMonth:function () {
                return self.zIndex?'':'<span class="next-month">&gt;</span>';
            }(),
            nextYear:function () {
                return '<span class="next-year" '+(self.zIndex==2?'data-yy='+(nYear+1):'')+'>&gt;&gt;</span>';
            }(),
        };
        var hstr="";
        $.each(h,function (k,v) {
            hstr+=v;
        });
        $(".calendar-top").html(hstr)
    };
    Calendar.prototype.mainView=function(pYear,nYear){
        var self=this,
            opts=self.opts,
            year=opts.cur.year,
            month=opts.cur.month,
            day=opts.cur.day,
            _month=parseInt(month)-1,
            weekDay=tools.firstDayToWeek(year,_month,1),//星期几
            dayNums = tools.daysForMonth(year,month),//本月天数
            view = '',
            dayView='<thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>',
            ymView='',
            lastmtoy={year:_month<1?year-1:year, month:_month<1?12:_month},
            lastDayNums=tools.daysForMonth(lastmtoy.year,lastmtoy.month),//上一月的天数
            active='calendar-green';

        if (self.zIndex==0){
            //日期
            for (let i=0,n=1;i<6;i++){//行
                dayView+='<tr>';
                for (let j=0,q=1,m=lastDayNums-weekDay+1;j<7;j++){//列
                    if (i==0){
                        if (j<weekDay){//上一月日期
                            dayView+='<td class="calendar-gray" data-ymd='+lastmtoy.year+'-'+lastmtoy.month+'-'+m+'>'+m+'</td>';
                            m++;
                        } else{//本月日期
                            dayView+='<td class="'+(day==n?active:"")+'" data-ymd='+year+'-'+month+'-'+n+'>'+n+'</td>';
                            n++;
                        }
                    } else {
                        if (n>dayNums){//下一月日期
                            dayView+='<td class="calendar-gray"  data-ymd='+(month>11?year+1:year)+'-'+(month>11?1:month+1)+'-'+q+'>'+q+'</td>';
                            q++;
                        } else {//本月日期
                            dayView+='<td class=\"'+(day==n?'calendar-green':'')+'\"  data-ymd='+year+'-'+month+'-'+n+'>'+n+'</td>';
                            n++;
                        }
                    }
                }
                dayView+='</tr>';
            }
            view+=dayView;
        }else {
            var rows=nYear&&pYear?4:3,
                columns=nYear&&pYear?3:4,
                cells=nYear&&pYear?pYear:1,
                minCell=pYear&&nYear?nYear:12;
            for (let i=0,q=cells;i<rows,q<=minCell;i++){
                view+='<tr>';
                for (let j=0;j<columns;j++){
                    view+='<td class="'+(self.zIndex==1?'calendar-month':'calendar-year')+" "+(year==q||month==q?"calendar-green":"")+'"' +
                        'data-ym="'+q+'">'+q+(self.zIndex==1?'月':'年')+'</td>';
                    q++;
                }
                view+='</tr>';
            }
        }
        $('#calendar-table').html(view)
    };
    Calendar.prototype.events=function(){
        var self=this;
        $(".box-calendar").on('click',function(e){
            var elem = e.target;
            if (elem.getAttribute('data-ymd')) {//日期
                var ymd=elem.getAttribute('data-ymd').split('-'),
                    year=parseInt(ymd[0]),
                    month=parseInt(ymd[1]),
                    day=parseInt(ymd[2]),
                    value=year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day);
                self.opts.cur={
                    year:year,
                    month:month,
                    day:day
                };
                self.opts.zIndex=0;
                self.elem.val(value);
                // $(".box-calendar").hide();
            }
            if ($(elem).hasClass('prev-year')){//上一年
                if (self.zIndex==2){
                    var yy=parseInt($(elem).attr('data-yy'));
                    pYear=yy-11; nYear=yy;
                }else {
                    self.opts.cur.year-=1;
                }
            }
            if ($(elem).hasClass('prev-month')){//点击日期上一月
                self.opts.cur.month-=1;
                if (self.opts.cur.month<1){
                    self.opts.cur.year-=1;
                    self.opts.cur.month=12;
                }
            }
            if ($(elem).hasClass('next-month')){//下一月
                self.opts.cur.month+=1;
                if (self.opts.cur.month>12){
                    self.opts.cur.year+=1;
                    self.opts.cur.month=1;
                }
            }

            if ($(elem).hasClass('next-year')){//点击日期下一年
                if (self.zIndex==2){
                    var yy=parseInt($(elem).attr('data-yy'));
                    pYear=yy; nYear=yy+11;
                }else {
                    self.opts.cur.year+=1;
                }
            }
            var pYear,nYear;
            //点击头部年份
            if($(elem).attr('data-y')){
                var y=parseInt($(elem).attr('data-y'));
                    self.opts.cur.year=y;
                    pYear=y-5;
                    nYear=y+6;
                self.zIndex=2;
            }
            if ($(elem).hasClass('scope-ym')){
                return;
            }
            //头部月份
            if ($(elem).attr('data-m')){
                self.zIndex=1;
            }
            //点击年份中年份、月份中月份
            if ($(elem).attr('data-ym')) {
                if (self.zIndex==2){
                    var yy=parseInt($(elem).attr('data-ym'));
                    self.opts.cur.year=yy;
                    self.zIndex=1;
                } else if (self.zIndex==1){
                    var ym=$(elem).attr('data-ym');
                    self.opts.cur.month=ym;
                    self.zIndex=0;
                }
            }
            self.topView(pYear,nYear);
            self.mainView(pYear,nYear);
        })
    };
   
    var tools = {
        isLeapYear:function(y){ //判断闰年
            return y%400===0 || ( y%4 === 0 && y%100 !== 0);
        },
        firstDayToWeek:function(y,m,d){
            //判断某年某月的n号是星期几,getDay() 方法可返回表示星期的某一天的数字, 星期天为 0, 星期一为 1,以此类推
            return new Date(y,m,d).getDay();
        },
        daysForMonth:function(year,month){    //返回某年某月的天数
            var _month=month;
            return _month===2?(this.isLeapYear(year)?29:28)
                :(_month%2===1&&_month<=7 || _month%2===0&&_month>=8?31:30);
        },

    };

    function createElem(elemname,attr){
        var elem = document.createElement(elemname);
        $.each(attr||{},function (k,v) {
            elem.setAttribute(k,v);
        });
        return elem;
    }

    $.fn.extend({
        Calendar:function (opts) {
           //合并参数
            var o=$.extend({},defultopts,opts);
            return new Calendar(this,o);
        }
    })
})(jQuery);
