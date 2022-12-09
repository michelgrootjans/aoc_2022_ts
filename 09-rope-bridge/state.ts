import {Section} from "./section";
import {Knot} from "./knot";

export class State {
    public readonly now: Section;
    public readonly history: Knot[]

    constructor(now: Section, history: Knot[] = []) {
        this.now = now;
        this.history = history;
    }

    next(section: Section): State {
        return new State(section, [this.now.tail(), ...this.history]);
    }
}