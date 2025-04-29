import { _, Data, MCFunction, tellraw } from "sandstone"
import { doBlockTests } from "./test"
import { FixedPointNumber } from "./number"
import { checkPlayerPortalData, playerHead, playerIsNorthCurrent, playerIsNorthLast, portalCenter, portalFrustumMatrix, portalSizeX, portalSizeY } from "./data"

MCFunction('update', () => {
    updatePlayerHead()
    updatePortalFrustum()
    updatePlayerPortalSide()
    doBlockTests()
}, {
    runEachTick: true
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

const updatePlayerPortalSide = MCFunction('update_player_portal_side', () => {
    checkPlayerPortalData()

    _.if(playerIsNorthCurrent["!="](playerIsNorthLast), () => {
        tellraw('@a', 'portal side crossed')
    })

    playerIsNorthLast["="](playerIsNorthCurrent)
})