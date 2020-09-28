function instanceOf(impl, Type) {
  let proto = impl.__proto__;
  const prototype = Type.prototype;

  while (proto) {
    if (proto === prototype) return true;
    proto = proto.__proto__;
  }

  return false;
}

console.log(instanceOf({}, Array));
