import _ from 'lodash/fp'

class Command {
    public readonly direction: string;
    public readonly steps: number;

    constructor(direction: string, steps: number) {
        this.direction = direction;
        this.steps = steps;
    }

}

function positionsOfTail(commands: Command[]) {
    return _.flow(
        _.map('steps'),
        _.sum
    )(commands) || 1;
}

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

function right(steps: number) {
    return new Command('R', steps);
}
