import _ from 'lodash/fp'

class Move {
    private numberOfCrates: number;
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

        this.numberOfCrates = flatten[0];
        this.from = flatten[1] - 1;
        this.to = flatten[2] - 1;
    }

    apply(state: string[][]): string[][] {
        const crates = _.flow(
            _.take(1),
            _.reverse,
        )(state[this.from])


        const newState = [...state];
        newState[this.from] = _.drop(1)(state[this.from]);
        newState[this.to] = [...crates, ...newState[this.to]];

        return newState;
    }
}

function blah(state: string[][], [head, ...tail]: Move[]): string [][] {
    if (head) return blah(head.apply(state), tail);
    return state;
}

function apply(state: string[][], moveDescriptions: string[]): string[][] {
    const moves = moveDescriptions.map(description => new Move(description));
    return blah(state, moves);
}

describe('moves', () => {
    test('no moves', function () {
        const state = [['A'], []];
        expect(apply(state, [])).toMatchObject(state)
    });

    test('[[A], []] => [[], [A]]', function () {
        const state = [['A'], []];
        expect(apply(state, ['move 1 from 1 to 2'])).toMatchObject([[], ['A']])
    });


    test('[[], [A]] => [[A], []]', function () {
        const state = [[], ['A']];
        expect(apply(state, ['move 1 from 2 to 1'])).toMatchObject([['A'], []])
    });

    test('[[A, B], []] => [[B], [A]]', function () {
        const state = [['A', 'B'], []];
        expect(apply(state, ['move 1 from 1 to 2'])).toMatchObject([['B'], ['A']])
    });
})

function top(state: string[][]) {
    return state[0][0] + state[1][0];
}

describe('top', () => {
    test('[[A, B], [C, D]] => AC', function () {
        const state = [['A', 'B'], ['C', 'D']];
        expect(top(state)).toBe('AC')
    });
})

