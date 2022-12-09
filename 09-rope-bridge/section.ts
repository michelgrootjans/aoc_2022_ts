import {Knot} from "./knot";

export class Section {
    private readonly _head: Knot;
    private readonly _tail: Knot;

    static build(numberOfKnots = 2) {
        return new Section(new Knot(0, 0), new Knot(0 , 0))
    }

    private constructor(head: Knot, tail: Knot = head) {
        this._head = head;
        this._tail = tail;
    }

    ends() {
        return {head: this.head(), tail: this._tail};
    }

    private head() {
        return this._head;
    }

    tail() {
        return this._tail;
    }

    right() {
        return this.move(this.head().right());
    }

    left() {
        return this.move(this.head().left());
    }

    up() {
        return this.move(this.head().up());
    }

    down() {
        return this.move(this.head().down());
    }

    private move(head: Knot) {
        return new Section(head, this._tail.follow(head));
    }
}