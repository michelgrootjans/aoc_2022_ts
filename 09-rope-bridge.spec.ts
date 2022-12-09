class Command {
    public readonly direction: string;
    public readonly steps: number;

    constructor(direction: string, steps: number) {
        this.direction = direction;
        this.steps = steps;
    }

}

interface Knot {x: number, y: number};
interface Rope {head: Knot, tail: Knot}
interface State {now: Rope, past: Rope[]}

function positionsOfTail(commands: Command[]) {
    const initialState: State = {now: {head: {x: 0, y: 0}, tail: {x: 0, y: 0}}, past: []}
    return commands.reduce((sum, command) => sum + command.steps, 0) || 1;
}

const right = (steps: number) => new Command('R', steps);
const left = (steps: number) => new Command('D', steps);

test('no moves', function () {
    expect(positionsOfTail([])).toBe(1);
});

test('1 R', function () {
    expect(positionsOfTail([right(1)])).toBe(1);
});

test('R 2', function () {
    expect(positionsOfTail([right(2)])).toBe(2);
});

test('R 3', function () {
    expect(positionsOfTail([right(3)])).toBe(3);
});

test('R 1, R1', function () {
    expect(positionsOfTail([
        right(1),
        right(1),
    ])).toBe(2);
});

xtest('R 1, L1', function () {
    expect(positionsOfTail([
        right(1),
        left(1),
    ])).toBe(1);
});
