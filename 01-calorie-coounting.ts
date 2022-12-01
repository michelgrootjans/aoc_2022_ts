import _ from 'lodash/fp'

class Elf {
    public calories: number = 0;

    addCalories(calories: number) {
        this.calories += calories
    }

    totalCalories(): number {
        return this.calories;
    }
}

const caloriesByElves = _.flow(
    _.reduce((elves: Elf[], calories: string) => {
        if (elves.length === 0) elves = [new Elf()];
        if (calories) {
            const [elf, _] = elves;
            elf.addCalories(parseInt(calories));
            return elves;
        }
        return [new Elf(), ...elves];
    }, []),
    _.map(elf => elf.totalCalories()),
);

const fromHighToLow = _.flow(
    _.sortBy(_.identity),
    _.reverse,
);

export const mostCalories = _.flow(
    caloriesByElves,
    _.max,
);

export const topThree = _.flow(
    caloriesByElves,
    fromHighToLow,
    _.take(3),
    _.sum,
);