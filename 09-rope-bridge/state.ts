import {Section} from "./section";
import {Knot} from "./knot";

export class State {
    public readonly current: Section;
    private readonly history: Knot[]

    constructor(now: Section, history: Knot[] = []) {
        this.current = now;
        this.history = history;
    }

    next(section: Section): State {
        return new State(section, this.getHistory());
    }

    getHistory() {
        return [this.current.ends().tail, ...this.history];
    }
}