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
    return 1;
}

it.each([
    ['a', 1],
])("'%s' has prioroty %d", (item, priority) => expect(priorityOf(item)).toEqual(priority));
