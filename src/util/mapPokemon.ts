import {
  ALLOWED_POKEMON_LIST,
  POKEMON_SPECIES_IDS,
  ALLOWED_POKEMON_SCALED,
} from "../data/pokemon";

export function mapPokemon(
  trainerId: number,
  pokemonName: string
): string | null {
  if (!Object.keys(POKEMON_SPECIES_IDS).includes(pokemonName)) {
    return null;
  }
  const UINT32_MAX = 4_294_967_296;

  trainerId = Math.max(1, trainerId);

  let speciesId =
    POKEMON_SPECIES_IDS[pokemonName as keyof typeof POKEMON_SPECIES_IDS];
  console.log(pokemonName + ": " + speciesId);

  let product = speciesId * trainerId;
  let overflow = product % UINT32_MAX;
  let index = overflow % ALLOWED_POKEMON_LIST.length;
  console.log(
    `((${speciesId} * ${trainerId}) % UINT32_MAX) % ${ALLOWED_POKEMON_LIST.length}) = ${index}`
  );

  return ALLOWED_POKEMON_LIST[index];
}
