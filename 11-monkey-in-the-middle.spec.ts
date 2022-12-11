class Monkey {
    public readonly items: number[];

    constructor(items: number[]) {
        this.items = items;
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
function parseMonkeys(monkeyDescriptions: string): Monkey[] {
    return monkeyDescriptions.split('\n\n').map(parseMonkey);
}

const exampleDescription = '' +
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
    "    If false: throw to monkey 0\n" +
    "\n" +
    "Monkey 2:\n" +
    "  Starting items: 79, 60, 97\n" +
    "  Operation: new = old * old\n" +
    "  Test: divisible by 13\n" +
    "    If true: throw to monkey 1\n" +
    "    If false: throw to monkey 3\n" +
    "\n" +
    "Monkey 3:\n" +
    "  Starting items: 74\n" +
    "  Operation: new = old + 3\n" +
    "  Test: divisible by 17\n" +
    "    If true: throw to monkey 0\n" +
    "    If false: throw to monkey 1";

describe('parse', function () {
    it('one monkey', function () {
        const description = "" +
            "Monkey 0:\n" +
            "  Starting items: 79, 98\n" +
            "  Operation: new = old * 19\n" +
            "  Test: divisible by 23\n" +
            "    If true: throw to monkey 2\n" +
            "    If false: throw to monkey 3"
        expect(parseMonkeys(description)).toMatchObject([{items: [79, 98]}])
    });

    it('two monkeys', function () {
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
        expect(parseMonkeys(description)).toMatchObject([
            {items: [79, 98]},
            {items: [54, 65, 75, 74]}
        ])
    });

    it('example description', function () {
        expect(parseMonkeys(exampleDescription)).toMatchObject([
            {items: [79, 98]},
            {items: [54, 65, 75, 74]},
            {items: [79, 60, 97]},
            {items: [74]},
        ])
    });
});


