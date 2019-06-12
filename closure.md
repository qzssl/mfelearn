# 闭包

------

闭包：当一个内部函数被其外部函数之外的变量引用时，就形成了一个闭包
```
function A(){
    console.log('hello')
    function B(){
       console.log("Hello Closure!");
    }
    return B;
}
var c = A(); // 输出hello
console.log(c); // 输出ƒ B(){console.log("Hello Closure!");}
c();// 输出 Hello Closure!
```
>(1)定义了一个普通函数A
>(2)在A中定义了普通函数B
>(3)在A中返回B（确切的讲，在A中返回B的引用）
>(4)执行A(),把A的返回结果赋值给变量 c
>(5)执行 c() 

### 闭包的作用
> 如果一个对象不再被引用，那么这个对象就会被GC回收，否则这个对象一直会保存在内存中。在上述例子中，B定义在A中，因此B依赖于A,而外部变量 c 又引用了B, 所以A间接的被引用，也就是说，A不会被GC回收，会一直保存在内存中。

------
```
(function(document){
    var viewport;
    var obj = {
        init:function(id){
           viewport = document.querySelector("#"+id);
        },
        addChild:function(child){
            viewport.appendChild(child);
        },
        removeChild:function(child){
            viewport.removeChild(child);
        }
    }
    window.jView = obj;
})(document);
```
>obj 是在匿名函数中定义的一个对象，这个对象中定义了一系列方法， 执行window.jView = obj 就是在 window 全局对象定义了一个变量 jView，并将这个变量指向 obj 对象，即全局变量 jView 引用了 obj . 而 obj 对象中的函数又引用了匿名函数中的变量 viewport ,因此匿名函数中的 viewport 不会被GC回收，会一直保存到内存中，所以这种写法满足闭包的条件。
