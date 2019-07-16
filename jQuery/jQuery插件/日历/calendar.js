;(function($) {

    //当前时间
    var currentDate=new Date();
    var currentDateList={
        year:currentDate.getFullYear(),
        month:currentDate.getMonth()+1,
        day:currentDate.getDate()
    }

    //默认参数
    var defultopts={
        cur:currentDateList,
    };


    function Calendar(obj,opts){
        this.elem= $(obj);
        this.opts=opts;
        this.render();
        this._event();
    }

    Calendar.prototype.render=function(){
        var self =this;
        var opts = this.opts;
        //创建元素
        var box = createElem('div',{'class':'box-calendar'});
        //控件头部
        var top = createElem('div',{'class':'calendar-top'});
        //控件中间
        var center = createElem('div',{'class':'calendar-center'});
        //控件底部按钮
        var btns = createElem('div',{'calss':'calendar-btn'});

        $(box).append(top).append(center).append(btns);

        $(box).css({
            'top':(this.elem.offset().top+this.elem.height()+7)+'px',
            'left':this.elem.offset().left+'px',
        });

        $('body').append(box);
        var table = createElem('table',{'id':'calendar-table'});
        $(center).append(table);
        var arr=["prevyear","prevmonth","yaerandmonth","nextmonth","nextyear"];
        //头部渲染
        topview(opts.cur.year,opts.cur.month,arr);
        //中间日期渲染
        centerview(opts.cur.year,opts.cur.month,opts.cur.day);
        // this._event();
    }
    //点击
    Calendar.prototype._event=function () {
        let self =this;
        var ymarr=["prevyear","prevmonth","yaerandmonth","nextmonth","nextyear"];
        var yarr=["prevscopeyear","scopeym","nextscopeyear"];
        $(this.elem).click(function () {
            $(".box-calendar").show();
        });
        $(".box-calendar").on('click',function (e) {
            var elem = e.target;
            var _year=self.opts.cur.year,_month=self.opts.cur.month,_day=self.opts.cur.day;
            if (elem.getAttribute('data-ymd')) {//日期
                var ymd=elem.getAttribute('data-ymd').split('-'),
                    year=self.opts.cur.year=parseInt(ymd[0]),
                    month=self.opts.cur.month=parseInt(ymd[1]),
                    day=self.opts.cur.day=parseInt(ymd[2]),
                    value=year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day);
                self.elem.val(value);
                $(".box-calendar").hide();
                topview(year,month,ymarr);
                centerview(year,month,day);
            }else if (elem.getAttribute('data-y')){//点击头部年份
                var pyear=_year-4,nyear=_year+4;
                topview(_year,_month,yarr,pyear,nyear);
                centeryview(_year,pyear,nyear);
            } else if ($(elem).hasClass('prev-year')){//点击日期上一年
                _year=self.opts.cur.year=_year-1;
                topview(_year,_month,ymarr);
                centerview(_year,_month,_day);
            }else if ($(elem).hasClass('prev-month')){//点击日期上一月
                _month=self.opts.cur.month=_month-1;
                if (_month<1){
                    _year=self.opts.cur.year=_year-1;
                    _month=self.opts.cur.month=12;
                }
                topview(_year,_month,ymarr);
                centerview(_year,_month,_day);
            }else if ($(elem).hasClass('next-year')){//点击日期下一年
                _year=self.opts.cur.year=_year+1;
                topview(_year,_month,ymarr);
                centerview(_year,_month,_day);
            }else if ($(elem).hasClass('next-month')){//点击日期下一月
                _month=self.opts.cur.month=_month+1;
                if (_month>12){
                    _year=self.opts.cur.year=_year+1;
                    _month=self.opts.cur.month=1;
                }
                topview(_year,_month,ymarr);
                centerview(_year,_month,_day);
            }else if($(elem).hasClass('next-scope-year')){//点击年份下一年
                var yy=parseInt($(elem).attr('data-yy'));
                topview(_year,_month,yarr,yy,yy+8);
                centeryview(_year,yy,yy+8);
            }else if ($(elem).hasClass('prev-scope-year')) {//点击年份上一年
                var yyp=parseInt($(elem).attr('data-yy'));
                topview(_year,_month,yarr,yyp-8,yyp);
                centeryview(_year,yyp-8,yyp);
            }else if($(elem).attr('data-ytom')){////点击年份中年份
                var ytom=parseInt($(elem).attr('data-ytom'));
                _year=self.opts.cur.year=ytom;
                topview(_year,_month,["prevyearfm","yaerandmonth","nextyearfm"]);
                centermview(_month);
            }else if($(elem).attr('data-m')){//头部月份
                topview(_year,_month,["prevyearfm","yaerandmonth","nextyearfm"]);
                centermview(_month);
            }else if ($(elem).hasClass('prevyearfm')) {//点击月份上一年
                _year=self.opts.cur.year=_year-1;
                topview(_year,_month,["prevyearfm","yaerandmonth","nextyearfm"]);
                centermview(_month);
            }else if ($(elem).hasClass('nextyearfm')) {//点击月份下一年
                _year=self.opts.cur.year=_year+1;
                topview(_year,_month,["prevyearfm","yaerandmonth","nextyearfm"]);
                centermview(_month);
            }else if ($(elem).attr('data-mtod')){//点击月份中月份
                var mtod=parseInt($(elem).attr('data-mtod'));
                _month=self.opts.cur.month=mtod;
                topview(_year,_month,ymarr);
                centerview(_year,_month,_day);
            }
        })
    };
    function topview(year,month,harr,pyear,nyear) {

        var h={
            prevscopeyear:function(){
                return '<span class="prev-scope-year" data-yy="'+(pyear-1)+'">&lt;&lt;</span>';
            }(),
            prevyearfm:function(){
                return '<span class="prevyearfm">&lt;&lt;</span>';
            }(),
            prevyear:function () {
                return '<span class="prev-year">&lt;&lt;</span>';
            }(),
            prevmonth:function () {
                return '<span class="prev-month">&lt;</span>';
            }(),
            scopeym:function(){
                return '<span class="scope-ym" data-yy="'+pyear+'-'+nyear+'">'+pyear+'年'+'-'+nyear+'年</span>';
            }(),
            yaerandmonth:function () {
                return '<div class="calendar-top-ym"><span data-y="'+year+'">'+year+'年</span><span data-m="'+month+'">'+month+'月</span></div>';
            }(),
            nextmonth:function () {
                return '<span class="next-month">&gt;</span>';
            }(),
            nextyearfm:function () {
                return '<span class="nextyearfm">&gt;&gt;</span>';
            }(),
            nextyear:function () {
                return '<span class="next-year">&gt;&gt;</span>';
            }(),
            nextscopeyear:function(){
                return '<span class="next-scope-year" data-yy="'+(nyear+1)+'">&gt;&gt;</span>';
            }(),
        };
        var head = harr.slice(0);
        var hstr="";
        hstr+=[
            function () {
                var e = [];
                return $.each(head,function (k,v) {
                    h[v]&&e.push(h[v])
                }) ,e.join("")
            }()].join("");
        $(".calendar-top").html(hstr)
    }
    function centerview(year,month,day) {
        //2020 1, 20
        //计算本月
        var _month=parseInt(month)-1,
            weekDay=tools.firstDayToWeek(year,_month,1),//星期几
            dayNums = tools.daysForMonth(year,month),//本月天数
            dayDate = '<thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>',
            lastmtoy={year:_month<1?year-1:year, month:_month<1?12:_month},
            lastDayNums=tools.daysForMonth(lastmtoy.year,lastmtoy.month),//上一月的天数
            active='calendar-green';

        //日期
        for (let i=0,n=1;i<6;i++){//行
            dayDate+='<tr>';
            for (let j=0,q=1,m=lastDayNums-weekDay+1;j<7;j++){//列
                if (i==0){
                    if (j<weekDay){//上一月日期
                        dayDate+='<td class="calendar-gray" data-ymd='+lastmtoy.year+'-'+lastmtoy.month+'-'+m+'>'+m+'</td>';
                        m++;
                    } else{//本月日期
                        dayDate+='<td class="'+(day==n?active:"")+'" data-ymd='+year+'-'+month+'-'+n+'>'+n+'</td>';
                        n++;
                    }
                } else {
                    if (n>dayNums){//下一月日期
                        dayDate+='<td class="calendar-gray"  data-ymd='+(month>11?year+1:year)+'-'+(month>11?1:month+1)+'-'+q+'>'+q+'</td>';
                        q++;
                    } else {//本月日期
                        dayDate+='<td class=\"'+(day==n?'calendar-green':'')+'\"  data-ymd='+year+'-'+month+'-'+n+'>'+n+'</td>';
                        n++;
                    }
                }
            }
            dayDate+='</tr>';
        }
        $(".calendar-center").find('#calendar-table').html(dayDate)
    }
    function centeryview(cury,p,n) {
        var str="";
        for (var i=0,q=p;i<4,q<=n;i++){
            str+='<tr>';
            for (var j=0;j<3;j++){
                str+='<td class="calendar-year'+" "+(cury==q?"calendar-green":"")+'" data-ytom="'+q+'">'+q+'年</td>';
                q++;
            }
            str+='</tr>';
        }
        $('#calendar-table').html(str);
    }

    function centermview(month) {
        var str="";
        for (var i=0,q=1;i<3;i++){
            str+='<tr>';
            for (var j=0;j<4;j++){
                str+='<td class="calendar-month'+" "+(month==q?"calendar-green":"")+'" data-mtod="'+q+'">'+q+'月</td>';
                q++;
            }
            str+='</tr>';
        }
        $('#calendar-table').html(str);
    }

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
})(jQuery)
