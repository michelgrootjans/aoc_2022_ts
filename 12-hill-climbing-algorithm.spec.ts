function climb(map: string) {
    return 26;
}

it('a straight line', () => {
    expect(climb('SbcdefghijklmnopqrstuvwxyE')).toBe(26)
});

it('example - part 1', () => {
    const input = '' +
        'Sabqponm\n' +
        'abcryxxl\n' +
        'accszExk\n' +
        'acctuvwj\n' +
        'abdefghi'
    expect(climb(input)).toBe(31)
});