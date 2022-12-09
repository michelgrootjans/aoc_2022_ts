class Command {
    constructor(direction: string, steps: number) {

    }

}

function positionsOfTail(commands: Command[]) {
    return 1;
}

it('no moves', function () {
    expect(positionsOfTail([])).toBe(1);
});

it('one move right', function () {
    expect(positionsOfTail([right(1)])).toBe(1);
});

function right(steps: number) {
    return new Command('R', steps);
}
