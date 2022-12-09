import _ from 'lodash'
import {Knot} from "./knot";

export class Rope {
    private knots: Knot[];

    static build() {
        return new Rope(_.range(2).map(_ => new Knot(0,0)))
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
        function abc([head, next, ...rest]: Knot[]): Knot[] {
            if(!next) return [];
            return [head, ...abc([next.follow(head), ...rest])];
        }

        const knots: Knot[] = abc([head, ..._.tail(this.knots)])
        return new Rope([head, this.tail().follow(head)]);
    }
}