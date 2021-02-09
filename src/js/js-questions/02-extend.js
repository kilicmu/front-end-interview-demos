/**
 * this function will extend his father
 * @param {Function} SonFn son function
 * @param {Function} SuperFn parent function
 */
function extend(SonFn, SuperFn) {
  const prototype = Object.create(SuperFn.prototype);
  prototype.constructor = SonFn;
  SonFn.prototype = prototype;
}

module.exports = {
  extend,
};


/**
 * 
 * @param {Function} sonFn 
 * @param {Function} fatherFn 
 */
function extend  (sonFn, fatherFn)  {
  const prototype = Object.create(fatherFn.prototype);
  prototype.constructor = sonFn;
  sonFn.prototype = prototype
}

function son(name, age) {
  this.name = name;
  father.call(this, age);
}

function father(age){
  this.age = age;
}

father.prototype.say = function(){
  console.log('age is ', this.age);
}

extend(son, father);

const s = new son('kok', 12);
s.say();


