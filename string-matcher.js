module.exports = function (context, cb) {

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

    var testGroup = new TestGroup(context.data.value || "Specify a value querystring param to match a different value!!");
    cb(null, testGroup.learn());
}