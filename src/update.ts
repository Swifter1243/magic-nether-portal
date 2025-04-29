import { _, abs, data, Data, execute, kill, MCFunction, Objective, particle, rel, scoreboard, Selector, setblock, summon, tellraw, title } from "sandstone";
import { checkPlayerPortalData, playerHead, playerInPortalBounds, playerInPortalZ, playerIsNorthCurrent, playerIsNorthLast, portalCenter, portalCenterRaw, portalFrustumMatrix, portalSizeX, portalSizeY } from "./data";
import { Vector4 } from "./vector";
import { Matrix4x4, multiplyPoint } from "./matrix";
import { Boolean } from "./boolean";
import { FixedPointNumber } from "./number";

MCFunction('update', () => {
    updatePlayerHead()
    updatePortalFrustum()
    updatePlayerPortalSide()
    doBlockTests()
}, {
    runEachTick: true
})

function doBlockTests() {
    _.if(playerInPortalZ.score, () => {
        _.if(playerInPortalBounds.score, () => {
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

const updatePlayerPortalSide = MCFunction('update_player_portal_side', () => {
    checkPlayerPortalData()

    _.if(playerIsNorthCurrent["!="](playerIsNorthLast), () => {
        tellraw('@a', 'portal side crossed')
    })

    playerIsNorthLast["="](playerIsNorthCurrent)
})

const updatePortalFrustum = MCFunction('update_portal_frustum', () => {
    const invPlayerZDist = FixedPointNumber.from(1)["/"](portalCenter.z["-"](playerHead.z))

    const antiSkewX = FixedPointNumber.from(-1)["*"](portalCenter.x["-"](playerHead.x))["*"](invPlayerZDist)
    const antiSkewY = FixedPointNumber.from(-1)["*"](portalCenter.y["-"](playerHead.y))["*"](invPlayerZDist)

    const invSizeX = FixedPointNumber.from(1)["/"](portalSizeX)
    const invSizeY = FixedPointNumber.from(1)["/"](portalSizeY)

    const sAx = invSizeX["*"](antiSkewX)
    const sAy = invSizeY["*"](antiSkewY)
    const oPz = FixedPointNumber.from(-1)["*"](invPlayerZDist)["*"](playerHead.z)

    portalFrustumMatrix.m00["="](invSizeX)
    portalFrustumMatrix.m02["="](sAx)
    portalFrustumMatrix.m03["="](FixedPointNumber.from(-1)["*"](sAx)["*"](playerHead.z)["-"](invSizeX["*"](playerHead.x)))

    portalFrustumMatrix.m11["="](invSizeY)
    portalFrustumMatrix.m12["="](sAy)
    portalFrustumMatrix.m13["="](FixedPointNumber.from(-1)["*"](sAy)["*"](playerHead.z)["-"](invSizeY["*"](playerHead.y)))

    portalFrustumMatrix.m22["="](invPlayerZDist)
    portalFrustumMatrix.m23["="](oPz["-"](1))

    portalFrustumMatrix.m32["="](invPlayerZDist)
    portalFrustumMatrix.m33["="](oPz)
})

const updatePlayerHead = MCFunction('update_player_head', () => {
    const player = Data('entity', '@p')
    const playerPosData = player.select('Pos')

    playerHead.x.setFromNBT(playerPosData.select([0]))
    playerHead.y.setFromNBT(playerPosData.select([1]))
    playerHead.z.setFromNBT(playerPosData.select([2]))

    playerHead.y['+='](1.6)
})

const testObjective = Objective.create('frustum_test')
const testPos = Vector4.fromObjective(testObjective, 'pos')
const testResultPos = Vector4.fromObjective(testObjective, 'resultPos')
const testResultSuccess = Boolean.from(testObjective('resultBoolean'))

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