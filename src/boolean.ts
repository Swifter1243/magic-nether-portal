import { _, Score } from "sandstone"
import { getNextVariable } from "./variable"

export class Boolean {
    readonly score: Score<string>

    constructor(score: Score<string>) {
        this.score = score
    }

    static from(value: Score<string> | boolean | undefined): Boolean {
        if (value instanceof Score) {
            return new Boolean(value)
        }

        const temp = Boolean.from(getNextVariable())
        if (value !== undefined) temp["="](value)
        return temp
    }
    
    '=' = this.set
    set(value: Boolean | boolean) {
        if (value instanceof Boolean) {
            this.score.set(value.score)
        }
        else {
            this.score.set(value ? 1 : 0)
        }
    }

    '!' = this.not
    not() {
        const result = Boolean.from(getNextVariable())
        _.if(this.value, () => {
            result["="](false)
        }).else(() => {
            result['='](true)
        })
        return result
    }

    '==' = this.isEqual
    isEqual(value: Boolean) {
        return this.score["=="](value.score)
    }

    '!=' = this.isNotEqual
    isNotEqual(value: Boolean) {
        return this.score["!="](value.score)
    }

    get value() {
        return this.score["=="](1)
    }
}