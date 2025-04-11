import { Accordion, Center } from "@mantine/core";
import { POKEMON_ROUTE_DATA } from "../../data/routes";
import RoutePanel from "./RoutePanel";

export default function RouteList() {
  const items = POKEMON_ROUTE_DATA.map((route) => (
    <Accordion.Item key={route.location} value={route.location}>
      <Accordion.Control>{route.location}</Accordion.Control>
      <Accordion.Panel>
        <RoutePanel trainerId={2397798450} originalPokemon={route.encounters} />
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
