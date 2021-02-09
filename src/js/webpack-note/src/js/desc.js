

function readonly(target, key, descriptor){
    descriptor.writable = false;
}

class A {
    @readonly COM = 1
}

let a = new A();
a.COM = 2;
console.log('com', a.COM)