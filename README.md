source for this thing

https://x.com/Swifter1243/status/1917094003725475844

# World Download

Go to the [releases page](https://github.com/Swifter1243/magic-nether-portal/releases/latest) and download the zip.

Portal is at `0,0,0`

# Building Yourself

> [!CAUTION]  
> Sandstone is currently broken on 1.21+ because of the datapack namespace changes (e.g. `functions` -> `function`) so you'll need to backport the world if you want to build this yourself.

> [!IMPORTANT]  
> Create an `outputpath.ts` file in the root project which exports the path to the desired datapack output.
```ts
export const path = 'F:/Games/.minecraft/saves/magic nether portal/datapacks'
```

***

To build the datapack, run:
```ts
npm run build
// or
yarn build
// or
sand build
```
