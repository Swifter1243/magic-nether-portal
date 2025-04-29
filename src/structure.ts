import { _, abs, clone, MCFunction, tellraw } from "sandstone"
import { playerInNether } from "./data"
import { Vec3Tuple } from "./vector"

const structureSize = [32, 32, 32]

export const overworldRelativeX = 1000
const overworldInputOrigin: Vec3Tuple = [984, 47, -15]
const overworldOutputOrigin: Vec3Tuple = [984, -2, -15]
export const netherRelativeX = -1000
const netherInputOrigin: Vec3Tuple = [-1016, 44, -15]
const netherOutputOrigin: Vec3Tuple = [-1016, -2, -15]

function cloneInputToOutput(input: Vec3Tuple, output: Vec3Tuple) {
    const near = input
    const far = input.map((x, i) => x + structureSize[i]) as Vec3Tuple

    clone(abs(...near), abs(...far), abs(...output))
}

export const updateStructureAreas = MCFunction('update_structure_areas', () => {
    _.if(playerInNether.value, () => {
        cloneInputToOutput(overworldInputOrigin, netherOutputOrigin)
        cloneInputToOutput(netherInputOrigin, overworldOutputOrigin)
    }).else(() => {
        cloneInputToOutput(overworldInputOrigin, overworldOutputOrigin)
        cloneInputToOutput(netherInputOrigin, netherOutputOrigin)
    })
})