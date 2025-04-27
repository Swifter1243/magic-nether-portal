import { Objective, Score } from "sandstone";

const variablesObjective = Objective.create('temp_variables')
let next = 0

export function getNextVariable(): Score<string> {
    const name = `number_${next++}`
    return variablesObjective(name)
}