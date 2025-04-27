import type { SandstoneConfig } from 'sandstone'
import { path as outputPath } from './outputpath'

export default {
  name: 'magic-nether-portal',
  description: [ 'A ', { text: 'Sandstone', color: 'gold' }, ' data pack.' ],
  formatVersion: 7,
  namespace: 'magic-nether-portal',
  packUid: 'jixx-I4w',
  saveOptions: { path: outputPath },
  onConflict: {
    default: 'warn',
  },
} as SandstoneConfig
