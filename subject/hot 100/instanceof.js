function _instanceof(obj, cla) {
	let objProto = Object.getPrototypeOf(obj);
	const claProto = cla.prototype;

	while (true) {
		if (objProto === null) {
			return false;
		}
		if (objProto === claProto) {
			return true;
		}
		objProto = Object.getPrototypeOf(objProto);
	}
}

function Person() {}
var p = new Person();
console.log(_instanceof(Person, Function));
console.log(Person instanceof Function); //false
