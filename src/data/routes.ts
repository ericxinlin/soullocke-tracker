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
    ],
  },
];

export type RouteData = {
  location: string;
  encounters: string[];
};
