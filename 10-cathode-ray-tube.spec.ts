class Device {
    constructor(input: string[]) {

    }


    duringCycle(number: number): number {
        return 1;
    }
}

it('simple example', function () {
    const input = [
        'noop',
        'addx 3',
        'addx -5',
    ]
    expect(new Device(input).duringCycle(1)).toBe(1)
});