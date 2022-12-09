import _ from 'lodash/fp'
import {input} from "./09-input";
import {Command, Knot, Rope, State} from "./09-rope-bridge";

function positionsOfTail(commands: Command[], numberOfKnots: number) {
    const initialState = State.build(numberOfKnots);
    const endState = commands.reduce((state, command) => command.move(state), initialState);
    return _.flow(
        _.uniqWith(_.isEqual),
        _.size,
    )(endState.tailHistory());
}

describe('rope - 2', () => {
    const rope = Rope.build(2);

    it('same rope', () => {
        expect(rope).toMatchObject({knots: [new Knot(0, 0), new Knot(0, 0)]})
    });

    it('right', () => {
        expect(rope.right()).toMatchObject({knots: [new Knot(1, 0), new Knot(0, 0)]})
    });

    it('right, right', () => {
        expect(rope.right().right()).toMatchObject({knots: [new Knot(2, 0), new Knot(1, 0)]})
    });

    it('left', () => {
        expect(rope.left()).toMatchObject({knots: [new Knot(-1, 0), new Knot(0, 0)]})
    });

    it('left, left', () => {
        expect(rope.left().left()).toMatchObject({knots: [new Knot(-2, 0), new Knot(-1, 0)]})
    });

    it('right, left', () => {
        expect(rope.right().left()).toMatchObject({knots: [new Knot(0, 0), new Knot(0, 0)]})
        expect(rope.left().right()).toMatchObject({knots: [new Knot(0, 0), new Knot(0, 0)]})
    });

    it('up', () => {
        expect(rope.up()).toMatchObject({knots: [new Knot(0, 1), new Knot(0, 0)]})
    });

    it('up, up', () => {
        expect(rope.up().up()).toMatchObject({knots: [new Knot(0, 2), new Knot(0, 1)]})
    });

    it('down', () => {
        expect(rope.down()).toMatchObject({knots: [new Knot(0, -1), new Knot(0, 0)]})
    });

    it('down, down', () => {
        expect(rope.down().down()).toMatchObject({knots: [new Knot(0, -2), new Knot(0, -1)]})
    });

    it('right, up, up', () => {
        expect(rope.right().up().up()).toMatchObject({knots: [new Knot(1, 2), new Knot(1, 1)]})
    });
});

describe('rope - 3', () => {
    const rope = Rope.build(3);

    it('right', () => {
        expect(rope.right()).toMatchObject({knots: [
                new Knot(1, 0),
                new Knot(0, 0),
                new Knot(0, 0),
            ]})
    });

    it('right, right', () => {
        expect(rope.right().right()).toMatchObject({knots: [
                new Knot(2, 0),
                new Knot(1, 0),
                new Knot(0, 0),
            ]})
    });

    it('right, right, right', () => {
        expect(rope.right().right().right()).toMatchObject({knots: [
                new Knot(3, 0),
                new Knot(2, 0),
                new Knot(1, 0),
            ]})
    });
});

describe('rope state', () => {
    const right = (steps: number) => new Command('R', steps);
    const left = (steps: number) => new Command('L', steps);
    const up = (steps: number) => new Command('U', steps);
    const down = (steps: number) => new Command('D', steps);

    test('no moves', function () {
        expect(positionsOfTail([], 2)).toBe(1);
    });

    test.each([
        [[right(1)], 1],
        [[right(2)], 2],
        [[left(1)], 1],
        [[left(2)], 2],
        [[up(1)], 1],
        [[up(2)], 2],
        [[down(1)], 1],
        [[down(2)], 2],
    ])('%p 1 => %d', (commands, expected) => {
        expect(positionsOfTail(commands, 2)).toBe(expected);
    });

    test('R 1, R1', function () {
        expect(positionsOfTail([
            right(1),
            right(1),
        ], 2)).toBe(2);
    });

    test('R 1, L1', function () {
        expect(positionsOfTail([
            right(1),
            left(1),
        ], 2)).toBe(1);
    });

    // @ts-ignore
    const toCommand = command => new Command(command[0] as string, command[1] as number);
    const example = [
        ['R', 4],
        ['U', 4],
        ['L', 3],
        ['D', 1],
        ['R', 4],
        ['D', 1],
        ['L', 5],
        ['R', 2],
    ]

    test('example - part 1', () => {
        expect(positionsOfTail(example.map(toCommand), 2)).toBe(13);
    });

    xtest('input - part 1', () => { // SLOW !
        expect(positionsOfTail(input.map(toCommand), 2)).toBe(6236);
    });

    it('example 1 - part 2', () => {
        expect(positionsOfTail(example.map(toCommand), 10)).toBe(1);
    });
});
