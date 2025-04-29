import { _, data, MCFunction, Objective, tellraw } from 'sandstone'
import { Vector4 } from './vector'
import { FixedPointNumber } from './number'
import { Matrix4x4 } from './matrix'
import { Boolean } from './boolean'

export const portalCenterRaw = [0, 0.5, 0.5]
export const portalSizeRaw = [3, 4]

export const dataObjective = Objective.create('portal_data')
export const playerHead = new Vector4(
    dataObjective('player_x'),
    dataObjective('player_y'),
    dataObjective('player_z'),
    dataObjective('player_w')
)
export const portalCenter = new Vector4(
    dataObjective('portal_center_x'), 
    dataObjective('portal_center_y'),
    dataObjective('portal_center_w'),
    dataObjective('portal_center_z') 
)
export const portalSizeX = FixedPointNumber.from(dataObjective('portal_size_x'))
export const portalSizeY = FixedPointNumber.from(dataObjective('portal_size_y'))
export const portalFrustumMatrix = Matrix4x4.fromObjective(dataObjective, 'portal_frustum_matrix')
export const playerInNether = Boolean.from(dataObjective('player_in_nether'))
export const playerIsNorthLast = Boolean.from(dataObjective('player_is_north_last'))
export const playerIsNorthCurrent = Boolean.from(dataObjective('player_is_north_current'))
export const playerInPortalXY = Boolean.from(dataObjective('player_in_portal_xy'))
export const playerInPortalZ = Boolean.from(dataObjective('player_in_portal_z'))

export const checkPlayerPortalData = MCFunction('check_player_portal_data', () => {
    _.if(_.and(
        playerHead.z.greaterThan(portalCenterRaw[2] - 0.5),
        playerHead.z.lessThan(portalCenterRaw[2] + 0.5)
    ), () => {
        playerInPortalZ['='](true)
    }).else(() => {
        playerInPortalZ['='](false)
    })

    _.if(_.and(
        playerHead.x.greaterThan(portalCenterRaw[0] - portalSizeRaw[0] * 0.5),
        playerHead.x.lessThan(portalCenterRaw[0] + portalSizeRaw[0] * 0.5),
        playerHead.y.greaterThan(portalCenterRaw[1] - portalSizeRaw[1] * 0.5),
        playerHead.y.lessThan(portalCenterRaw[1] + portalSizeRaw[1] * 0.5)
    ), () => {
        playerInPortalXY['='](true)
    }).else(() => {
        playerInPortalXY['='](false)
    })

    _.if(playerHead.z.lessThan(portalCenter.z), () => {
        playerIsNorthCurrent['='](true)
    }).else(() => {
        playerIsNorthCurrent['='](false)
    })
})

MCFunction('init_portal_data', () => {
    playerHead.w['='](1)

    portalCenter.x['='](portalCenterRaw[0])
    portalCenter.y['='](portalCenterRaw[1])
    portalCenter.z['='](portalCenterRaw[2])
    portalCenter.w['='](1)

    portalSizeX['='](portalSizeRaw[0])
    portalSizeY['='](portalSizeRaw[1])

    portalFrustumMatrix.m01['='](0)
    portalFrustumMatrix.m10['='](0)
    portalFrustumMatrix.m20['='](0)
    portalFrustumMatrix.m30['='](0)
    portalFrustumMatrix.m21['='](0)
    portalFrustumMatrix.m31['='](0)

    playerInNether['='](false)

    checkPlayerPortalData()
    playerIsNorthLast['='](playerIsNorthCurrent)
}, {
    runOnLoad: true
})