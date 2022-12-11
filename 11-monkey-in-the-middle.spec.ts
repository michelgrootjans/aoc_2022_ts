import _ from 'lodash/fp'
import {exampleDescription} from "./11-example";
import {input} from "./11-input";

class Monkey {
    public readonly items: number[];
    public readonly inspections: number;
    private readonly operation: (item: number) => number;
    private readonly worryDivider;

    private readonly receiverOf: (value: number) => (number);

    constructor(items: number[], operation: (item: number) => number, receiverOf: (value: number) => number, worryDivider: number = 3, inspections = 0) {
        this.items = items;
        this.operation = operation;
        this.receiverOf = receiverOf;
        this.inspections = inspections;
        this.worryDivider = worryDivider;
    }

    isDone() {
        return this.items.length === 0;
    }

    inspect(monkeys: Monkey[]): Monkey[] {
        if (this.items.length === 0) return monkeys;
        const itemToThrow = this.items[0];
        const newValue = Math.floor(this.operation(itemToThrow) / this.worryDivider);
        const receiver = monkeys[this.receiverOf(newValue)];

        return monkeys.map((monkey) => {
            if (monkey === this) return this.afterThrow();
            if (monkey === receiver) return monkey.receive(newValue);
            return monkey;
        });
    }

    private afterThrow() {
        return new Monkey(_.tail(this.items), this.operation, this.receiverOf, this.worryDivider, this.inspections + 1);
    }

    private receive(newValue: number) {
        return new Monkey([...this.items, newValue], this.operation, this.receiverOf, this.worryDivider, this.inspections);
    }
}

class Monkeys {
    public readonly monkeys: Monkey[];
    private pointer;

    constructor(monkeys: Monkey[], pointer = 0) {
        this.monkeys = monkeys;
        if (monkeys[pointer].isDone()) {
            this.pointer = (pointer + 1) % monkeys.length;
        } else {
            this.pointer = pointer
        }
    }

    inspect(times = 1): Monkeys {
        return _.range(0, times)
            .reduce((m: Monkeys) => new Monkeys(m.currentMonkey().inspect(m.monkeys), m.pointer), this);
    }

    turn(times: number = 1): Monkeys {
        return _.range(0, times)
            .reduce((m: Monkeys) => m.inspect(m.currentMonkey().items.length || 1), this)
    }

    round(times: number = 1) {
        return _.range(0, times).reduce((m: Monkeys) => m.turn(m.monkeys.length), this);
    }

    private currentMonkey() {
        return this.monkeys[this.pointer];
    }

    monkeyBusiness(): number {
        const topInspections = _.flow(
            _.map((m: Monkey) => m.inspections),
            _.orderBy(_.identity, 'desc'),
        )(this.monkeys);

        // @ts-ignore
        return topInspections[0] * topInspections[1];
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
    test('two rounds', () => {
        expect(exampleMonkeys.round(2)).toMatchObject({
            monkeys: [
                {items: [695, 10, 71, 135, 350], inspections: 6},
                {items: [43, 49, 58, 55, 362], inspections: 10},
                {items: [], inspections: 4},
                {items: [], inspections: 10},
            ]
        })
    });
    test('three rounds', () => {
        expect(exampleMonkeys.round(3)).toMatchObject({
            monkeys: [
                {items: [16, 18, 21, 20, 122], inspections: 11},
                {items: [1468, 22, 150, 286, 739], inspections: 15},
                {items: [], inspections: 4},
                {items: [], inspections: 15},
            ]
        })
    });
    test('example 20 rounds', () => {
        const result = exampleMonkeys.round(20);
        expect(result).toMatchObject({
            monkeys: [
                {items: [10, 12, 14, 26, 34], inspections: 101},
                {items: [245, 93, 53, 199, 115], inspections: 95},
                {items: [], inspections: 7},
                {items: [], inspections: 105},
            ]
        });
        expect(result.monkeyBusiness()).toBe(10605);
    });
    test('input 20 rounds', () => {
        expect(parseMonkeys(input).round(20).monkeyBusiness()).toBe(66124);
    });
})
