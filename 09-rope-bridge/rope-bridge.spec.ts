import _ from 'lodash/fp'
import {input} from "./input";
import {Command} from "./command";
import {Knot} from "./knot";
import {Section} from "./section";
import {State} from "./state";

function positionsOfTail(commands: Command[]) {
    const initialState = new State(new Section(new Knot(0, 0)));
    const endState = commands.reduce((state, command) => command.move(state), initialState);
    return _.flow(
        _.uniqWith(_.isEqual),
        _.size,
    )([endState.now.tail, ...endState.history]);
}

describe('section', () => {
    const initialSection = () => section(0, 0, 0, 0);

    function section(xHead: number, yHead: number, xTail: number, yTail: number) {
        return new Section(new Knot(xHead, yHead), new Knot(xTail, yTail));
    }

    it('same section', () => {
        expect(initialSection()).toEqual(section(0, 0, 0, 0))
    });

    it('right', () => {
        expect(initialSection().right()).toEqual(section(1, 0, 0, 0))
    });

    it('right, right', () => {
        expect(initialSection().right().right()).toEqual(section(2, 0, 1, 0))
    });

    it('left', () => {
        expect(initialSection().left()).toEqual(section(-1, 0, 0, 0))
    });

    it('left, left', () => {
        expect(initialSection().left().left()).toEqual(section(-2, 0, -1, 0))
    });

    it('right, left', () => {
        expect(initialSection().right().left()).toEqual(section(0, 0, 0, 0))
        expect(initialSection().left().right()).toEqual(section(0, 0, 0, 0))
    });

    it('up', () => {
        expect(initialSection().up()).toEqual(section(0, 1, 0, 0))
    });

    it('up, up', () => {
        expect(initialSection().up().up()).toEqual(section(0, 2, 0, 1))
    });

    it('down', () => {
        expect(initialSection().down()).toEqual(section(0, -1, 0, 0))
    });

    it('down, down', () => {
        expect(initialSection().down().down()).toEqual(section(0, -2, 0, -1))
    });

    it('right, up, up', () => {
        expect(initialSection().right().up().up()).toEqual(section(1, 2, 1, 1))
    });
});

describe('section state', () => {
    const right = (steps: number) => new Command('R', steps);
    const left = (steps: number) => new Command('L', steps);
    const up = (steps: number) => new Command('U', steps);
    const down = (steps: number) => new Command('D', steps);

    test('no moves', function () {
        expect(positionsOfTail([])).toBe(1);
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
        expect(positionsOfTail(example.map(toCommand))).toBe(13);
    });

    xtest('input - part 1', () => { // SLOW !
        expect(positionsOfTail(input.map(toCommand))).toBe(6236);
    });
});
