import _ from 'lodash/fp'

function commonItem(contents: string) {
    const half = contents.length / 2;
    const [left, right] = _.chunk(half)(contents);
    for (const element of left) {
        if(right.includes(element)) return element;
    }
    throw `no common elements found in rucksack with [${contents}]`;
}

it('pp', () => expect(commonItem('pp')).toEqual('p'));
it('aa', () => expect(commonItem('aa')).toEqual('a'));
it('vJrwpWtwJgWrhcsFMMfFFhFp', () => expect(commonItem('vJrwpWtwJgWrhcsFMMfFFhFp')).toEqual('p'));
