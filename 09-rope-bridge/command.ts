import {Rope} from "./rope";
import {State} from "./state";

export class Command {
    public readonly direction: string;
    public readonly steps: number;

    private readonly operation: (section: Rope) => Rope;

    constructor(direction: string, steps: number) {
        this.direction = direction;
        this.steps = steps;

        function createOperation(direction: string) {
            switch (direction) {
                case 'R': return (section: Rope) => section.right();
                case 'L': return (section: Rope) => section.left();
                case 'U': return (section: Rope) => section.up();
                case 'D': return (section: Rope) => section.down();
                default:  throw `unknown direction: ${direction}`
            }
        }

        this.operation = createOperation(this.direction);
    }

    move(state: State): State {
        if (this.steps === 0) return state;

        const section = this.operation(state.current);
        return new Command(this.direction, this.steps - 1)
            .move(state.next(section))
    }
}