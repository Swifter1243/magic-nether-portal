import { _, abs, clone, MCFunction, Objective, setblock, tellraw } from "sandstone";
import { playerInPortalXY, playerInPortalZ, playerIsNorthCurrent, portalCenterRaw, portalFrustumMatrix } from "./data";
import { Vec3Tuple, Vector4 } from "./vector";
import { multiplyPoint } from "./matrix";
import { Boolean } from "./boolean";
import { netherRelativeX, overworldRelativeX } from "./structure";

const testObjective = Objective.create('frustum_test')
const testPos = Vector4.fromObjective(testObjective, 'pos')
const testResultPos = Vector4.fromObjective(testObjective, 'resultPos')
const testResultSuccess = Boolean.from(testObjective('resultBoolean'))

export const doBlockTests = MCFunction('do_block_tests', () => {
    _.if(playerInPortalZ.value, () => {
        _.if(playerInPortalXY.value, () => {
            onTestPointOnOppositeHalf()
        }).else(() => {
            onTestNever()
        })
    }).else(() => {
        onTestPointIsInFrustum()
    })
})

const onTestNever = MCFunction('tests/never', () => {
    testResultSuccess["="](false)
    testPoints()
})

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

const onTestPointIsInFrustum = MCFunction('tests/point_is_in_frustum', () => {
    testPoints(() => testPointIsInFrustum())
})

function testPoints(test?: () => void) {
    const minCorner = [-10, -2, -10]
    const maxCorner = [10, 5, 10]

    for (let x = minCorner[0]; x <= maxCorner[0]; x++) {
        testPos.x["="](Math.floor(x) + 0.5)
        for (let y = minCorner[1]; y <= maxCorner[1]; y++) {
            testPos.y["="](Math.floor(y) + 0.5)
            for (let z = minCorner[2]; z <= maxCorner[2]; z++) {
                testPos.z["="](Math.floor(z) + 0.5)
                testPoint(x, y, z, test)
            }
        }
    }
}

function testPoint(x: number, y: number, z: number, test?: () => void) {
    if (test)
        test()

    const p = [Math.floor(x), Math.floor(y), Math.floor(z)] as Vec3Tuple
    const overworldSrc = abs(p[0] + overworldRelativeX, p[1], p[2])
    const netherSrc = abs(p[0] + netherRelativeX, p[1], p[2])
    const dstPoint = abs(...p)

    _.if(testResultSuccess.value, () => {
        clone(netherSrc, netherSrc, dstPoint).replace('force')
    }).else(() => {
        clone(overworldSrc, overworldSrc, dstPoint).replace('force')
    })
}