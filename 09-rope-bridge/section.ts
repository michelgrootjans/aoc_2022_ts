import {Knot} from "./knot";

export class Section {
    private readonly _head: Knot;
    private readonly _tail: Knot;
    private knots: Knot[];

    static build(numberOfKnots = 2) {
        return new Section(new Knot(0, 0), new Knot(0 , 0))
    }

    private constructor(head: Knot, tail: Knot = head) {
        this._head = head;
        this._tail = tail;
        this.knots = [head, tail]
    }

    ends(): {head: Knot, tail: Knot} {
        return {head: this.head(), tail: this.tail()};
    }

    private head(): Knot {
        return this.knots[0];
    }

    tail(): Knot {
        return this.knots[this.knots.length - 1];
    }

    right(): Section {
        return this.move(this.head().right());
    }

    left(): Section {
        return this.move(this.head().left());
    }

    up(): Section {
        return this.move(this.head().up());
    }

    down(): Section {
        return this.move(this.head().down());
    }

    private move(head: Knot): Section {
        return new Section(head, this._tail.follow(head));
    }
}