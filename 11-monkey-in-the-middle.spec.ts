import _ from 'lodash'
import {exampleDescription} from "./11-example";

class Monkey {
    public readonly items: number[];

    constructor(items: number[]) {
        this.items = items;
    }

    move(monkeys: Monkey[]): Monkey[] {
        if (this.items.length === 0) return monkeys;
        const itemToThrow = this.items[0];
        const operation = (item: number) => item * 19;
        const newValue = Math.floor(operation(itemToThrow)/3);
        const receiver = 2;

        return [
            new Monkey(_.tail(this.items)),
            monkeys[1],
            new Monkey([...monkeys[receiver].items, newValue]),
            monkeys[3],
        ];
    }
}

class Monkeys {
    public readonly monkeys: Monkey[];

    constructor(monkeys: Monkey[]) {
        this.monkeys = monkeys;
    }

    move(): Monkeys {
        return new Monkeys(this.monkeys[0].move(this.monkeys));
    }
}

function parseMonkey(monkeyDescription: string): Monkey {
    const items = monkeyDescription.split('\n')[1]
        .split(':')[1]
        .split(',')
        .map(worry => worry.trim())
        .map((text: string): number => parseInt(text));
    return new Monkey(items);
}

const splitMonkeys = (monkeyDescriptions: string) => monkeyDescriptions.split('\n\n');

const parseMonkeys = (monkeyDescriptions: string): Monkeys => new Monkeys(splitMonkeys(monkeyDescriptions).map(parseMonkey));

const exampleMonkeys = parseMonkeys(exampleDescription);

describe('parse', function () {
    test('one monkey', function () {
        const description = "" +
            "Monkey 0:\n" +
            "  Starting items: 79, 98\n" +
            "  Operation: new = old * 19\n" +
            "  Test: divisible by 23\n" +
            "    If true: throw to monkey 2\n" +
            "    If false: throw to monkey 3"
        expect(parseMonkeys(description)).toMatchObject({monkeys: [{items: [79, 98]}]})
    });

    test('two monkeys', function () {
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

describe('move', () => {
    test('example description', function () {
        expect(exampleMonkeys.move()).toMatchObject({
            monkeys: [
                {items: [98]},
                {items: [54, 65, 75, 74]},
                {items: [79, 60, 97, 500]},
                {items: [74]},
            ]
        })
    });
})

describe('turn (all moves of a single monkey)', () => {

})

describe('round (all turns of all monkeys)', () => {

})
