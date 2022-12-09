import {Section} from "./section";
import {State} from "./state";

export class Command {
    public readonly direction: string;
    public readonly steps: number;

    private readonly operation: (section: Section) => Section;

    constructor(direction: string, steps: number) {
        this.direction = direction;
        this.steps = steps;

        function createOperation(direction: string) {
            switch (direction) {
                case 'R': return (section: Section) => section.right();
                case 'L': return (section: Section) => section.left();
                case 'U': return (section: Section) => section.up();
                case 'D': return (section: Section) => section.down();
                default:  throw `unknown direction: ${direction}`
            }
        }

        this.operation = createOperation(this.direction);
    }

    move(state: State): State {
        if (this.steps === 0) return state;

        const section = this.operation(state.now);
        return new Command(this.direction, this.steps - 1)
            .move(state.next(section))
    }
}