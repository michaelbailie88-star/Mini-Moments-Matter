// All 27 activity stories — canonical content files imported at build time.
// Definitions live in ../../content/stories/*.md (copied into the repo).
import adventuresWithMrFrog from "../../content/stories/adventures-with-mr-frog.md?raw";
import animalParade from "../../content/stories/the-animal-parade.md?raw";
import blanketFort from "../../content/stories/the-blanket-fort.md?raw";
import bridgeOfCards from "../../content/stories/the-bridge-of-cards.md?raw";
import colourPaintSplash from "../../content/stories/the-colour-paint-splash.md?raw";
import feelingFaces from "../../content/stories/the-feeling-faces.md?raw";
import firstLittleDrum from "../../content/stories/the-first-little-drum.md?raw";
import firstPaint from "../../content/stories/the-first-paint.md?raw";
import floatingParachute from "../../content/stories/the-floating-parachute.md?raw";
import flowerPaint from "../../content/stories/the-flower-paint.md?raw";
import fossilFinder from "../../content/stories/the-fossil-finder.md?raw";
import grumpyMorning from "../../content/stories/the-grumpy-morning.md?raw";
import littleIceCreamShop from "../../content/stories/the-little-ice-cream-shop.md?raw";
import littleThread from "../../content/stories/the-little-thread.md?raw";
import magicWand from "../../content/stories/the-magic-wand.md?raw";
import magnificentMagnets from "../../content/stories/the-magnificent-magnets.md?raw";
import petalBowling from "../../content/stories/the-petal-bowling.md?raw";
import quietPouringJoy from "../../content/stories/the-quiet-pouring-joy.md?raw";
import readingRace from "../../content/stories/the-reading-race.md?raw";
import sillyFoodFace from "../../content/stories/the-silly-food-face.md?raw";
import spiderInTheSink from "../../content/stories/the-spider-in-the-sink.md?raw";
import sundialStory from "../../content/stories/the-sundial-story.md?raw";
import tinyThings from "../../content/stories/the-tiny-things.md?raw";
import tinyVisitor from "../../content/stories/the-tiny-visitor.md?raw";
import trayOfSeeds from "../../content/stories/the-tray-of-seeds.md?raw";
import veryFirstLaugh from "../../content/stories/the-very-first-laugh.md?raw";
import volcanoThatWokeUp from "../../content/stories/the-volcano-that-woke-up.md?raw";

import { BANDS, FREE_SLUGS, createStoryMap } from "./stories";

export const STORY_MODS: Record<string, string> = {
  "adventures-with-mr-frog": adventuresWithMrFrog,
  "the-animal-parade": animalParade,
  "the-blanket-fort": blanketFort,
  "the-bridge-of-cards": bridgeOfCards,
  "the-colour-paint-splash": colourPaintSplash,
  "the-feeling-faces": feelingFaces,
  "the-first-little-drum": firstLittleDrum,
  "the-first-paint": firstPaint,
  "the-floating-parachute": floatingParachute,
  "the-flower-paint": flowerPaint,
  "the-fossil-finder": fossilFinder,
  "the-grumpy-morning": grumpyMorning,
  "the-little-ice-cream-shop": littleIceCreamShop,
  "the-little-thread": littleThread,
  "the-magic-wand": magicWand,
  "the-magnificent-magnets": magnificentMagnets,
  "the-petal-bowling": petalBowling,
  "the-quiet-pouring-joy": quietPouringJoy,
  "the-reading-race": readingRace,
  "the-silly-food-face": sillyFoodFace,
  "the-spider-in-the-sink": spiderInTheSink,
  "the-sundial-story": sundialStory,
  "the-tiny-things": tinyThings,
  "the-tiny-visitor": tinyVisitor,
  "the-tray-of-seeds": trayOfSeeds,
  "the-very-first-laugh": veryFirstLaugh,
  "the-volcano-that-woke-up": volcanoThatWokeUp,
};

export const STORY_MAP = createStoryMap(STORY_MODS);
export const ALL_STORIES = Object.values(STORY_MAP).sort((a, b) =>
  a.title.localeCompare(b.title)
);
export const FREE_STORIES = ALL_STORIES.filter((s) => FREE_SLUGS.includes(s.slug));
export const CHEST_STORIES = ALL_STORIES.filter((s) => !FREE_SLUGS.includes(s.slug));
export const bandsWithStories = BANDS.map((band) => ({
  band,
  stories: ALL_STORIES.filter((s) => s.band === band.key),
})).filter((b) => b.stories.length > 0);
