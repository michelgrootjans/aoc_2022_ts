export class Knot {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    right() {
        return new Knot(this.x + 1, this.y);
    }

    left() {
        return new Knot(this.x - 1, this.y);
    }

    up() {
        return new Knot(this.x, this.y + 1);
    }

    down() {
        return new Knot(this.x, this.y - 1);
    }

    follow(that: Knot) {
        if (this.isCloseTo(that)) return this;

        let result: Knot = this;
        if (that.x > result.x) result = result.right();
        if (that.x < result.x) result = result.left();
        if (that.y > result.y) result = result.up();
        if (that.y < result.y) result = result.down();
        return result;
    }

    private isCloseTo(that: Knot): boolean {
        return Math.abs(this.x - that.x) <= 1 && Math.abs(this.y - that.y) <= 1;
    }
}