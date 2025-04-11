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
  Button,
} from "@mantine/core";
import {
  ALLOWED_POKEMON_LIST,
  POKEMON_SPECIES_IDS,
  keyToName,
} from "../../data/pokemon";
import { SPRITE_MAP } from "../../data/sprites";

interface ComponentProps {
  trainerId: number;
  originalPokemon: string[];
}

export default function RoutePanel(props: ComponentProps) {
  return (
    <Group justify="center">
      <RoutePanelOneSide {...props} />
      <Divider orientation="vertical" />
      <RoutePanelOneSide {...props} />
    </Group>
  );
}

function RoutePanelOneSide(props: ComponentProps) {
  let pokemon = props.originalPokemon;
  if (props.trainerId) {
    pokemon = pokemon.map((poke) => {
      let newMon = mapPokemon(props.trainerId, poke) ?? "";
      console.log(newMon);
      return newMon;
    });
  }

  const items = pokemon.map((poke, i) => {
    console.log(poke);
    let id = POKEMON_SPECIES_IDS[poke as keyof typeof POKEMON_SPECIES_IDS];
    id = id ?? 0;
    let src = SPRITE_MAP[id.toString() as keyof typeof SPRITE_MAP];
    return <Image w={50} key={i} src={src} />;
  });

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    let id =
      POKEMON_SPECIES_IDS[option.label as keyof typeof POKEMON_SPECIES_IDS];
    let src = SPRITE_MAP[id.toString() as keyof typeof SPRITE_MAP];
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
      />
      <SimpleGrid cols={5} w="100%" verticalSpacing="xs">
        {items}
      </SimpleGrid>
    </Stack>
  );
}
