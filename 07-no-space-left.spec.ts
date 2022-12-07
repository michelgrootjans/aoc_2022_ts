import _ from 'lodash/fp'
import {input} from "./07-input";

type Directory = { name: string, totalSize: 0, size: 0 }

function nameOf(currentDirectory: string[]) {
    return currentDirectory.join('/')
}

function parseDirectories(terminalOutput: string[]): Directory[] {
    let currentPath: string[] = []
    let directories: Directory[] = []

    for (const line of terminalOutput) {
        if (line.startsWith('$ cd')) {
            const directoryName = line.replace('$ cd ', '');
            if (directoryName === '..') {
                currentPath.pop();
            } else {
                currentPath.push(directoryName);
                directories.push({name: nameOf(currentPath), totalSize: 0, size: 0});
            }
        } else if (line.startsWith('$ ls')) {

        } else if (line.startsWith('dir')) {

        } else {
            const size = parseInt((line.split(' '))[0]);
            const currentDirectory = nameOf(currentPath);
            for (const directory of directories) {
                if (currentDirectory.startsWith(directory.name)) directory.totalSize += size;
                if (currentDirectory === directory.name) directory.size += size;
            }
        }
    }
    return directories;
}

const sum = (sum: number, size: number) => sum + size;

function sumOfDirectories(terminalOutput: string[]) {
    return parseDirectories(terminalOutput)
        .filter(d => d.name !== '/')
        .map(d => d.totalSize)
        .filter(s => s <= 100 * 1000)
        .reduce(sum, 0);
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

function sizeOfDirectoryToDelete(terminalOutput: string[]) {
    const directories: Directory[] = parseDirectories(terminalOutput);
    const totalDiskSpace = 70000000;
    const spaceNeeded = 30000000;
    const usedSpace = directories.map(d => d.size).reduce(sum, 0);
    const availableSpace = totalDiskSpace - usedSpace;
    const spaceToDelete = spaceNeeded - availableSpace;


    const directoryToDelete = _.flow(
        _.filter((d: Directory) => d.name !== '/'),
        // _.filter((d: Directory) => d.totalSize > spaceToDelete),
        _.sortBy('totalSize'),
        _.reverse,
        _.head
    )(directories)

    // @ts-ignore
    return directoryToDelete?.totalSize || directories[0];
}

test('part 2 - example', function () {
    expect(sizeOfDirectoryToDelete(exampleOutput)).toBe(24933642);
});
