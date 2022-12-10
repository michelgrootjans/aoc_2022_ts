class Device {
    constructor(input: string[]) {

    }


    duringCycle(number: number): number {
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

    it('cycle 1', function () {
        expect(device.duringCycle(1)).toBe(1)
    });
});
