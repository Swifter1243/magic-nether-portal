import { comment, Data, Objective, ObjectiveInstance, Score } from "sandstone";
import { Vector4 } from "./vector";
import { FixedPointNumber } from "./number";

export class Matrix4x4 {
    elements: FixedPointNumber[]

    static fromObjective(objective: ObjectiveInstance<string>, prefix: string) {
        const elements = [
            FixedPointNumber.from(objective(`${prefix}_m00`)),
            FixedPointNumber.from(objective(`${prefix}_m01`)),
            FixedPointNumber.from(objective(`${prefix}_m02`)),
            FixedPointNumber.from(objective(`${prefix}_m03`)),
            FixedPointNumber.from(objective(`${prefix}_m10`)),
            FixedPointNumber.from(objective(`${prefix}_m11`)),
            FixedPointNumber.from(objective(`${prefix}_m12`)),
            FixedPointNumber.from(objective(`${prefix}_m13`)),
            FixedPointNumber.from(objective(`${prefix}_m20`)),
            FixedPointNumber.from(objective(`${prefix}_m21`)),
            FixedPointNumber.from(objective(`${prefix}_m22`)),
            FixedPointNumber.from(objective(`${prefix}_m23`)),
            FixedPointNumber.from(objective(`${prefix}_m30`)),
            FixedPointNumber.from(objective(`${prefix}_m31`)),
            FixedPointNumber.from(objective(`${prefix}_m32`)),
            FixedPointNumber.from(objective(`${prefix}_m33`))
        ]
        return new Matrix4x4(elements)
    }

    static from(
        m00 = 1, m01 = 0, m02 = 0, m03 = 0,
        m10 = 0, m11 = 1, m12 = 0, m13 = 0,
        m20 = 0, m21 = 0, m22 = 1, m23 = 0,
        m30 = 0, m31 = 0, m32 = 0, m33 = 1,
    ) {
        return new Matrix4x4([
            FixedPointNumber.from(m00), 
            FixedPointNumber.from(m01), 
            FixedPointNumber.from(m02), 
            FixedPointNumber.from(m03),
            FixedPointNumber.from(m10), 
            FixedPointNumber.from(m11), 
            FixedPointNumber.from(m12), 
            FixedPointNumber.from(m13),
            FixedPointNumber.from(m20), 
            FixedPointNumber.from(m21), 
            FixedPointNumber.from(m22), 
            FixedPointNumber.from(m23),
            FixedPointNumber.from(m30), 
            FixedPointNumber.from(m31), 
            FixedPointNumber.from(m32), 
            FixedPointNumber.from(m33),
        ])
    }

    get m00() { return this.elements[0] }
    get m01() { return this.elements[1] }
    get m02() { return this.elements[2] }
    get m03() { return this.elements[3] }
    get m10() { return this.elements[4] }
    get m11() { return this.elements[5] }
    get m12() { return this.elements[6] }
    get m13() { return this.elements[7] }
    get m20() { return this.elements[8] }
    get m21() { return this.elements[9] }
    get m22() { return this.elements[10] }
    get m23() { return this.elements[11] }
    get m30() { return this.elements[12] }
    get m31() { return this.elements[13] }
    get m32() { return this.elements[14] }
    get m33() { return this.elements[15] }

    // m00, m01, m02, m03, m10... etc
    constructor(elements: FixedPointNumber[]) {
        if (elements.length != 16) {
            throw new Error("Matrix4x4 must be initialized with 16 elements!")
        }

        this.elements = elements
    }

    getElement(row: number, column: number) {
        const index = row * 4 + column
        return this.elements[index]
    }

    '=' = this.set
    set(other: Matrix4x4): Matrix4x4 {
        this.elements.forEach((x, i) => {
            x.set(other.elements[i])
        })

        return this
    }
}

export function multiplyPoint(v: Vector4, m: Matrix4x4, result: Vector4) {
    for (let i = 0; i < 4; i++) {
        const output = result.array[i]
        output["="](0)

        output["+="](v.x["*"](m.getElement(i, 0)))
        output["+="](v.y["*"](m.getElement(i, 1)))
        output["+="](v.z["*"](m.getElement(i, 2)))
        output["+="](v.w["*"](m.getElement(i, 3)))
    }
}