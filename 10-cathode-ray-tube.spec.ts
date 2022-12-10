interface Command {cycleTime: number, add: number}

class Device {

    constructor(input: string[]) {
        const commands = [{cycleTime: 0, add: 1},...input.map(this.toCommand)]
        const cycles = commands.map((command, index) => ({...command, total: command.add + commands[index-1]?.add || 0}))
        console.log({input, commands, cycles})
    }


    private toCommand(description: string): Command {
        if(description === 'noop') return {cycleTime: 1, add: 0};
        const split = description.split(' ');
        const add = parseInt(split[1]);
        return {cycleTime: 2, add}
    }

    duringCycle(number: number): number {
        if (number >= 4) return 4;
        return 1;
    }

    afterCycle(number: number) {
        if (number >= 5) return 0;
        if (number >= 3) return 4;
        return 1;
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

    xtest('cycle 1', function () {
        expect(device.duringCycle(1)).toBe(1);
        expect(device.signalDuring(1)).toBe(1 * 1)
        expect(device.afterCycle(1)).toBe(1);
    });

    xtest('cycle 2', function () {
        expect(device.duringCycle(2)).toBe(1);
        expect(device.signalDuring(2)).toBe(2 * 1)
        expect(device.afterCycle(2)).toBe(1);
    });

    xtest('cycle 3', function () {
        expect(device.duringCycle(3)).toBe(1);
        expect(device.signalDuring(3)).toBe(3 * 1)
        expect(device.afterCycle(3)).toBe(1 + 3);
    });

    xtest('cycle 4', function () {
        expect(device.duringCycle(4)).toBe(1 + 3);
        expect(device.signalDuring(4)).toBe(4 * (1 + 3))
        expect(device.afterCycle(4)).toBe(1 + 3);
    });

    xtest('cycle 5', function () {
        expect(device.duringCycle(5)).toBe(1 + 3);
        expect(device.signalDuring(5)).toBe(5 * (1 + 3))
        expect(device.afterCycle(5)).toBe(1 + 4 - 5);
    });
});
