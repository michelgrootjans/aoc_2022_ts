import {Rope} from "./rope";
import {Knot} from "./knot";

export class State {
    public readonly current: Rope;
    private readonly _tailHistory: Knot[]

    constructor(now: Rope, history: Knot[] = []) {
        this.current = now;
        this._tailHistory = history;
    }

    next(rope: Rope): State {
        return new State(rope, this.tailHistory());
    }

    tailHistory() {
        return [this.current.tail(), ...this._tailHistory];
    }
}