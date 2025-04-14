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
import { useContext } from "react";
import { WebSocketContext, RunContext } from "../RunPage";
import { PokemonStatus } from "../../models/run";

interface ComponentProps {
  location: string;
  originalPokemon: string[];
  selectedPokemon1: string | null;
  selectedPokemon2: string | null;
  setSelectedPokemon1: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedPokemon2: React.Dispatch<React.SetStateAction<string | null>>;
}

interface OneSideProps {
  trainerIndex: number;
  location: string;
  originalPokemon: string[];
  selectedPokemon: string | null;
  setSelectedPokemon: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function RoutePanel(props: ComponentProps) {
  return (
    <Group justify="center" gap="xl">
      <RoutePanelOneSide
        trainerIndex={0}
        location={props.location}
        originalPokemon={props.originalPokemon}
        selectedPokemon={props.selectedPokemon1}
        setSelectedPokemon={props.setSelectedPokemon1}
      />
      <Divider orientation="vertical" />
      <RoutePanelOneSide
        trainerIndex={1}
        location={props.location}
        originalPokemon={props.originalPokemon}
        selectedPokemon={props.selectedPokemon2}
        setSelectedPokemon={props.setSelectedPokemon2}
      />
    </Group>
  );
}

function RoutePanelOneSide(props: OneSideProps) {
  const ws = useContext(WebSocketContext);
  const { runData } = useContext(RunContext);
  let player = runData.players[props.trainerIndex];
  let trainerId = player.trainer_id;
  let player_ref = player.ref_id;

  let pokemon = props.originalPokemon;
  if (trainerId) {
    pokemon = pokemon.map((poke) => {
      let newMon = mapPokemon(trainerId, poke) ?? "";
      return newMon;
    });
  }

  function updateSelectedPokemon(pokemon: string | null) {
    if (pokemon === props.selectedPokemon || pokemon === null) {
      props.setSelectedPokemon(null);
      ws.sendMessage({
        delete_encounter: { player_ref: player_ref, location: props.location },
      });
    } else {
      props.setSelectedPokemon(pokemon);
      ws.sendMessage({
        updated_encounter: {
          player_ref: player_ref,
          location: props.location,
          pokemon: pokemon,
          status: PokemonStatus.Captured,
        },
      });
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
