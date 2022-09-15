interface String {
	formatTabs(): string;
}

String.prototype.formatTabs = function () {
	return this.replace(/\t/g, '')
}
