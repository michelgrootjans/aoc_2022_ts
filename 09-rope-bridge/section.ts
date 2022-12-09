import {Knot} from "./knot";

export class Section {
    public readonly head: Knot;
    public readonly tail: Knot;

    static build(numberOfKnots = 2) {
        return new Section(new Knot(0, 0), new Knot(0 , 0))
    }

    constructor(head: Knot, tail: Knot = head) {
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