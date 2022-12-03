import _ from 'lodash/fp'
import {input} from "./03-input";

function commonItem(contents: string) {
    const half = contents.length / 2;
    const [left, right] = _.chunk(half)(contents);
    for (const element of left) {
        if (right.includes(element)) return element;
    }
    throw `no common elements found in rucksack with [${contents}]`;
}

it.each([
    ['a', 'aa'],
    ['p', 'pp'],
    ['p', 'vJrwpWtwJgWrhcsFMMfFFhFp'],
])("'%s' is common in '%s'", (common, contents) => expect(commonItem(contents)).toEqual(common));

function priorityOf(item: string) {
    if (item >= 'a') return 1 + (item.charCodeAt(0) - 'a'.charCodeAt(0));
    return 27 + (item.charCodeAt(0) - 'A'.charCodeAt(0));
}

it.each([
    ['a', 1],
    ['b', 2],
    ['z', 26],
    ['A', 26 + 1],
    ['Z', 26 + 26],
])("'%s' has priority %d", (item, priority) => expect(priorityOf(item)).toEqual(priority));

const sumOfPriorities = _.flow(
    _.map(commonItem),
    _.map(priorityOf),
    _.sum,
);

it('example - part 1', () => {
    expect(sumOfPriorities([
        'vJrwpWtwJgWrhcsFMMfFFhFp',
        'jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL',
        'PmmdzqPrVvPwwTWBwg',
        'wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn',
        'ttgJtRGJQctTZtZT',
        'CrZsJsPPZsGzwwsLwLmpwMDw',

    ])).toEqual(16 + 38 + 42 + 22 + 20 + 19);
});

it('input - part 1', () => expect(sumOfPriorities(input)).toEqual(8243));

