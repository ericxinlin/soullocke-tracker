export default class RunData {
  constructor(
    public id_string: string,
    public players: Player[],
    public encounters: Encounter[],
    public created_at: Date,
    public updated_at: Date
  ) {}
}

type Player = {
  name: string;
  trainer_id: number;
};

type Encounter = {
  trainer: Player;
  location: string;
  pokemon: string;
  status: PokemonStatus;
  note: string;
};

enum PokemonStatus {
  Captured,
  Dead,
  InTeam,
}
