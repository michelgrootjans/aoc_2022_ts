import _ from 'lodash/fp'
import {initialState, moves} from "./05-input";

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

    apply(state: string[][], reverse: boolean): string[][] {
        const crates = this.getCrates(reverse, state);


        const newState = [...state];
        newState[this.from] = _.drop(this.numberOfCrates)(state[this.from]);
        newState[this.to] = [...crates, ...newState[this.to]];

        return newState;
    }

    private getCrates(reverse: boolean, state: string[][]) {
        if (reverse) {
            return _.flow(
                _.take(this.numberOfCrates),
                _.reverse,
            )(state[this.from])

        } else {
            return _.flow(
                _.take(this.numberOfCrates),
            )(state[this.from])
        }
    }
}

function blah(state: string[][], [head, ...tail]: Move[], reverse: boolean): string [][] {
    if (head) return blah(head.apply(state, reverse), tail, reverse);
    return state;
}

function apply(state: string[][], moveDescriptions: string[], reverse: boolean): string[][] {
    const moves = moveDescriptions.map(description => new Move(description));
    return blah(state, moves, reverse);
}

describe('moves', () => {
    test('no moves', function () {
        const state = [['A'], []];
        expect(apply(state, [], true)).toMatchObject(state)
    });

    test('[[A], []] => [[], [A]]', function () {
        const state = [['A'], []];
        expect(apply(state, ['move 1 from 1 to 2'], true)).toMatchObject([[], ['A']])
    });


    test('[[], [A]] => [[A], []]', function () {
        const state = [[], ['A']];
        expect(apply(state, ['move 1 from 2 to 1'], true)).toMatchObject([['A'], []])
    });

    test('[[A, B], []] => [[B], [A]]', function () {
        const state = [['A', 'B'], []];
        expect(apply(state, ['move 1 from 1 to 2'], true)).toMatchObject([['B'], ['A']])
    });
})

function top(state: string[][]) {
    return state.map(stack => stack[0] || '')
        .reduce((acc, letter) => acc + letter, '')
}

describe('top', () => {
    test('[[A, B], [C, D]] => AC', function () {
        const state = [['A', 'B'], ['C', 'D']];
        expect(top(state)).toBe('AC')
    });

    test('[[A, B], [C, D], [C, D], [C, D]] => AC', function () {
        const state = [['A', 'B'], ['C', 'D'], ['C', 'D'], ['C', 'D']];
        expect(top(state)).toBe('ACCC')
    });
})

const exampleState = [
    ['N', 'Z'],
    ['D', 'C', 'M'],
    ['P'],
]
const exampleMoves = [
    'move 1 from 2 to 1',
    'move 3 from 1 to 3',
    'move 2 from 2 to 1',
    'move 1 from 1 to 2',
]

test('example - part 1', function () {
    const state = apply(exampleState, exampleMoves, true);
    expect(top(state)).toBe('CMZ')
});

test('part 1 - challenge', function () {
    const state = apply(initialState, moves, true);
    expect(top(state)).toBe('HBTMTBSDC')
});
test('example - part 2', function () {
    const state = apply(exampleState, exampleMoves, false);
    expect(top(state)).toBe('MCD')
});


test('part 2 - challenge', function () {
    const state = apply(initialState, moves, false);
    expect(top(state)).toBe('PQTJRSHWS')
});
