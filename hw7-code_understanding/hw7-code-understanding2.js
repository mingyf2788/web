//////context
//////#24
function katana(){
  this.isSharp = true;
}
//调用这个函数的是全局对象，所以这里的this指向的是window
katana();
assert( isSharp === true, "A global object now exists with that name and value." );

var shuriken = {
  toss: function(){
    this.isSharp = true;
  }
};
//调用toss函数的是shuriken对象，所以这里的this指向的是Shuriken对象
shuriken.toss();
assert(shuriken.isSharp === true, "When it's an object property, the value is set within the object." );

//////#25 how can we change the context of a function
var object = {};
function fn() {
	return this;
}
console.assert(fn() == this, "this context is the global object");
console.assert(fn.call(object) == object, "the context is changed to a specified object");
//所谓的的改变上下文，其实就是改变调用函数的对象而已，全局对象调用函数的时候上下文是全局的；
//但是使用一个特定的对象调用函数的对象的时候，上下文就是基于这个对象的上下文了


////#26 different ways to change the context
//然而这里的上下文都还是对全局的对象的引用
function add(a, b){
  return a + b;
}
assert( add.call(this, 1, 2) == 3, ".call() takes individual arguments" );
assert( add.apply(this, [1, 2]) == 3, ".apply() takes an array of arguments" );

//////#27
function loop(array, fn){
  for ( var i = 0; i < array.length; i++ ) {
    fn.call(array, array[i], i);
  }
}
var num = 0;
loop([0, 1, 2], function(value){
  console.assert(value == num++, "Make sure the contents are as we expect it.");
  console.assert(this instanceof Array, "The context should be the full array.");
});

/////#35 if we forget to use the new operator
//这里难道是因为会根据作用域链不停的往回走
function User(first, last){
  this.name = first + " " + last;
}
window.name = "Resig";
var user = User("John", name);
//这里虽然在实例化对象的时候失败了，但是函数User()确实是执行了，而且User()的调用者是全局对象
//，所以window的name属性值会被更改
console.assert( name == "John Resig", "The name variable is accidentally overridden." );
//所以实例化对象的时候没有添加new是一件特别可怕的事情，会产生意料之外的结果

/////#36这是一个针对35出现的状况可以使用的一种改进方法，个人觉得这样的改进方法还是蛮机智的
function User(first, last){
  if ( !(this instanceof User) )
    return new User(first, last);
  
  this.name = first + " " + last;
}
var name = "Resig";
var user = User("John", name);
console.assert( user, "This was defined correctly, even if it was by mistake." );
console.log(user.name);
console.assert( name == "Resig", "The right name was maintained." );

//////#38一种更加机智，常用的方法
/////#36这是一个针对35出现的状况可以使用的一种改进方法，个人觉得这样的改进方法还是蛮机智的
function User(first, last){
  if ( !(this instanceof arguments.callee) )
    return new User(first, last);
  
  this.name = first + " " + last;
}
var name = "Resig";
var user = User("John", name);
console.assert( user, "This was defined correctly, even if it was by mistake." );
console.log(user.name);
console.assert( name == "Resig", "The right name was maintained." );

/////#40  参数数量是可变的
function merge(root){
  for ( var i = 0; i < arguments.length; i++ )
    for ( var key in arguments[i] )
      root[key] = arguments[i][key];
  return root;
}
var merged = merge({name: "John"}, {city: "Boston"});
console.assert( merged.name == "John", "The original name is intact." );
console.assert( merged.city == "Boston", "And the city has been copied over." );

/////#50
var num = 10;
function addNum(myNum){
  return num + myNum;
}
num = 15;
assert( addNum(5) == 20, "Add two numbers together, one from a closure." );
//闭包只能访问到父函数中变量的

//////#52 colsure useful for timers
var count = 0;
var timer = setInterval(function(){
  if ( count < 5 ) {
    console.log( "Timer call: ", count );
    count++;
  } else {
    console.assert( count == 5, "Count came via a closure, accessed each step." );
    console.assert( timer, "The timer reference is also via a closure." );
    clearInterval( timer );
  }
}, 100);