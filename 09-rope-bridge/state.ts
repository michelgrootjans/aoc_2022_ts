import {Section} from "./section";
import {Knot} from "./knot";

export class State {
    public readonly current: Section;
    private readonly _history: Knot[]

    constructor(now: Section, history: Knot[] = []) {
        this.current = now;
        this._history = history;
    }

    next(section: Section): State {
        return new State(section, this.history());
    }

    history() {
        return [this.current.ends().tail, ...this._history];
    }
}