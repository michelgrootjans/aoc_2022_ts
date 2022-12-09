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
    return commands[0]?.steps || 1;
}

it('no moves', function () {
    expect(positionsOfTail([])).toBe(1);
});

it('one move right', function () {
    expect(positionsOfTail([right(1)])).toBe(1);
});

it('two moves right', function () {
    expect(positionsOfTail([right(2)])).toBe(2);
});

function right(steps: number) {
    return new Command('R', steps);
}
