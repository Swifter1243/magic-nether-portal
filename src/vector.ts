import { ObjectiveInstance, Score } from "sandstone";
import { FixedPointNumber } from "./number";

export class Vector4 {
    x: FixedPointNumber
    y: FixedPointNumber
    z: FixedPointNumber
    w: FixedPointNumber

    constructor(x: FixedPointNumber, y: FixedPointNumber, z: FixedPointNumber, w: FixedPointNumber)
    constructor(x: Score<string>, y: Score<string>, z: Score<string>, w: Score<string>)
    constructor(x: Score<string> | FixedPointNumber, y: Score<string> | FixedPointNumber, z: Score<string> | FixedPointNumber, w: Score<string> | FixedPointNumber) {
        this.x = x instanceof FixedPointNumber ? x : FixedPointNumber.from(x)
        this.y = y instanceof FixedPointNumber ? y : FixedPointNumber.from(y)
        this.z = z instanceof FixedPointNumber ? z : FixedPointNumber.from(z)
        this.w = w instanceof FixedPointNumber ? w : FixedPointNumber.from(w)
    }

    static from(x = 0, y = 0, z = 0, w = 1) {
        return new Vector4(
            FixedPointNumber.from(x), 
            FixedPointNumber.from(y), 
            FixedPointNumber.from(z), 
            FixedPointNumber.from(w)
        )
    }

    static fromObjective(objective: ObjectiveInstance<string>, prefix: string) {
        return new Vector4(
            FixedPointNumber.from(objective(`${prefix}_x`)),
            FixedPointNumber.from(objective(`${prefix}_y`)),
            FixedPointNumber.from(objective(`${prefix}_z`)),
            FixedPointNumber.from(objective(`${prefix}_w`))
        )
    }

    get array() { return [this.x, this.y, this.z, this.w] }
}