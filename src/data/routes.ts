export const POKEMON_ROUTE_DATA: RouteData[] = [
  {
    location: "Route 1",
    encounters: [
      "Bidoof",
      "Zigzagoon",
      "Rattata",
      "Mienfoo",
      "Meowth",
      "Yungoos",
      "Pidgey",
      "Smoliv",
      "Pansear",
      "Poochyena",
      "Zigzagoon-Galar",
      "Rattata-Alola",
      "Scraggy",
      "Meowth-Galar",
      "Hoothoot",
      "Seedot",
    ],
  },
  {
    location: "Viridian City",
    encounters: [
      "Shinx",
      "Wooloo",
      "Poochyena",
      "Spearow",
      "Patrat",
      "Cubchoo",
      "Deerling",
      "Greavard",
      "Pikipek",
      "Snover",
      "Pawmi",
      "Mareep",
      "Shuppet",
      "Wattrel",
      "Swinub",
    ],
  },
];

export type RouteData = {
  location: string;
  encounters: string[];
};
