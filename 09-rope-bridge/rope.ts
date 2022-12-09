import _ from 'lodash'
import {Knot} from "./knot";

export class Rope {
    private knots: Knot[];

    static build(numberOfKnots = 2) {
        return new Rope(_.range(numberOfKnots).map(_ => new Knot(0,0)))
    }

    private constructor(knots: Knot[]) {
        this.knots = knots
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

    right(): Rope {
        return this.move(this.head().right());
    }

    left(): Rope {
        return this.move(this.head().left());
    }

    up(): Rope {
        return this.move(this.head().up());
    }

    down(): Rope {
        return this.move(this.head().down());
    }

    private move(head: Knot): Rope {
        return new Rope([head, this.tail().follow(head)]);
    }
}