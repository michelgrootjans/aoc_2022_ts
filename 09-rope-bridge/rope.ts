import _ from 'lodash'
import {Knot} from "./knot";

export class Rope {
    private knots: Knot[];
    public readonly headd: Knot;
    public readonly taill: Knot;

    static build(numberOfKnots: number) {
        return new Rope(_.range(numberOfKnots).map(_ => new Knot(0,0)))
    }

    private constructor(knots: Knot[]) {
        this.knots = knots
        this.headd = this.knots[0];
        this.taill = this.knots[this.knots.length - 1]
    }

    ends(): {head: Knot, tail: Knot} {
        return {head: this.headd, tail: this.tail()};
    }
    
    tail(): Knot {
        return this.taill;
    }

    right(): Rope {
        return this.move(this.headd.right());
    }

    left(): Rope {
        return this.move(this.headd.left());
    }

    up(): Rope {
        return this.move(this.headd.up());
    }

    down(): Rope {
        return this.move(this.headd.down());
    }

    private move(head: Knot): Rope {
        function abc([head, next, ...rest]: Knot[]): Knot[] {
            if(!next) return [head];
            return [head, ...abc([next.follow(head), ...rest])];
        }

        return new Rope(abc([head, ..._.tail(this.knots)]));
    }
}