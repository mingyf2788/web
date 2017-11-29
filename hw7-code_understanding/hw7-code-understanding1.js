//////////#2:Goal
Function.prototype.bind = function () {
	//这里与MDN上面的有一点不同的是这里的函数没有传递参数，所以调用函数的对象就自己安了一个
	//不过对于apply函数的args部分还不是很理解
	//既然要使用参数，一遍就够了啊，为什么拆开之后又要重新的给它加回去呢？先看后面的，说不定什么时候就理解了呢
	var fn = this;
	//将参数划分开
	var args = Array.prototype.slice.call(arguments);
	//取出第一个参数
	var object = args.shift();
	return function() {
		//concat函数是字符串的连接函数,将刚刚划分开的参数连接起来，并且和第一个;
		//object是调用函数的对象，fn是函数的模型，根据调用的函数来决定，
		//比如一个外面的函数要调用的话，这里的fn就是外面的那个函数，object就是运用外面的函数的具体的一个对象
		//后面的很长的这一串就是参数
		fn.apply(object, args.concat(Array.prototype.slice.call(arguments)));
	};
};

///IE浏览器不支持bind函数，所以MDN上面的处理方法如下面所示
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}


//////#3 some helper methods that we have
console.assert(true, "I'll pass");
console.assert("truey", "So will I");
console.assert(false, "I'll fail");
console.assert(null, "So will I");
console.log("Just a simple log", "of", "value", 123);
console.error("I'm an error");

//////#5 the ways to define functions
//函数声明式
function isNimle() { return true; }
//函数表达式
var conFly = function() { return true;};
window.isDeadly = function(){ return true; }; 
console.log(isNimle, conFly, isDeadly);
//ƒ isNimle() { return true; } ƒ () { return true;} ƒ (){ return true; }

////////#6 does the order of function definition matter
//函数声明提升
var conFly = function() { return true;};
window.isDeadly = function(){ return true; }; 
console.assert(isNimle() && conFly() && isDeadly(), "still works");
function isNimle() { return true; }

/////#7
//只有函数声明才有声明提升，函数表达式是没有的，所以这里就不能像
//前面一道题目那样了
console.assert(typeof conFly == 'undefined');
console.assert(typeof isDeadly == "undefined");
var conFly = function() { return true;};
window.isDeadly = function(){ return true; };
console.assert(conFly());

//////#8 function can be defined below return statements
function stealthCheck() {
  console.assert(stealth(), "We'll never get below the return, but that's ok!");
  return stealth();
  function stealth() {
    return true;
  }
}
stealthCheck();

//////#10 recurisive?
//函数自己调用自己
function yell(n) {
  return n > 0 ? yell(n - 1) + "a" : "hiy";
}
console.assert(yell(4) == "hiyaaaa", "lalala");

/////#11 what is the name of the function
var ninja = function myNinja() {
  //在函数的内部变量名和函数名是一样的，但是在函数的外面就只有变量名
  //没有函数名了
  console.assert(ninja == myNinja, "this function");
};
ninja();
console.assert(typeof myNinja == 'undefined', "But myNinja isn't defined outside the function");
console.log(ninja);

////////#12
// 为对象ninja设置一个属性yell指向一个匿名函数表达式，并在匿名函数内部递归调用ninja.yell方法
var ninja = {
  yell: function(n) {
    return n > 0 ? ninja.yell(n - 1) + 'a' : 'hiy';
  }
};
console.assert(ninja.yell(4) == 'hiyaaaa', 'A single object is not too bad, either.');

///////#13在这里主要是ninja后来被回收了，在javascript里面所有的赋值语句都只是在传
//递引用，所以当ninja的内存空间被回收之后 ，对象都没有了如何能够使用对象属性呢；
//samurai也就不能够再继续使用了
var ninja = {
  yell: function(n) {
    return n > 0 ? ninja.yell(n - 1) + 'a' : 'hiy';
  }
};
console.assert(ninja.yell(4) == 'hiyaaaa', 'A single object is not too bad.');
var samurai = { yell: ninja.yell};
var ninja = null;
try {
  samurai.yell(4);
} catch(e) {
  //在124行递归的通过对象调用函数，对象被弄没了，所以自然访问不到函数
  console.assert(false, "the ninja has been removed!");
}

///////#14
var ninja = {
  //为对象ninja设置一个属性yell指向一个匿名函数表达式，
  //并在匿名函数内部递归调用yell方法
  yell: function yell(n) {
    return n > 0 ? yell(n - 1) + 'a' : 'hiy';
  }
};
console.assert(ninja.yell(4) == 'hiyaaaa', 'Works as we would expected');
var samurai = { yell: ninja.yell };
//在这里即使将ninja这个对象给删除了，但是因为是对象的yell属性指向一个名为yell的函数
//所以对象搞丢了，但是函数还在，通过别的指向函数的指针还是可以访问到函数的；
var ninja = null;
console.assert(samurai.yell(4) == 'hiyaaaa', 'The method successfully calls itself');

///////#14
var ninja = {
  //为对象ninja设置一个属性yell指向一个匿名函数表达式，
  //并在匿名函数内部递归调用yell方法
  //这里的两个yell实际上没有什么联系，一个是属性的名字一个是函数的名字
  yell: function yell(n) {
    return n > 0 ? yell(n - 1) + 'a' : 'hiy';
  }
};
console.assert(ninja.yell(4) == 'hiyaaaa', 'Works as we would expected');
var samurai = { yell: ninja.yell };
//在这里即使将ninja这个对象给删除了，但是因为是对象的yell属性指向一个名为yell的函数
//所以对象搞丢了，但是函数还在，通过别的指向函数的指针还是可以访问到函数的；
var ninja = null;
console.assert(samurai.yell(4) == 'hiyaaaa', 'The method successfully calls itself');
////////////////////////深入的理解this指针 ，以及递归调用不依赖于对象这一特性
var name="global";
var ninja = { 
  name: 'ninja',
  yell: function yell(n) { 
    console.log("I'm function in " + this.name);
    return n > 0 ? yell(n-1) + "a" : "hiy"; 
  } 
}; 
console.log(ninja.yell(4));
//I'm function in ninja
//I'm function in global
//I'm function in global
//I'm function in global
//I'm function in global
//对于以上的代码的解释是第一次调用yell函数的是ninja对象，所以this指针指向调用
//yell的对象ninja,但是后面的几次对yell的调用是通过递归的方式自己调用自己的
//所以这个时候this无法判定是ninja还是window，JavaScript默认的处理就是将this指向window


//////#15匿名函数在对象内部使用的时候通过arguments.callee来调用本身
var ninja = {
  yell: function(n){
    return n > 0 ? arguments.callee(n-1) + "a" : "hiy";
  }
};
console.assert( ninja.yell(4) == "hiyaaaa", "arguments.callee is the function itself." );

var samurai = { yell: ninja.yell };
var ninja = null;
console.assert(samurai.yell(4) == 'hiyaaaa', 'The method successfully calls itself');


///////#17 how similar are functions and objects
var obj = {};
var fn = function() {};
//只要两者都不为空，那么与运算表示两者都是可以存在的
console.assert(obj && fn, "both the object and function exists");

///////#17 how similar are functions and objects
var obj = {
  prop: "some value"
};
var fn = function() {};
//只要两者都不为空，那么与运算表示两者都是可以存在的
//不知道要怎么把prop的声明与初始化放到函数里面去，就像是上面的对象那样
fn.prop = "some  value";
console.assert(obj.prop && fn.prop, "both the object and function exists");
//与下面的表达方式是等价合法的
var obj = {};
var fn = function() {};
obj.prop = "some value";
fn.prop = "some value";
console.assert(obj.prop && fn.prop, "both the object and function exists");


////////#19
function getElements(name) {
  var result;
  if (getElements.cache[name])
    result = getElements.cache[name];
  else {
    //获取元素的值
    result = document.getElementsByTagName(name);
    //将元素保存在缓存中
    getElements.cache[name] = result;
  }
  return result;
}
getElements.cache = {};
console.log('elemnts is found: ', getElements('div').length);
console.log('cache is found: ', getElements.cache.div.length);
