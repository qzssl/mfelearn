// 图片预加载
(function($) {
  function PreLoad(imgs, options) {
    this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
    this.opts = $.extend({}, PreLoad.DEFAULTS, options);
    
    //判断有序加载还是无序加载
    if(this.opts.order === 'ordered'){
    	//有序加载
    	this._ordered();
    }else{
    	//无序加载
    this._unoredered();    	
    }
  }
  //设置PreLoad函数默认参数options
  PreLoad.DEFAULTS = {
  	order:'unorder',//默认无序预加载
    each: null,// 每一张图片加载完毕后执行
    all: null // 所有图片加载完毕后执行
  };
  
  PreLoad.prototype._ordered = function(){
  	var imgs = this.imgs,
        opts = this.opts,
        count = 0,
        len = imgs.length;
    
    load();
			//有序预加载
		function load(){
			var imgObj = new Image();
			$(imgObj).on('load erroe',function(){
				opts.each && opts.each(count);
				if(count>=len){
					//所有图片已经加载完毕
					opts.all&&opts.all();
				}else{
					load();
				}
				count++;
			});
			imgObj.src=imgs[count];
		}
  },
  
  // 无序加载方法
  PreLoad.prototype._unoredered = function() {
    var imgs = this.imgs,
        opts = this.opts,
        count = 0,
        len = imgs.length;
    // 遍历图片数组
    $.each(imgs, function(i, src) {
      if(typeof src != 'string')return;
      var imgObj = new Image();
      // 每张图片加载的时候执行的代码
      $(imgObj).on('load error', function() {
      	/*$progress.html(Math.round((count + 1) / len * 100) + '%'); 因为这个不能写死，所以在这里写，需写在each中*/
        opts.each && opts.each(count);//接受count参数
        
        if(count >= len - 1) {
        	/*$('.loading').hide();因为这个不能写死，所以在这里写，需写在all中*/
          opts.all && opts.all();
        }
        count++;
      });
      imgObj.src = src;
    });
  }
  // 两种插件的不同调用方式
  // 1、$.fn.extend ==> $('#img').preload()//需要选择元素
  // 2、$.extend ==> $.preload()
  $.extend({
  	//调用插件名preload
    preload: function(imgs, opts) {
      new PreLoad(imgs, opts);
    }
  });
})(jQuery)