import { Accordion, Center, Group, Text } from "@mantine/core";
import { POKEMON_ROUTE_DATA, RouteData } from "../../data/routes";
import RoutePanel from "./RoutePanel";
import PokemonIcon from "../PokemonIcon";
import { useState } from "react";

export default function RouteList() {
  const items = POKEMON_ROUTE_DATA.map((route) => (
    <AccordionItem key={route.location} route={route} />
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
          location={route.location}
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
