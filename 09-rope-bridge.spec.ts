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

    up() {
        return new Knot(this.x, this.y + 1);
    }

    down() {
        return new Knot(this.x, this.y - 1);
    }

    follow(that: Knot) {
        if (this.isCloseTo(that)) return this;

        let result: Knot = this;
        if(that.x > result.x) result = result.right();
        if(that.x < result.x) result = result.left();
        if(that.y > result.y) result = result.up();;
        if(that.y < result.y) result = result.down();;
        return result;
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
        return this.move(this.head.right());
    }

    left() {
        return this.move(this.head.left());
    }

    up() {
        return this.move(this.head.up());
    }

    down() {
        return this.move(this.head.down());
    }

    private move(head: Knot) {
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

function positionsOfTail(commands: Command[]) {
    const initialState = new State(new Rope(new Knot(0, 0), new Knot(0, 0)));
    const endState = commands.reduce((state, command) => command.move(state), initialState);
    return _.flow(
        _.map('tail'),
        _.uniqWith(_.isEqual),
        _.size,
    )([endState.now, ...endState.history]);
}

const right = (steps: number) => new Command('R', steps);
const left = (steps: number) => new Command('L', steps);

describe('rope', () => {
    const initialRope = () => rope(0, 0, 0, 0);

    function rope(xHead: number, yHead: number, xTail: number, yTail: number) {
        return new Rope(new Knot(xHead, yHead), new Knot(xTail, yTail));
    }

    it('same rope', () => {
        expect(initialRope()).toEqual(rope(0, 0, 0, 0))
    });

    it('right', () => {
        expect(initialRope().right()).toEqual(rope(1, 0, 0, 0))
    });

    it('right, right', () => {
        expect(initialRope().right().right()).toEqual(rope(2, 0, 1, 0))
    });

    it('left', () => {
        expect(initialRope().left()).toEqual(rope(-1, 0, 0, 0))
    });

    it('left, left', () => {
        expect(initialRope().left().left()).toEqual(rope(-2, 0, -1, 0))
    });

    it('right, left', () => {
        expect(initialRope().right().left()).toEqual(rope(0, 0, 0, 0))
        expect(initialRope().left().right()).toEqual(rope(0, 0, 0, 0))
    });

    it('up', () => {
        expect(initialRope().up()).toEqual(rope(0, 1, 0, 0))
    });

    it('up, up', () => {
        expect(initialRope().up().up()).toEqual(rope(0, 2, 0, 1))
    });

    it('down', () => {
        expect(initialRope().down()).toEqual(rope(0, -1, 0, 0))
    });

    it('down, down', () => {
        expect(initialRope().down().down()).toEqual(rope(0, -2, 0, -1))
    });

    it('right, up, up', () => {
        expect(initialRope().right().up().up()).toEqual(rope(1, 2, 1, 1))
    });
});

describe('state', () => {
    test('no moves', function () {
        expect(positionsOfTail([])).toBe(1);
    });

    test.each([
        [[right(1)], 1],
        [[right(2)], 2],
        [[left(1)], 1],
        [[left(2)], 2],
    ])('%p 1 => %d', (commands, expected) => {
        expect(positionsOfTail(commands)).toBe(expected);
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
});
