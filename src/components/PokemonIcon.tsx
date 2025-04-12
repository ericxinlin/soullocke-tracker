import { Tooltip, Image, MantineStyleProp } from "@mantine/core";
import { POKEMON_SPECIES_IDS } from "../data/pokemon";
import { POKEMON_SPRITE_MAP } from "../data/sprites";

interface ComponentProps {
  pokemon: string | null;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  style?: MantineStyleProp;
}

export default function PokemonIcon(props: ComponentProps) {
  let id =
    POKEMON_SPECIES_IDS[props.pokemon as keyof typeof POKEMON_SPECIES_IDS];
  id = id ?? 0;
  let src =
    POKEMON_SPRITE_MAP[id.toString() as keyof typeof POKEMON_SPRITE_MAP];
  return (
    <Tooltip label={props.pokemon} withArrow>
      <Image w={50} src={src} onClick={props.onClick} style={props.style} />
    </Tooltip>
  );
}
