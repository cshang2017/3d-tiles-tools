import path from "path";

import { readJsonUnchecked } from "./readJsonUnchecked";

import { ResourceResolvers } from "../src/io/ResourceResolvers";
import { TilesetTraverser } from "../src/traversal/TilesetTraverser";
import { TraversedTile } from "../src/traversal/TraversedTile";

async function tilesetTraversalDemo(filePath: string) {
  console.log(`Traversing tileset ${filePath}`);

  const directory = path.dirname(filePath);
  const resourceResolver =
    ResourceResolvers.createFileResourceResolver(directory);
  const tileset = await readJsonUnchecked(filePath);

  const tilesetTraverser = new TilesetTraverser(directory, resourceResolver, {
    depthFirst: false,
    traverseExternalTilesets: true,
  });
  await tilesetTraverser.traverse(
    tileset,
    async (traversedTile: TraversedTile) => {
      const contentUris = traversedTile.getFinalContents().map((c) => c.uri);
      const geometricError = traversedTile.asFinalTile().geometricError;
      console.log(
        `  Traversed tile: ${traversedTile}, ` +
          `path: ${traversedTile.path}, ` +
          `contents [${contentUris}], ` +
          `geometricError ${geometricError}`
      );
      return true;
    }
  );
  console.log("Traversing tileset DONE");
}

async function runBasicDemo() {
  const tilesetFileName = "./specs/data/TilesetWithUris/tileset.json";
  await tilesetTraversalDemo(tilesetFileName);
}

async function runExternalDemo() {
  const tilesetFileName = "./specs/data/TilesetOfTilesetsWithUris/tileset.json";
  await tilesetTraversalDemo(tilesetFileName);
}

async function runDemo() {
  await runBasicDemo();
  await runExternalDemo();
}

runDemo();
