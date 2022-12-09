import _ from 'lodash/fp'

class Command {
    public readonly direction: string;
    public readonly steps: number;

    private readonly operation: (rope: Rope) => Rope;

    movements = {
        'R': (rope: Rope) => rope.right(),
        'L': (rope: Rope) => rope.left(),
    }

    constructor(direction: string, steps: number) {
        this.direction = direction;
        this.steps = steps;

        function createOperation(direction: string) {
            switch (direction) {
                case 'R':return (rope: Rope) => rope.right();
                case 'L':return (rope: Rope) => rope.left();
                default: throw `unknown direction: ${direction}`
            }
        }

        this.operation = createOperation(this.direction);
    }

    move(state: State): State {
        if (this.steps === 0) return state;
        // @ts-ignore
        const rope = this.movements[this.direction](state.now);
        return new Command(this.direction, this.steps - 1)
            .move(state.next(rope))
    }
}

class Knot {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    right() {
        return new Knot(this.x + 1, this.y);
    }

    left() {
        return new Knot(this.x - 1, this.y);
    }

    follow(that: Knot) {
        if(this.isCloseTo(that)) return this;
        return this.right();
    }

    private isCloseTo(that: Knot): boolean {
        return Math.abs(this.x - that.x) <= 1 && Math.abs(this.y - that.y) <= 1;
    }
}

class Rope {
    public readonly head: Knot;
    public readonly tail: Knot;


    constructor(head: Knot, tail: Knot) {
        this.head = head;
        this.tail = tail;
    }

    right() {
        const head = this.head.right();
        return new Rope(head, this.tail.follow(head));
    }

    left() {
        const head = this.head.left();
        return new Rope(head, this.tail.follow(head));
    }
}

class State {
    public readonly now: Rope;
    public readonly history: Rope[]

    constructor(now: Rope, history: Rope[] = []) {
        this.now = now;
        this.history = history;
    }

    next(rope: Rope) {
        return new State(rope, [this.now, ...this.history]);
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
const left = (steps: number) => new Command('L', steps);

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

test('R 1, L1', function () {
    expect(positionsOfTail([
        right(1),
        left(1),
    ])).toBe(1);
});
