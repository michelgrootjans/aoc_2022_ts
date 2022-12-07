import {input} from "./07-input";

type Directory = {name: string, size: 0}

function nameOf(currentDirectory: string[]) {
    return currentDirectory.join('/')
}

function sumOfDirectories(terminalOutput: string[]) {
    let currentPath: string[] = []
    let directories: Directory[] = []

    function cd(directoryName: string) {
        currentPath.push(directoryName);
    }

    for (const line of terminalOutput) {
        if (line.startsWith('$ cd')) {
            const directoryName = line.replace('$ cd ', '');
            if (directoryName === '/') {
            } else if (directoryName === '..') {
                currentPath.pop();
            } else {
                cd(directoryName);
                directories.push({name: nameOf(currentPath), size: 0});
            }
            // console.log({line, currentPath})
        }
        else if (line.startsWith('$ ls')) {

        }
        else if (line.startsWith('dir')) {

        } else {
            const size = parseInt((line.split(' '))[0]);
            const currentDirectory = nameOf(currentPath);
            for (const directory of directories) {
                if (currentDirectory.startsWith(directory.name)) {
                    directory.size += size;
                }
            }
        }
    }

    // console.log({directories})
    return directories.map(d => d.size)
        .filter(s => s <= 100*1000)
        .reduce((sum: number, size: number) => sum + size, 0);
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
        '$ cd b',
        '$ ls',
        '1 two.txt',
    ];
    expect(sumOfDirectories(terminalOutput)).toBe(2);
});

test('a/one.txt: 1 + a/b/two.txt: 1', function () {
    const terminalOutput = [
        '$ cd /',
        '$ ls',
        'dir a',
        '$ cd a',
        '$ ls',
        'dir b',
        '1 one.txt',
        '$ cd b',
        '$ ls',
        '1 two.txt',
    ];
    const sizeOfA = 2;
    const sizeOfB = 1;
    expect(sumOfDirectories(terminalOutput)).toBe(sizeOfA + sizeOfB);
});

test('a/one.txt: 1 + b/two.txt: 100.000', function () {
    const terminalOutput = [
        '$ cd /',
        '$ ls',
        'dir a',
        'dir b',
        '$ cd a',
        '$ ls',
        '1 one.txt',
        '$ cd ..',
        '$ cd b',
        '$ ls',
        '100001 two.txt',
    ];
    const sizeOfA = 1;
    expect(sumOfDirectories(terminalOutput)).toBe(sizeOfA);
});

const exampleOutput = [
    '$ cd /',
    '$ ls',
    'dir a',
    '14848514 b.txt',
    '8504156 c.dat',
    'dir d',
    '$ cd a',
    '$ ls',
    'dir e',
    '29116 f',
    '2557 g',
    '62596 h.lst',
    '$ cd e',
    '$ ls',
    '584 i',
    '$ cd ..',
    '$ cd ..',
    '$ cd d',
    '$ ls',
    '4060174 j',
    '8033020 d.log',
    '5626152 d.ext',
    '7214296 k',
];
test('part 1 - example', function () {
    expect(sumOfDirectories(exampleOutput)).toBe(95437);
});

test('part 1 - input', function () {
    expect(sumOfDirectories(input)).toBe(919137);
});
