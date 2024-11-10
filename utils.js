export class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    clone() {
        return new Vector2D(this.x, this.y);
    }
}

export function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}