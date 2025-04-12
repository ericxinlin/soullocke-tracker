import { Accordion, Center, Group, Text } from "@mantine/core";
import { POKEMON_ROUTE_DATA, RouteData } from "../../data/routes";
import RoutePanel from "./RoutePanel";
import PokemonIcon from "../PokemonIcon";
import { useState } from "react";

interface ComponentProps {
  trainerId_1: number;
  trainerId_2: number;
}

export default function RouteList(props: ComponentProps) {
  const items = POKEMON_ROUTE_DATA.map((route) => (
    <AccordionItem
      route={route}
      trainerId_1={props.trainerId_1}
      trainerId_2={props.trainerId_2}
    />
  ));

  return (
    <Center>
      <Accordion w="100%" variant="separated">
        {items}
      </Accordion>
    </Center>
  );
}

interface AccordionItemProps {
  route: RouteData;
  trainerId_1: number;
  trainerId_2: number;
}

function AccordionItem(props: AccordionItemProps) {
  const route = props.route;
  const [selectedPokemon1, setSelectedPokemon1] = useState<string | null>(null);
  const [selectedPokemon2, setSelectedPokemon2] = useState<string | null>(null);

  return (
    <Accordion.Item key={route.location} value={route.location}>
      <Accordion.Control>
        <AccordionLabel
          location={route.location}
          pokemon1={selectedPokemon1}
          pokemon2={selectedPokemon2}
        />
      </Accordion.Control>
      <Accordion.Panel>
        <RoutePanel
          trainerId_1={props.trainerId_1}
          trainerId_2={props.trainerId_2}
          originalPokemon={route.encounters}
          selectedPokemon1={selectedPokemon1}
          selectedPokemon2={selectedPokemon2}
          setSelectedPokemon1={setSelectedPokemon1}
          setSelectedPokemon2={setSelectedPokemon2}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
}

interface AccordionLabelProps {
  location: string;
  pokemon1: string | null;
  pokemon2: string | null;
}

function AccordionLabel(props: AccordionLabelProps) {
  return (
    <Group justify="space-between">
      <Text>{props.location}</Text>
      <Group mr={20} gap="xs">
        <PokemonIcon
          pokemon={props.pokemon1}
          style={props.pokemon1 === null ? { opacity: 0 } : {}}
        />
        <PokemonIcon
          pokemon={props.pokemon2}
          style={props.pokemon2 === null ? { opacity: 0 } : {}}
        />
      </Group>
    </Group>
  );
}
