import _ from 'lodash'
import {exampleDescription} from "./11-example";

class Monkey {
    public readonly items: number[];
    public readonly inspections: number;
    private readonly operation: (item: number) => number;
    private readonly reveiverOf: (value: number) => (number);

    constructor(items: number[], operation: (item: number) => number, reveiverOf: (value: number) => number, inspections = 0) {
        this.items = items;
        this.operation = operation;
        this.reveiverOf = reveiverOf;
        this.inspections = inspections;
    }

    isDone() {
        return this.items.length === 0;
    }

    inspect(monkeys: Monkey[]): Monkey[] {
        if (this.items.length === 0) return monkeys;
        const itemToThrow = this.items[0];
        const newValue = Math.floor(this.operation(itemToThrow) / 3);
        const receiver = monkeys[this.reveiverOf(newValue)];

        return monkeys.map((monkey) => {
            if (monkey === this) return this.afterThrow();
            if (monkey === receiver) return monkey.receive(newValue);
            return monkey;
        });
    }

    private afterThrow() {
        return new Monkey(_.tail(this.items), this.operation, this.reveiverOf, this.inspections + 1);
    }

    private receive(newValue: number) {
        return new Monkey([...this.items, newValue], this.operation, this.reveiverOf, this.inspections);
    }
}

class Monkeys {
    public readonly monkeys: Monkey[];
    private pointer;

    constructor(monkeys: Monkey[], pointer = 0) {
        this.monkeys = monkeys;
        if(monkeys[pointer].isDone()) this.pointer = pointer + 1;
        else this.pointer = pointer
    }

    inspect(times = 1): Monkeys {
        return _.range(times)
            .reduce((m: Monkeys) => new Monkeys(m.currentMonkey().inspect(m.monkeys), m.pointer), this);
    }

    turn(times: number = 1): Monkeys {
        return _.range(times)
            .reduce((m: Monkeys) => m.inspect(m.currentMonkey().items.length), this)
    }

    round() {
        const newVar = (m: Monkeys) => m.turn(m.monkeys.length);
        return newVar(this);
    }

    private currentMonkey() {
        return this.monkeys[this.pointer];
    }
}

function parseMonkey(monkeyDescription: string): Monkey {
    const lines = monkeyDescription.split('\n');
    const items = lines[1]
        .split(':')[1]
        .split(',')
        .map(worry => worry.trim())
        .map((text: string): number => parseInt(text));

    const operationDescription = lines[2].split('new = ')[1];
    const operation = (old: number): number => eval(operationDescription);

    const divisibleBy = parseInt(lines[3].split('by ')[1]);
    let ifTrue = parseInt(lines[4].split('monkey ')[1]);
    let ifFalse = parseInt(lines[5].split('monkey ')[1]);
    const reveiverOf = (value: number) => ((value % divisibleBy === 0) ? ifTrue : ifFalse);

    return new Monkey(items, operation, reveiverOf);
}

const splitMonkeys = (monkeyDescriptions: string) => monkeyDescriptions.split('\n\n');

const parseMonkeys = (monkeyDescriptions: string): Monkeys => new Monkeys(splitMonkeys(monkeyDescriptions).map(parseMonkey));

const exampleMonkeys = parseMonkeys(exampleDescription);

describe('parse', () => {
    test('one monkey', () => {
        const description = "" +
            "Monkey 0:\n" +
            "  Starting items: 79, 98\n" +
            "  Operation: new = old * 19\n" +
            "  Test: divisible by 23\n" +
            "    If true: throw to monkey 2\n" +
            "    If false: throw to monkey 3"
        expect(parseMonkeys(description)).toMatchObject({monkeys: [{items: [79, 98]}]})
    });

    test('two monkeys', () => {
        const description = "" +
            "Monkey 0:\n" +
            "  Starting items: 79, 98\n" +
            "  Operation: new = old * 19\n" +
            "  Test: divisible by 23\n" +
            "    If true: throw to monkey 2\n" +
            "    If false: throw to monkey 3\n" +
            "\n" +
            "Monkey 1:\n" +
            "  Starting items: 54, 65, 75, 74\n" +
            "  Operation: new = old + 6\n" +
            "  Test: divisible by 19\n" +
            "    If true: throw to monkey 2\n" +
            "    If false: throw to monkey 0";
        expect(parseMonkeys(description)).toMatchObject({
            monkeys: [
                {items: [79, 98]},
                {items: [54, 65, 75, 74]},
            ]
        })
    });

    test('example description', function () {
        expect(exampleMonkeys).toMatchObject({
            monkeys: [
                {items: [79, 98]},
                {items: [54, 65, 75, 74]},
                {items: [79, 60, 97]},
                {items: [74]},
            ]
        })
    });
});

describe('inspect', () => {
    test('one inspection', () => {
        expect(exampleMonkeys.inspect()).toMatchObject({
            monkeys: [
                {items: [98], inspections: 1},
                {items: [54, 65, 75, 74], inspections: 0},
                {items: [79, 60, 97], inspections: 0},
                {items: [74, 500], inspections: 0},
            ]
        })
    });
    test('two inspections', () => {
        expect(exampleMonkeys.inspect(2)).toMatchObject({
            monkeys: [
                {items: [], inspections: 2},
                {items: [54, 65, 75, 74], inspections: 0},
                {items: [79, 60, 97], inspections: 0},
                {items: [74, 500, 620], inspections: 0},
            ]
        })
    });
    test('three inspections', () => {
        expect(exampleMonkeys.inspect(3)).toMatchObject({
            monkeys: [
                {items: [20], inspections: 2},
                {items: [65, 75, 74], inspections: 1},
                {items: [79, 60, 97], inspections: 0},
                {items: [74, 500, 620], inspections: 0},
            ]
        })
    });
    test('four inspections', () => {
        expect(exampleMonkeys.inspect(4)).toMatchObject({
            monkeys: [
                {items: [20, 23], inspections: 2},
                {items: [75, 74], inspections: 2},
                {items: [79, 60, 97], inspections: 0},
                {items: [74, 500, 620], inspections: 0},
            ]
        })
    });
    test('five inspections', () => {
        expect(exampleMonkeys.inspect(5)).toMatchObject({
            monkeys: [
                {items: [20, 23, 27], inspections: 2},
                {items: [74], inspections: 3},
                {items: [79, 60, 97], inspections: 0},
                {items: [74, 500, 620], inspections: 0},
            ]
        })
    });
    test('six inspections', () => {
        expect(exampleMonkeys.inspect(6)).toMatchObject({
            monkeys: [
                {items: [20, 23, 27, 26], inspections: 2},
                {items: [], inspections: 4},
                {items: [79, 60, 97], inspections: 0},
                {items: [74, 500, 620], inspections: 0},
            ]
        })
    });
})

describe('turn (all inspections of a single monkey)', () => {
    test('one turn', () => {
        expect(exampleMonkeys.turn()).toMatchObject({
            monkeys: [
                {items: [], inspections: 2},
                {items: [54, 65, 75, 74], inspections: 0},
                {items: [79, 60, 97], inspections: 0},
                {items: [74, 500, 620], inspections: 0},
            ]
        })
    });
    test('two turns', () => {
        expect(exampleMonkeys.turn(2)).toMatchObject({
            monkeys: [
                {items: [20, 23, 27, 26], inspections: 2},
                {items: [], inspections: 4},
                {items: [79, 60, 97], inspections: 0},
                {items: [74, 500, 620], inspections: 0},
            ]
        })
    });
    test('three turns', () => {
        expect(exampleMonkeys.turn(3)).toMatchObject({
            monkeys: [
                {items: [20, 23, 27, 26], inspections: 2},
                {items: [2080], inspections: 4},
                {items: [], inspections: 3},
                {items: [74, 500, 620, 1200, 3136], inspections: 0},
            ]
        })
    });
    test('four turns', () => {
        expect(exampleMonkeys.turn(4)).toMatchObject({
            monkeys: [
                {items: [20, 23, 27, 26], inspections: 2},
                {items: [2080, 25, 167, 207, 401, 1046], inspections: 4},
                {items: [], inspections: 3},
                {items: [], inspections: 5},
            ]
        })
    });
})

describe('round (all turns of all monkeys)', () => {
    test('one round', () => {
        expect(exampleMonkeys.round()).toMatchObject({
            monkeys: [
                {items: [20, 23, 27, 26], inspections: 2},
                {items: [2080, 25, 167, 207, 401, 1046], inspections: 4},
                {items: [], inspections: 3},
                {items: [], inspections: 5},
            ]
        })
    });
})
