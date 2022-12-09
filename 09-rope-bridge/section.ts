import {Knot} from "./knot";

export class Section {
    public readonly head: Knot;
    public readonly tail: Knot;

    constructor(head: Knot, tail: Knot) {
        this.head = head;
        this.tail = tail;
    }

    right() {
        return this.move(this.head.right());
    }

    left() {
        return this.move(this.head.left());
    }

    up() {
        return this.move(this.head.up());
    }

    down() {
        return this.move(this.head.down());
    }

    private move(head: Knot) {
        return new Section(head, this.tail.follow(head));
    }
}