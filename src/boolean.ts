import { Score } from "sandstone"
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
    set(value: boolean) {
        this.score.set(value ? 1 : 0)
    }

    get value() {
        return this.score["=="](1)
    }
}