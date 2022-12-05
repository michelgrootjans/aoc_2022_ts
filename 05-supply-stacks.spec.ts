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

    apply(state: string[][]): string[][] {
        const crates = _.flow(
            _.take(this.numberOfCrates),
            _.reverse,
        )(state[this.from])


        const newState = [...state];
        newState[this.from] = _.drop(this.numberOfCrates)(state[this.from]);
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
    return state.map(stack => stack[0] || '')
        .reduce((acc, letter) => acc+letter, '')
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

test('exampld', function () {
    const state = apply(exampleState, exampleMoves);
    expect(top(state)).toBe('CMZ')
});

test('part 1 - challenge', function () {
    const state = apply(initialState, moves);
    expect(top(state)).toBe('HBTMTBSDC')
});
