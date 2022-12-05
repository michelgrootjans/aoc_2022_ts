class Move {
    private column: number;
    private from: number;
    private to: number;

    constructor(description: string) {
        const flatten = description
            .replace(/move /, '')
            .replace(/from /, '')
            .replace(/to /, '')
            .trim()
            .split(' ')
            .map((p: string) => parseInt(p))

        this.column = flatten[0] - 1;
        this.from = flatten[1];
        this.to = flatten[2];
    }

    apply(state: string[][]): string[][] {
        return [[], ['A']];
    }
}

function blah(state: string[][], [head, ...tail]: Move[]): string [][] {
    if(head) return blah(head.apply(state), tail);
    return state;
}

function apply(state: string[][], moveDescriptions: string[]): string[][] {
    const moves = moveDescriptions.map(description => new Move(description));
    return blah(state, moves);
}

test('no moves', function () {
    const state = [['A'], []];
    expect(apply(state, [])).toMatchObject(state)
});

test('one move', function () {
    const state = [['A'], []];
    expect(apply(state, ['move 1 from 1 to 2'])).toMatchObject([[], ['A']])
});
