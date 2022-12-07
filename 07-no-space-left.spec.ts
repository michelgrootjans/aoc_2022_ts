import _ from 'lodash/fp';

function sumOfDirectoriesAtMost(terminalOutput: string[]) {
    let sum = 0;

    return terminalOutput.reduce((sum: number, line: string) => {
        if(line.startsWith('$')) return 0;
        if(line.startsWith('dir')) return 0;
        line.split(' ');
        return sum + parseInt(line[0])
    }, 0);
}

test('a/one.txt: 1', function () {
    const terminalOutput = [
        '$ cd /',
        '$ ls',
        'dir a',
        '$ cd a',
        '$ ls',
        '1 one.txt',
    ];
    expect(sumOfDirectoriesAtMost(terminalOutput)).toBe(1);
});

test('a/one.txt: 1 + a/two.txt: 1', function () {
    const terminalOutput = [
        '$ cd /',
        '$ ls',
        'dir a',
        '$ cd a',
        '$ ls',
        '1 one.txt',
        '1 two.txt',
    ];
    expect(sumOfDirectoriesAtMost(terminalOutput)).toBe(2);
});

test('a/one.txt: 2', function () {
    const terminalOutput = [
        '$ cd /',
        '$ ls',
        'dir a',
        '$ cd a',
        '$ ls',
        '2 one.txt',
    ];
    expect(sumOfDirectoriesAtMost(terminalOutput)).toBe(2);
});
