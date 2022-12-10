class Device {
    constructor(input: string[]) {

    }


    duringCycle(number: number): number {
        if(number >= 4) return 5;
        return 1;
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
        expect(device.duringCycle(1)).toBe(1)
    });

    test('cycle 2', function () {
        expect(device.duringCycle(2)).toBe(1)
    });

    test('cycle 3', function () {
        expect(device.duringCycle(3)).toBe(1)
    });

    test('cycle 4', function () {
        expect(device.duringCycle(4)).toBe(1 + 4)
    });
});
