function orderedIndexes(param: any[]): number[] {
    return [];
}

function sumOfOrderedIndexes(param: any[]): number[] {
    return [];
}

xdescribe('part 1', () => {
    test('[1] vs [2]', () => {
        expect(orderedIndexes([[[1],[2]]])).toEqual([1]);
        expect(sumOfOrderedIndexes([[[1],[2]]])).toEqual(1);
    });

    test('[1] vs [1, 1]', () => {
        expect(orderedIndexes([[[1],[1,1]]])).toEqual([1]);
        expect(sumOfOrderedIndexes([[[1],[1,1]]])).toEqual(1);
    });

    test('[1, 1] vs [1]', () => {
        expect(orderedIndexes([[[1,1],[1]]])).toEqual([]);
    });

    test('[2] vs [1]', () => {
        expect(orderedIndexes([[[2],[1]]])).toEqual([]);
    });

    const example = [
        [[1,1,3,1,1],[1,1,5,1,1]],// 0: NOT ordered
        [[[1],[2,3,4]],[[1],4]],// 1: ordered
        [[9],[[8,7,6]]],// 2: ordered
        [[[4,4],4,4],[[4,4],4,4,4]],// 3: NOT ordered
        [[7,7,7,7],[7,7,7]],// 4: ordered
        [[],[3]],// 5: NOT ordered
        [[[[]]],[[]]],// 6: ordered
        [[1,[2,[3,[4,[5,6,7]]]],8,9],[1,[2,[3,[4,[5,6,0]]]],8,9]],// 7: NOT ordered
    ]

    test('example part 1', function () {
        expect(orderedIndexes(example)).toEqual([1, 2, 4, 6]);
    });

});
