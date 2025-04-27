import { Objective, Score } from "sandstone";
import { StoreType } from "sandstone/commands/implementations";
import { DataPointInstance } from "sandstone/variables/Data";
import { getNextVariable } from "./variable";
import { ConditionType } from "sandstone/flow";

export const SCALE = 10000

export class FixedPointNumber {
    readonly score: Score<string>

    constructor(score: Score<string>) {
        this.score = score
    }

    static from(value: Score<string> | number | undefined): FixedPointNumber {
        if (value instanceof Score) {
            return new FixedPointNumber(value)
        }

        const temp = FixedPointNumber.from(getNextVariable())
        if (value !== undefined) temp["="](value)
        return temp
    }

    setFromNBT(nbt: DataPointInstance) {
        this.score.set(nbt, SCALE)
    }

    storeIntoNBT(nbt: DataPointInstance, storeType: StoreType) {
        nbt.set(this.score, storeType, 1 / SCALE)
    }

    '+' = this.add
    add(other: FixedPointNumber | number): FixedPointNumber {
        if (typeof other === 'number') {
            return FixedPointNumber.from(this.score['+'](other * SCALE))
        } else {
            return FixedPointNumber.from(this.score['+'](other.score))
        }
    }

    '-' = this.subtract
    subtract(other: FixedPointNumber | number): FixedPointNumber {
        if (typeof other === 'number') {
            return FixedPointNumber.from(this.score['-'](other * SCALE))
        } else {
            return FixedPointNumber.from(this.score['-'](other.score))
        }
    }

    '*' = this.multiply
    multiply(other: FixedPointNumber | number): FixedPointNumber {
        if (typeof other === 'number') {
            return FixedPointNumber.from(this.score["*"](other))
        } else {
            const result = FixedPointNumber.from(getNextVariable())
            result["="](this)
            result['*='](other)
            return result
        }
    }

    '/' = this.divide
    divide(other: FixedPointNumber | number): FixedPointNumber {
        if (typeof other === 'number') {
            return FixedPointNumber.from(this.score["/"](other))
        } else {
            const result = FixedPointNumber.from(getNextVariable())
            result["="](this)
            result['/='](other)
            return result
        }
    }

    '=' = this.set
    set(other: FixedPointNumber | number): FixedPointNumber {
        if (typeof other === 'number') {
            this.score.set(other * SCALE)
        } else {
            this.score.set(other.score)
        }

        return this
    }

    '+=' = this.addEquals
    addEquals(other: FixedPointNumber | number) : FixedPointNumber {
        if (typeof other === 'number') {
            this.score.add(other * SCALE)
        } else {
            this.score.add(other.score)
        }

        return this
    }

    '*=' = this.multiplyEquals
    multiplyEquals(other: FixedPointNumber | number) : FixedPointNumber {
        if (typeof other === 'number') {
            this.score.multiply(other)
        } else {
            this.score.multiply(other.score)
            this.score.divide(SCALE)
        }

        return this
    }

    '/=' = this.divideEquals
    divideEquals(other: FixedPointNumber | number) : FixedPointNumber {
        if (typeof other === 'number') {
            this.score.divide(other)
        } else {
            this.score.multiply(SCALE)
            this.score.divide(other.score)
        }

        return this
    }

    '<' = this.lessThan
    lessThan(other: number): ConditionType {
        return this.score.lessThan(other * SCALE)
    }

    '>' = this.greaterThan
    greaterThan(other: number): ConditionType {
        return this.score.greaterThan(other * SCALE)
    }
}

export const MINUS_ONE = FixedPointNumber.from(-1)
export const ONE = FixedPointNumber.from(1)