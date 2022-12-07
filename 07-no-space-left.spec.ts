import _ from 'lodash/fp';

function sumOfDirectories(terminalOutput: string[]) {
    return terminalOutput.reduce((sum: number, line: string) => {
        if(line.startsWith('$')) return sum;
        if(line.startsWith('dir')) return sum;
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
    expect(sumOfDirectories(terminalOutput)).toBe(1);
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
    expect(sumOfDirectories(terminalOutput)).toBe(2);
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
    expect(sumOfDirectories(terminalOutput)).toBe(2);
});

test('a/one.txt: 1 + b/two.txt: 1', function () {
    const terminalOutput = [
        '$ cd /',
        '$ ls',
        'dir a',
        'dir b',
        '$ cd a',
        '$ ls',
        '1 one.txt',
        '$ cd ..',
        '$ cd a',
        '$ ls',
        '1 two.txt',
    ];
    expect(sumOfDirectories(terminalOutput)).toBe(2);
});

