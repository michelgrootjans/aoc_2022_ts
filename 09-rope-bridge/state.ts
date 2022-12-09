import {Section} from "./section";

export class State {
    public readonly now: Section;
    public readonly history: Section[]

    constructor(now: Section, history: Section[] = []) {
        this.now = now;
        this.history = history;
    }

    next(section: Section) {
        return new State(section, [this.now, ...this.history]);
    }
}