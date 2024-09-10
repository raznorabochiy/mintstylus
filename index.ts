import cli from "cli";
import { Wallet } from "ethers";
import random from "lodash/random";
import shuffle from "lodash/shuffle";
import { DELAY, KEYS_FILENAME, SHUFFLE_KEYS } from "./constants";
import { mint } from "./mint";
import { delayProgress, loadFromFile } from "./utils";

let keys = await loadFromFile(KEYS_FILENAME);

if (SHUFFLE_KEYS) {
  keys = shuffle(keys);
}

for (const key of keys) {
  const { address } = new Wallet(key);
  console.log(`===== Address: ${address} ======`);

  try {
    await mint(key);
  } catch (e) {
    cli.spinner("", true);
    console.log("Ошибка:", e.message);
  }

  const [delayFrom, delayTo] = DELAY;
  const delayTimeout = random(delayFrom, delayTo);
  await delayProgress(delayTimeout);
}
