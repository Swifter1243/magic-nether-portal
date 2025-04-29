import { _, abs, MCFunction, Objective, setblock } from "sandstone";
import { playerInPortalBounds, playerInPortalZ, playerIsNorthCurrent, portalCenterRaw, portalFrustumMatrix } from "./data";
import { Vector4 } from "./vector";
import { multiplyPoint } from "./matrix";
import { Boolean } from "./boolean";

const testObjective = Objective.create('frustum_test')
const testPos = Vector4.fromObjective(testObjective, 'pos')
const testResultPos = Vector4.fromObjective(testObjective, 'resultPos')
const testResultSuccess = Boolean.from(testObjective('resultBoolean'))

export function doBlockTests() {
    _.if(playerInPortalZ.value, () => {
        _.if(playerInPortalBounds.value, () => {
            onTestPointOnOppositeHalf()
        }).else(() => {
            onTestNever()
        })
    }).else(() => {
        onTestPointIsInFrustum()
    })
}

function onTestNever() {
    testResultSuccess["="](false)
    testPoints()
}

const testPointOnOppositeHalf = MCFunction('test_point_on_opposite_half', () => {
    _.if(playerIsNorthCurrent.value, () => {
        _.if(testPos.z[">"](portalCenterRaw[2]), () => {
            testResultSuccess["="](true)
        }).else(() => {
            testResultSuccess["="](false)
        })
    }).else(() => {
        _.if(testPos.z["<"](portalCenterRaw[2]), () => {
            testResultSuccess["="](true)
        }).else(() => {
            testResultSuccess["="](false)
        })
    })
})

function onTestPointOnOppositeHalf() {
    testPoints(() => testPointOnOppositeHalf())
}

const testPointIsInFrustum = MCFunction('test_point_is_in_frustum', () => {
    testPos.w["="](1)
    multiplyPoint(testPos, portalFrustumMatrix, testResultPos)

    testResultPos.x["/="](testResultPos.w)
    testResultPos.y["/="](testResultPos.w)

    testResultSuccess["="](true)

    const fail = () => testResultSuccess["="](false)

    _.if(testResultPos.z["<"](0), fail) // behind frame
    _.if(testResultPos.x["<"](-0.5), fail) // too far left
    _.if(testResultPos.x[">"](0.5), fail) // too far right
    _.if(testResultPos.y["<"](-0.5), fail) // too far up
    _.if(testResultPos.y[">"](0.5), fail) // too far down
})

function onTestPointIsInFrustum() {
    testPoints(() => testPointIsInFrustum())
}

function testPoints(test?: () => void) {
    for (let x = -15; x <= 15; x++) {
        for (let y = -10; y <= 10; y++) {
            for (let z = 0; z <= 0; z++) {
                testPoint(portalCenterRaw[0] + x, portalCenterRaw[1] + y, portalCenterRaw[2] + z + 3, test)
            }
        }
    }
}

function testPoint(x: number, y: number, z: number, test?: () => void) {
    x = Math.round(x) + 0.5
    y = Math.round(y) + 0.5
    z = Math.round(z) + 0.5

    testPos.x["="](x)
    testPos.y["="](y)
    testPos.z["="](z)

    if (test)
        test()

    const p = abs(Math.floor(x), Math.floor(y), Math.floor(z))

    _.if(testResultSuccess.value, () => {
        setblock(p, 'minecraft:netherrack')
    }).else(() => {
        setblock(p, 'minecraft:air')
    })
}