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

  trainerId = Math.max(1, trainerId);

  let speciesId =
    POKEMON_SPECIES_IDS[pokemonName as keyof typeof POKEMON_SPECIES_IDS];
  console.log(pokemonName + ": " + speciesId);

  let index =
    (speciesId * (trainerId & 0xffff)) % ALLOWED_POKEMON_SCALED.length;
  console.log(
    `(${speciesId} * (${trainerId} & 0xffff)) % ${ALLOWED_POKEMON_SCALED.length}) = ${index}`
  );

  return ALLOWED_POKEMON_SCALED[index];
}
