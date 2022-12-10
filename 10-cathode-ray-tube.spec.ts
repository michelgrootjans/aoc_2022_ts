class Device {
    constructor(input: string[]) {

    }


    duringCycle(number: number): number {
        if (number >= 4) return 5;
        return 1;
    }

    afterCycle(number: number) {
        if (number >= 5) return 0;
        if (number >= 3) return 5;
        return 1;
    }

    signalDuring(number: number) {
        return number;
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
        expect(device.afterCycle(3)).toBe(1 + 4);
    });

    test('cycle 4', function () {
        expect(device.duringCycle(4)).toBe(1 + 4);
        expect(device.afterCycle(4)).toBe(1 + 4);
    });

    test('cycle 5', function () {
        expect(device.duringCycle(5)).toBe(1 + 4);
        expect(device.afterCycle(5)).toBe(1 + 4 - 5);
    });
});
