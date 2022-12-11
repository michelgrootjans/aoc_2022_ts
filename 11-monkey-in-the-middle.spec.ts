class Monkey {
    public readonly items: number[];

    constructor(items: number[]) {
        this.items = items;
    }
}

function parseMonkeys(description: string): Monkey[] {
    const items = description.split('\n')[1]
        .split(':')[1]
        .split(',')
        .map(worry => worry.trim())
        .map((text: string): number => parseInt(text));
    return [new Monkey(items)];
}

it('should work', function () {
    const description = "Monkey 0:\n" +
    "  Starting items: 79, 98\n" +
    "  Operation: new = old * 19\n" +
    "  Test: divisible by 23\n" +
    "    If true: throw to monkey 2\n" +
    "    If false: throw to monkey 3"
    expect(parseMonkeys(description)).toMatchObject([{items: [79, 98]}])
});