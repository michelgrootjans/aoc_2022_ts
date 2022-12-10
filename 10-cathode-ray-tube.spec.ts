import _ from 'lodash'
import {example} from "./10-example";

interface Command {cycleTime: number, add: number}

class Device {
    private readonly cycles: number[];

    constructor(input: string[]) {
        const commands = input.map(this.toCommand)
        this.cycles = commands.reduce(this.getNumbers, [1])
        // console.log({input, commands, cycles: this.cycles})
    }


    private getNumbers(acc: number[], command: Command) {
        const previousValue = _.last(acc) || 0;
        if (command.cycleTime === 1) {
            return [...acc, previousValue]
        }
        return [...acc, previousValue, previousValue+command.add];
    }

    private toCommand(description: string): Command {
        if(description === 'noop') return {cycleTime: 1, add: 0};
        const split = description.split(' ');
        const add = parseInt(split[1]);
        return {cycleTime: 2, add}
    }

    duringCycle(number: number): number {
        return this.cycles[number - 1]
    }

    afterCycle(number: number) {
        return this.cycles[number]
    }

    signalDuring(number: number) {
        return number * this.duringCycle(number);
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
        expect(device.afterCycle(1)).toBe(1);
    });

    test('cycle 2', function () {
        expect(device.duringCycle(2)).toBe(1);
        expect(device.signalDuring(2)).toBe(2 * 1)
        expect(device.afterCycle(2)).toBe(1);
    });

    test('cycle 3', function () {
        expect(device.duringCycle(3)).toBe(1);
        expect(device.signalDuring(3)).toBe(3 * 1)
        expect(device.afterCycle(3)).toBe(1 + 3);
    });

    test('cycle 4', function () {
        expect(device.duringCycle(4)).toBe(1 + 3);
        expect(device.signalDuring(4)).toBe(4 * (1 + 3))
        expect(device.afterCycle(4)).toBe(1 + 3);
    });

    test('cycle 5', function () {
        expect(device.duringCycle(5)).toBe(1 + 3);
        expect(device.signalDuring(5)).toBe(5 * (1 + 3))
        expect(device.afterCycle(5)).toBe(1 + 3 - 5);
    });
});

describe('example', () => {
    let device = new Device(example);

    test('cycle 20', function () {
        expect(device.duringCycle(20)).toBe(21);
        expect(device.signalDuring(20)).toBe(20 * 21)
    });

});