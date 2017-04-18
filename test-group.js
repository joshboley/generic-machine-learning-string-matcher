var TestItem = require('./test-item');

function TestGroup (target) {
    this.target = target;
    this.iteration = 0;
    this.items = [];

    for (var i = 0; i < 20; i++) { 
        var item = new TestItem()
        item.randomize(this.target.length);
        this.items.push(item);
    }
}

TestGroup.prototype.display = function (result) {
    console.log('Iteration: ' + this.iteration);
    this.items.map(val => console.log(val.value + '(' + val.cost + ')'));
    console.log('SUCCESS!', result);
}

TestGroup.prototype.sort = function () {
    this.items.sort((a, b) => {
        return a.cost - b.cost;
    });
}

TestGroup.prototype.iterate = function () {
    for (var i = 0, j = this.items.length; i < j; i++) {
        this.items[i].adjust();
        this.items[i].calculateCost(this.target);

        if (this.items[i].value === this.target) {
            var result = this.items[i].value;
            // this.display(result);
            return result;
        }
    }

    this.sort();
    // this.display();
    var replacements = this.items[0].comingle(this.items[1]);
    this.items.splice(this.items.length - 2, 2, replacements[0], replacements[1]);

    this.iteration++;
    return false;
}

TestGroup.prototype.learn = function () {
    var result = false;

    while(!result) {
        result = this.iterate();
    }

    return result;
}

module.exports = TestGroup;