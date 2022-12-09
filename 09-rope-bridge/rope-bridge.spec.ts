import _ from 'lodash/fp'
import {input} from "./input";
import {Command} from "./command";
import {Knot} from "./knot";
import {Section} from "./section";
import {State} from "./state";

function positionsOfTail(commands: Command[]) {
    const initialState = new State(Section.build());
    const endState = commands.reduce((state, command) => command.move(state), initialState);
    return _.flow(
        _.uniqWith(_.isEqual),
        _.size,
    )(endState.tailHistory());
}

describe('section', () => {
    const initialSection = () => section(0, 0, 0, 0);

    function section2(xHead: number, yHead: number, xTail: number, yTail: number) {
        return {head: new Knot(xHead, yHead), tail: new Knot(xTail, yTail)};
    }

    function section(xHead: number, yHead: number, xTail: number, yTail: number) {
        return new Section(new Knot(xHead, yHead), new Knot(xTail, yTail));
    }

    it('same section', () => {
        expect(Section.build().ends()).toEqual(section2(0, 0, 0, 0))
    });

    it('right', () => {
        expect(Section.build().right().ends()).toEqual(section2(1, 0, 0, 0))
    });

    it('right, right', () => {
        expect(Section.build().right().right().ends()).toEqual(section2(2, 0, 1, 0))
    });

    it('left', () => {
        expect(Section.build().left().ends()).toEqual(section2(-1, 0, 0, 0))
    });

    it('left, left', () => {
        expect(Section.build().left().left().ends()).toEqual(section2(-2, 0, -1, 0))
    });

    it('right, left', () => {
        expect(Section.build().right().left().ends()).toEqual(section2(0, 0, 0, 0))
        expect(Section.build().left().right().ends()).toEqual(section2(0, 0, 0, 0))
    });

    it('up', () => {
        expect(Section.build().up().ends()).toEqual(section2(0, 1, 0, 0))
    });

    it('up, up', () => {
        expect(Section.build().up().up().ends()).toEqual(section2(0, 2, 0, 1))
    });

    it('down', () => {
        expect(Section.build().down().ends()).toEqual(section2(0, -1, 0, 0))
    });

    it('down, down', () => {
        expect(Section.build().down().down().ends()).toEqual(section2(0, -2, 0, -1))
    });

    it('right, up, up', () => {
        expect(Section.build().right().up().up().ends()).toEqual(section2(1, 2, 1, 1))
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
