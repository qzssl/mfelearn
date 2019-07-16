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
        var box = createElem('div',{'class':'box-calendar'})
        //控件头部
        var top = createElem('div',{'class':'calendar-top'})
        //控件中间
        var center = createElem('div',{'class':'calendar-center'})
        //控件底部按钮
        var btns = createElem('div',{'calss':'calendar-btn'})

        $(box).append(top).append(center).append(btns)

        $(box).css({
            'top':(this.elem.offset().top+this.elem.height()+7)+'px',
            'left':this.elem.offset().left+'px',
        })

        $('body').append(box);
        var table = createElem('table',{'id':'calendar-table'})
        $(center).append(table)
        //头部渲染
        topview(opts.cur.year,opts.cur.month,opts.cur.day);
        //中间日期渲染
        centerview(opts.cur.year,opts.cur.month,opts.cur.day);
        // this._event();
    }
    //点击
    Calendar.prototype._event=function () {
        let self =this;
        $(this.elem).click(function () {
            $(".box-calendar").show();
        })
        $(".box-calendar").on('click',function (e) {
            let elem = e.target;
            if (elem.getAttribute('data-ymd')) {
                var ymd=elem.getAttribute('data-ymd').split('-');
                var year=self.opts.cur.year=parseInt(ymd[0]);
                var month=self.opts.cur.month=parseInt(ymd[1]);
                var day=self.opts.cur.day=parseInt(ymd[2]);
                var value=year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day)
                self.elem.val(value);
                $(".box-calendar").hide();
            }else if (elem.getAttribute('data-ym')){

            } else if ($(elem).hasClass('prev-year')){
                self.opts.cur.year=self.opts.cur.year-1;
            }else if ($(elem).hasClass('prev-month')){
                self.opts.cur.month=self.opts.cur.month-1;
                if (self.opts.cur.month<1){
                    self.opts.cur.year=self.opts.cur.year-1;
                    self.opts.cur.month=12;
                }
            }else if ($(elem).hasClass('next-year')){
                self.opts.cur.year=self.opts.cur.year+1;
            }else if ($(elem).hasClass('next-month')){
                self.opts.cur.month=self.opts.cur.month+1;
                if (self.opts.cur.month>12){
                    self.opts.cur.year=self.opts.cur.year+1;
                    self.opts.cur.month=1;
                }
            }
            topview(self.opts.cur.year,self.opts.cur.month,self.opts.cur.day);
            centerview(self.opts.cur.year,self.opts.cur.month,self.opts.cur.day);
        })

    }
    function topview(year,month,day) {
        var h={
            prevyear:function () {
                return '<span class="prev-year">&lt;&lt;</span>';
            }(),
            prevmonth:function () {
                return '<span class="prev-month">&lt;</span>';
            }(),
            yaerandmonth:function () {
                return '<div class="calendar-top-ym" data-ym="'+year+'-'+month+'">'+year+'年'+month+'月</div>';
            }(),
            nextmonth:function () {
                return '<span class="next-month">&gt;</span>';
            }(),
            nextyear:function () {
                return '<span class="next-year">&gt;&gt</span>';
            }(),
        }
        var head = ["prevyear","prevmonth","yaerandmonth","nextmonth","nextyear"];
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
        let _month=parseInt(month)-1;

        //星期几
        var weekDay=tools.firstDayToWeek(year,_month,1);

        //这个月天数
        var dayNums = tools.daysForMonth(year,month);

        //第一行
        var dayDate = '<thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead><tr>';

        //上一月的天数
        if (_month<1){
            var lastDayNums = tools.daysForMonth(year-1,12);
        } else{
            var lastDayNums = tools.daysForMonth(year,_month);
        }

        var active='calendar-green';
        //日期第一行
        for (let i = 0,j=lastDayNums-weekDay+1; i < weekDay; i++,j++) {
            dayDate+='<td class="calendar-gray" data-ymd='+(_month<1?year-1:year)+'-'+(_month<1?12:(month-1))+'-'+j+'>'+j+'</td>';
        }
        for (let i = 0,j=1; i < 7-weekDay; i++,j++) {
            dayDate+='<td class="'+(day==j?active:"")+'" data-ymd='+year+'-'+month+'-'+j+'>'+j+'</td>';
        }
        dayDate += '</tr>';

        //本月最后一天星期
        let lastdayweek=tools.firstDayToWeek(year,_month,dayNums);

        //多少行
        let rows=5-Math.floor((dayNums-(8-weekDay))/7);
        //下一月展现有多少天
        let nextmonthday=rows*7-lastdayweek-1;

        //本月日期
        for (let i=0,j=8-weekDay;i<5;i++) {
            dayDate+='<tr>'
            for (let p=0;p<7;p++,j++){
                if (j>dayNums+1){break;}
                if (j>dayNums){
                    for (let k=1;k<7-lastdayweek;k++){
                        dayDate+='<td class="calendar-gray"  data-ymd='+(month>11?year+1:year)+'-'+(month>11?1:month+1)+'-'+k+'>'+k+'</td>';
                    }
                }else {
                    dayDate+='<td class=\"'+(day==j?'calendar-green':'')+'\"  data-ymd='+year+'-'+month+'-'+j+'>'+j+'</td>';
                }
            }
            dayDate+='</tr>';
        }
        if (month>11){

        }
        //下月日期
        if (rows>1){
            dayDate+='<tr>'
            for (let i=7-lastdayweek;i<=nextmonthday;i++){
                dayDate+='<td class="calendar-gray" data-ymd='+(month>11?year+1:year)+'-'+(month>11?1:month+1)+'-'+i+'>'+i+'</td>';
            }
            dayDate+='</tr>';
        }
        $(".calendar-center").find('#calendar-table').html(dayDate)
    }

    var tools = {
        isLeapYear:function(y){ //判断闰年
            return y%400===0 || ( y%4 === 0 && y%100 !== 0);
        },
        firstDayToWeek:function(y,m,d){
            //判断某年某月的1号是星期几,getDay() 方法可返回表示星期的某一天的数字, 星期天为 0, 星期一为 1,以此类推
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
        })
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
