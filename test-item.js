function TestItem (value) {
    this.value = value || '';
    this.cost = Number.MAX_SAFE_INTEGER;
}

TestItem.prototype.randomize = function (length) {
    while (length--) {
        this.value += String.fromCharCode(Math.floor(Math.random() * 255));
    }
}

TestItem.prototype.adjust = function () {
    if (Math.random() > .5) return;

    var idx = Math.floor(Math.random() * this.value.length);
    var direction = Math.random() > .5 ? -1 : 1;
    this.value = 
        this.value.substr(0, idx) 
        + String.fromCharCode(this.value.charCodeAt(idx) + direction) 
        + this.value.substr(idx + 1, this.value.length);
}

TestItem.prototype.comingle = function (testItem) {
    var middle = Math.round(this.value.length / 2) - 1;

    return [
        new TestItem(this.value.substr(0, middle) + testItem.value.substr(middle)),
        new TestItem(testItem.value.substr(0, middle) + this.value.substr(middle))
    ];
}

TestItem.prototype.calculateCost = function (testValue) {
    var total = 0;

    for (var i = 0; i < this.value.length; i++) {
        var cost = this.value.charCodeAt(i) - testValue.charCodeAt(i);
        total += cost * cost;
    }

    this.cost = total;
}

module.exports = TestItem;