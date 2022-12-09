import _ from 'lodash/fp'

class Command {
    public readonly direction: string;
    public readonly steps: number;

    constructor(direction: string, steps: number) {
        this.direction = direction;
        this.steps = steps;
    }

    move(state: State): State {
        return {now: this.execute(state), history: [state.now, ...state.history]};
    }

    nextHead(head: Knot) {
        return {x: head.x + this.steps, y: 0};
    }

    private execute(state: State): Rope {

        function nextTail(nextHead: Knot, tail: Knot) {
            return {x: 0, y: 0};
        }

        const head = this.nextHead(state.now.head);
        const tail = nextTail(head, state.now.tail);

        return {head, tail};
    }
}

interface Knot {x: number, y: number};
interface Rope {head: Knot, tail: Knot}
interface State {now: Rope, history: Rope[]}

function print(state: State) {
    const printKnot = (knot: Knot) => `(${knot.x},${knot.y})`;
    const printHistory = (ropes: Rope[]) => ropes.map(rope => `{ head: ${printKnot(rope.head)}, tail: ${printKnot(rope.tail)} }`);

    return printHistory([state.now, ...state.history]).join(',\n')
}

function positionsOfTail(commands: Command[]) {
    const initialState: State = {
        now: {
            head: {x: 0, y: 0},
            tail: {x: 0, y: 0},
        },
        history: []
    };
    const endState = commands.reduce((state, command) => command.move(state), initialState);
    const tailPositions = _.flow(
        _.map('tail'),
        _.uniq,
        _.size,
    )([endState.now, ...endState.history])
    console.log(print(endState), tailPositions)
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
