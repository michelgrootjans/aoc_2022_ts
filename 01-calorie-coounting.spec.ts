import _ from 'lodash/fp'

function mostCalories(calories: string[]): number {
  return _.flow(
    _.map(parseInt),
    _.sum
  )(calories);
}

it('no input', () => {
  expect(mostCalories([])).toEqual(0);
});

it('one calorie', () => {
  expect(mostCalories(['1000'])).toEqual(1000);
});

it('one calorie', () => {
  expect(mostCalories(['1000'])).toEqual(1000);
});

it('two calories', () => {
  expect(mostCalories(['1000', '1000'])).toEqual(2000);
});