import { mapPokemon } from "../../util/mapPokemon";
import {
  Image,
  SimpleGrid,
  Group,
  Divider,
  Select,
  Stack,
  SelectProps,
  Text,
} from "@mantine/core";
import { POKEMON_SPECIES_IDS } from "../../data/pokemon";
import { POKEMON_SPRITE_MAP } from "../../data/sprites";
import PokemonIcon from "../PokemonIcon";

interface ComponentProps {
  trainerId_1: number;
  trainerId_2: number;
  originalPokemon: string[];
  selectedPokemon1: string | null;
  selectedPokemon2: string | null;
  setSelectedPokemon1: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedPokemon2: React.Dispatch<React.SetStateAction<string | null>>;
}

interface OneSideProps {
  trainerId: number;
  originalPokemon: string[];
  selectedPokemon: string | null;
  setSelectedPokemon: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function RoutePanel(props: ComponentProps) {
  return (
    <Group justify="center" gap="xl">
      <RoutePanelOneSide
        trainerId={props.trainerId_1}
        originalPokemon={props.originalPokemon}
        selectedPokemon={props.selectedPokemon1}
        setSelectedPokemon={props.setSelectedPokemon1}
      />
      <Divider orientation="vertical" />
      <RoutePanelOneSide
        trainerId={props.trainerId_2}
        originalPokemon={props.originalPokemon}
        selectedPokemon={props.selectedPokemon2}
        setSelectedPokemon={props.setSelectedPokemon2}
      />
    </Group>
  );
}

function RoutePanelOneSide(props: OneSideProps) {
  let pokemon = props.originalPokemon;
  if (props.trainerId) {
    pokemon = pokemon.map((poke) => {
      let newMon = mapPokemon(props.trainerId, poke) ?? "";
      console.log(newMon);
      return newMon;
    });
  }

  function updateSelectedPokemon(pokemon: string | null) {
    if (pokemon === props.selectedPokemon) {
      props.setSelectedPokemon(null);
    } else {
      props.setSelectedPokemon(pokemon);
    }
  }

  const items = pokemon.map((poke, i) => {
    return (
      <PokemonIcon
        key={i}
        pokemon={poke}
        onClick={() => updateSelectedPokemon(poke)}
        style={
          poke === props.selectedPokemon
            ? {
                filter:
                  "drop-shadow(0 0 1px lightgray)" +
                  "drop-shadow(0 0 1px lightgray)" +
                  "drop-shadow(0 0 1px lightgray)" +
                  "drop-shadow(0 0 1px lightgray)" +
                  "drop-shadow(0 0 1px lightgray)",
              }
            : {}
        }
      />
    );
  });

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    let id =
      POKEMON_SPECIES_IDS[option.label as keyof typeof POKEMON_SPECIES_IDS];
    let src =
      POKEMON_SPRITE_MAP[id.toString() as keyof typeof POKEMON_SPRITE_MAP];
    return (
      <Group gap="xs">
        <Image w={25} key={option.label} src={src} />
        <Text c={checked ? "blue" : ""}>{option.label}</Text>
      </Group>
    );
  };

  return (
    <Stack>
      <Select
        w="auto"
        placeholder="Search"
        searchable
        clearable
        limit={10}
        data={Object.keys(POKEMON_SPECIES_IDS)}
        renderOption={renderSelectOption}
        onChange={(poke) => updateSelectedPokemon(poke)}
      />
      <SimpleGrid cols={5} w="100%" verticalSpacing="xs">
        {items}
      </SimpleGrid>
    </Stack>
  );
}
