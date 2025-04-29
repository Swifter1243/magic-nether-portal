import { _, abs, clone, MCFunction, Objective, setblock } from "sandstone";
import { playerInPortalXY, playerInPortalZ, playerIsNorthCurrent, portalCenterRaw, portalFrustumMatrix } from "./data";
import { Vec3Tuple, Vector4 } from "./vector";
import { multiplyPoint } from "./matrix";
import { Boolean } from "./boolean";
import { netherRelativeX, overworldRelativeX } from "./structure";

const testObjective = Objective.create('frustum_test')
const testPos = Vector4.fromObjective(testObjective, 'pos')
const testResultPos = Vector4.fromObjective(testObjective, 'resultPos')
const testResultSuccess = Boolean.from(testObjective('resultBoolean'))

export function doBlockTests() {
    _.if(playerInPortalZ.value, () => {
        _.if(playerInPortalXY.value, () => {
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
    for (let x = -5; x <= 4; x++) {
        for (let y = -2; y <= -2; y++) {
            for (let z = -3; z <= 3; z++) {
                testPoint(x, y, z, test)
            }
        }
    }
}

function testPoint(x: number, y: number, z: number, test?: () => void) {
    x = Math.floor(x) + 0.5
    y = Math.floor(y) + 0.5
    z = Math.floor(z) + 0.5

    testPos.x["="](x)
    testPos.y["="](y)
    testPos.z["="](z)

    if (test)
        test()

    const p = [Math.floor(x), Math.floor(y), Math.floor(z)] as Vec3Tuple
    const overworldSrc = abs(p[0] + overworldRelativeX, p[1], p[2])
    const netherSrc = abs(p[0] + netherRelativeX, p[1], p[2])
    const dstPoint = abs(...p)

    _.if(testResultSuccess.value, () => {
        clone(netherSrc, netherSrc, dstPoint)
    }).else(() => {
        clone(overworldSrc, overworldSrc, dstPoint)
    })
}