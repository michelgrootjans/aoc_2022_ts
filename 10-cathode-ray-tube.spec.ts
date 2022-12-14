import _ from 'lodash'
import {example} from "./10-example";
import {input} from "./10-input";

interface Command {
    cycleTime: number,
    add: number
}

class Device {
    private readonly cycles: number[];

    constructor(input: string[]) {
        const commands = input.map(this.toCommand)
        this.cycles = commands.reduce(this.getNumbers, [1])
    }

    private getNumbers(acc: number[], command: Command) {
        const previousValue = _.last(acc) || 0;
        if (command.cycleTime === 1) {
            return [...acc, previousValue]
        }
        return [...acc, previousValue, previousValue + command.add];
    }

    private toCommand(description: string): Command {
        if (description === 'noop') return {cycleTime: 1, add: 0};
        const split = description.split(' ');
        const add = parseInt(split[1]);
        return {cycleTime: 2, add}
    }

    duringCycle(number: number): number {
        return this.cycles[number - 1]
    }

    signalDuring(number: number) {
        return number * this.duringCycle(number);
    }

    pixelAt(cycle: number, x: number) {
        const spriteX = this.duringCycle(cycle);
        const sprite = [spriteX - 1, spriteX, spriteX + 1];
        if (sprite.includes(x)) {
            return '#';
        } else {
            return '.';
        }
    }

    row(rowNumber: number) {
        return _.range(0, 40)
            .map(index => this.pixelAt((rowNumber*40) + index + 1, index))
            .join('');
    }

    screen() {
        let screen = '';
        for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
            screen += this.row(rowIndex) + '\n'
        }
        return screen;
    }
}

describe('simple example ', () => {
    let device: Device;
    beforeEach(() => {
        const input = [
            'noop',
            'addx 3',
            'addx -5',
        ]
        device = new Device(input);
    });

    test('cycle 1', function () {
        expect(device.duringCycle(1)).toBe(1);
        expect(device.signalDuring(1)).toBe(1 * 1)
    });

    test('cycle 2', function () {
        expect(device.duringCycle(2)).toBe(1);
        expect(device.signalDuring(2)).toBe(2 * 1)
    });

    test('cycle 3', function () {
        expect(device.duringCycle(3)).toBe(1);
        expect(device.signalDuring(3)).toBe(3 * 1)
    });

    test('cycle 4', function () {
        expect(device.duringCycle(4)).toBe(1 + 3);
        expect(device.signalDuring(4)).toBe(4 * (1 + 3))
    });

    test('cycle 5', function () {
        expect(device.duringCycle(5)).toBe(1 + 3);
        expect(device.signalDuring(5)).toBe(5 * (1 + 3))
    });
});

describe('example - part 1', () => {
    let device = new Device(example);

    test('cycle 20', function () {
        expect(device.duringCycle(20)).toBe(21);
        expect(device.signalDuring(20)).toBe(20 * 21)
    });

    test('cycle 60', function () {
        expect(device.duringCycle(60)).toBe(19);
        expect(device.signalDuring(60)).toBe(60 * 19)
    });

    test('cycle 100', function () {
        expect(device.duringCycle(100)).toBe(18);
        expect(device.signalDuring(100)).toBe(100 * 18)
    });

    test('cycle 140', function () {
        expect(device.duringCycle(140)).toBe(21);
        expect(device.signalDuring(140)).toBe(140 * 21)
    });

    test('cycle 180', function () {
        expect(device.duringCycle(180)).toBe(16);
        expect(device.signalDuring(180)).toBe(180 * 16)
    });

    test('cycle 220', function () {
        expect(device.duringCycle(220)).toBe(18);
        expect(device.signalDuring(220)).toBe(220 * 18)
    });
});

describe('input - part 1', () => {
    let device = new Device(input);

    test('total of cycles', function () {
        const sum = device.signalDuring(20)
            + device.signalDuring(60)
            + device.signalDuring(100)
            + device.signalDuring(140)
            + device.signalDuring(180)
            + device.signalDuring(220)
        ;
        expect(sum).toBe(15260)
    });
});

function extracted(device: Device) {
    let screen = '';
    for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
        screen += device.row(rowIndex) + '\n'
    }
    return screen;
}

describe('example - part 2', () => {
    let device = new Device(example);

    test('pixel 10', () => {
        expect(device.pixelAt(10, 9)).toBe('#');
    });

    test('row 0', () => {
        expect(device.row(0)).toBe('##..##..##..##..##..##..##..##..##..##..')
    });

    test('row 1', () => {
        expect(device.row(1)).toBe('###...###...###...###...###...###...###.')
    });


    test('whole cycle', function () {
        expect(device.screen()).toEqual('' +
            '##..##..##..##..##..##..##..##..##..##..\n' +
            '###...###...###...###...###...###...###.\n' +
            '####....####....####....####....####....\n' +
            '#####.....#####.....#####.....#####.....\n' +
            '######......######......######......####\n' +
            '#######.......#######.......#######.....\n')
    });
});

describe('input - part 2', () => {
    let device = new Device(input);

    test('total of cycles', function () {
        let screen = '';
        for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
            screen += device.row(rowIndex) + '\n'
        }
        // console.log(screen)
    });
});
