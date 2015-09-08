var flatten = require('flat');

var flatObject = function (value) {

	if (typeof value === 'object') {
		var fv = flatten(value);
		Object.keys(fv).forEach((key) => {
			if (typeof fv[key] === 'object') {
				delete fv[key];
			}
		});
		return fv;
	} else {
		var fv = {};
		fv[''] = value;
		return fv;
	}
}

module.exports = flatObject;