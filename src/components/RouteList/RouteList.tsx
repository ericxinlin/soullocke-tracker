import { Accordion, Center } from "@mantine/core";
import { POKEMON_ROUTE_DATA } from "../../data/routes";
import RoutePanel from "./RoutePanel";

interface ComponentProps {
  trainerId_1: number;
  trainerId_2: number;
}

export default function RouteList(props: ComponentProps) {
  const items = POKEMON_ROUTE_DATA.map((route) => (
    <Accordion.Item key={route.location} value={route.location}>
      <Accordion.Control>{route.location}</Accordion.Control>
      <Accordion.Panel>
        <RoutePanel
          trainerId_1={props.trainerId_1}
          trainerId_2={props.trainerId_2}
          originalPokemon={route.encounters}
        />
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Center>
      <Accordion w="67%" variant="separated">
        {items}
      </Accordion>
    </Center>
  );
}
