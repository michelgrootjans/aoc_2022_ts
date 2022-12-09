import {Section} from "./section";
import {Knot} from "./knot";

export class State {
    public readonly current: Section;
    private readonly _tailHistory: Knot[]

    constructor(now: Section, history: Knot[] = []) {
        this.current = now;
        this._tailHistory = history;
    }

    next(section: Section): State {
        return new State(section, this.tailHistory());
    }

    tailHistory() {
        return [this.current.tail(), ...this._tailHistory];
    }
}