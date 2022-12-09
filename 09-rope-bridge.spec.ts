import _ from 'lodash/fp'

class Command {
    public readonly direction: string;
    public readonly steps: number;

    constructor(direction: string, steps: number) {
        this.direction = direction;
        this.steps = steps;
    }

    move(state: State): State {
        const history = [state.now, ...state.history];
        const now = this.execute(state.now);
        console.log({now, history})
        return {now, history};
    }
    private execute(rope: Rope): Rope {
        let {head, tail} = rope;

        for (let i = 0; i < this.steps; i++) {
            head = head.right();
            tail = this.moveTail(head, tail);
        }

        return {head, tail};
    }

    private moveTail(head: Knot, tail: Knot): Knot {
        if(head.isCloseTo(tail)) return tail;
        return tail.right();
    }
}

class Knot {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    isCloseTo(that: Knot): boolean {
        return Math.abs(this.x - that.x) <= 1 && Math.abs(this.y - that.y) <= 1;

    }

    right() {
        return new Knot(this.x + 1, this.y);
    }
}

class Rope {
    public readonly head: Knot;
    public readonly tail: Knot;


    constructor(head: Knot, tail: Knot) {
        this.head = head;
        this.tail = tail;
    }
}

class State {
    public readonly now: Rope;
    public readonly history: Rope[]

    constructor(now: Rope, history: Rope[] = []) {
        this.now = now;
        this.history = history;
    }
}

function print(state: State) {
    const printKnot = (knot: Knot) => `(${knot.x},${knot.y})`;
    const printHistory = (ropes: Rope[]) => ropes.map(rope => `{ head: ${printKnot(rope.head)}, tail: ${printKnot(rope.tail)} }`);

    return printHistory([state.now, ...state.history]).join(',\n')
}

function positionsOfTail(commands: Command[]) {
    const initialState = new State(new Rope(new Knot(0, 0), new Knot(0, 0)));
    const endState = commands.reduce((state, command) => command.move(state), initialState);
    const tailPositions = _.flow(
        _.map('tail'),
        _.uniqWith(_.isEqual),
        _.size,
    )([endState.now, ...endState.history])
    console.log(print(endState), tailPositions)
    return tailPositions;
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

xtest('R 3', function () {
    expect(positionsOfTail([right(3)])).toBe(3);
});

xtest('R 1, R1', function () {
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
