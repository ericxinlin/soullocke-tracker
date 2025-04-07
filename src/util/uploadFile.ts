// https://github.com/JwowSquared/Radical-Red-Pokedex

export { readFile };

export type { SaveData };

async function readFile(file: File): Promise<SaveData | null> {
  if (file) {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);
    const result: SaveData = readDataFromSaveFile(view);
    if (!result.valid) {
      alert(
        "Unable to read save data. Please ensure you've selected a save and not a save state (Most likely a .sav file)"
      );
      return null;
    }
    localStorage.setItem("saveData", JSON.stringify(result));
    return result;
  }
  return null;
}

function readDataFromSaveFile(file: DataView): SaveData {
  for (let sectorId = 0; sectorId < 14; sectorId++) {
    if (findSector(file, sectorId) == -1) {
      return {
        valid: false,
        data: null,
      };
    }
  }

  const trainerInfo = findSector(file, 0x0);
  const trainedId = file.getUint32(trainerInfo + TRAINED_ID_OFFSET, true);
  let name = "";
  for (let idx = 0; idx < 8; idx++) {
    const char = file.getUint8(trainerInfo + NAME_OFFSET + idx);
    if (char == 0xff) {
      break;
    }
    name += CHARACTER_ENCODINGS[char];
  }

  const scaledBitflag = file.getUint8(trainerInfo + SCALED_SPECIES_BITFLAG);
  const scaledSpecies = (scaledBitflag & 0x4) > 0;
  const randomBitFlag = file.getUint8(
    trainerInfo + NORMAL_SPECIES_LEARNSET_ABILITY_BITFLAG
  );
  const normalSpecies = (randomBitFlag & 0x1) > 0;
  const learnset = (randomBitFlag & 0x2) > 0;
  const abilities = (randomBitFlag & 0x4) > 0;

  const gameSpecificData = findSector(file, 0x4);
  const hardmodeBitflag = file.getUint8(gameSpecificData + HARDMODE_BITFLAG);
  const hardmode = (hardmodeBitflag & 0x10) > 0;
  const restrictedBitFlag = file.getUint8(
    gameSpecificData + RESTRICTED_BITFLAG
  );
  const restricted = (restrictedBitFlag & 0x40) > 0;

  return {
    valid: true,
    data: {
      name,
      trainedId,
      restricted,
      hardmode,
      random: {
        abilities,
        learnset,
        normalSpecies,
        scaledSpecies,
      },
    },
  };
}

function findSector(file: DataView, id: number) {
  let latestOffset = -1;
  let latestSaveIndex = -1;
  for (let x = 0x0; x < 0x1c000; x += 0x1000) {
    const sectorId = file.getUint16(x + 0xff4, true);
    const saveIndex = file.getUint32(x + 0xffc, true);
    if (sectorId === id && saveIndex > latestSaveIndex) {
      latestOffset = x;
      latestSaveIndex = saveIndex;
    }
  }

  return latestOffset;
}

type SaveData = {
  valid: boolean;
  data: null | {
    name: string;
    trainedId: number;
    restricted: boolean;
    hardmode: boolean;
    random: {
      abilities: boolean;
      learnset: boolean;
      normalSpecies: boolean;
      scaledSpecies: boolean;
    };
  };
};

const CHARACTER_ENCODINGS = [
  " ",
  "À",
  "Á",
  "Â",
  "Ç",
  "È",
  "É",
  "Ê",
  "Ë",
  "Ì",
  "",
  "Î",
  "Ï",
  "Ò",
  "Ó",
  "Ô",
  "Œ",
  "Ù",
  "Ú",
  "Û",
  "Ñ",
  "ß",
  "à",
  "á",
  "",
  "ç",
  "è",
  "é",
  "ê",
  "ë",
  "ì",
  "",
  "î",
  "ï",
  "ò",
  "ó",
  "ô",
  "œ",
  "ù",
  "ú",
  "û",
  "ñ",
  "º",
  "ª",
  "ᵉʳ",
  "&",
  "+",
  "",
  "",
  "",
  "",
  "",
  "Lv",
  "=",
  ";",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "▯",
  "¿",
  "¡",
  "PK",
  "MN",
  "PO",
  "Ké",
  "",
  "",
  "",
  "Í",
  "%",
  "(",
  ")",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  "",
  "",
  "",
  "â",
  "",
  "",
  "",
  "",
  "",
  "",
  "í",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "↑",
  "↓",
  "←",
  "→",
  "*",
  "*",
  "*",
  "*",
  "*",
  "*",
  "*",
  "ᵉ",
  "<",
  ">",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "ʳᵉ",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "!",
  "?",
  ".",
  "-",
  "･",
  "…",
  "“",
  "”",
  "‘",
  "’",
  "♂",
  "♀",
  "$",
  ",",
  "×",
  "/",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "►",
  ":",
  "Ä",
  "Ö",
  "Ü",
  "ä",
  "ö",
  "ü",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

const NAME_OFFSET = 0x000;
const TRAINED_ID_OFFSET = 0x00a;
// RAM 0203B25A 0x10 = Hardmode
// RAM 0203B25A 0x04 = MGM
const HARDMODE_BITFLAG = 0xdb2;
// RAM 0203B26B 0x40 = Restricted
const RESTRICTED_BITFLAG = 0xdc3;
// RAM 0203B17B 0x04 = Scaled species
const SCALED_SPECIES_BITFLAG = 0xf2b;
// RAM 0203B17C 0x1 = Normal species
// RAM 0203B17C 0x2 = Learnset
// RAM 0203B17C 0x4 = Ability
const NORMAL_SPECIES_LEARNSET_ABILITY_BITFLAG = 0xf2c;
