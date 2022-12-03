import _ from 'lodash/fp'

function commonItem(contents: string) {
    const half = contents.length / 2;
    const [left, right] = _.chunk(half)(contents);
    for (const element of left) {
        if(right.includes(element)) return element;
    }
    throw `no common elements found in rucksack with [${contents}]`;
}

it.each([
    ['a', 'aa'],
    ['p', 'pp'],
    ['p', 'vJrwpWtwJgWrhcsFMMfFFhFp'],
])("'%s' is common in '%s'", (common, contents) => expect(commonItem(contents)).toEqual(common));

function priorityOf(item: string) {
    if(item >= 'a') return 1 + (item.charCodeAt(0) - 'a'.charCodeAt(0));
    return 27 + (item.charCodeAt(0) - 'A'.charCodeAt(0));
}

it.each([
    ['a', 1],
    ['b', 2],
    ['z', 26],
    ['A', 26 + 1],
    ['Z', 26 + 26],
])("'%s' has prioroty %d", (item, priority) => expect(priorityOf(item)).toEqual(priority));
