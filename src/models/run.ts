export default class RunData {
  constructor(
    public id_string: string,
    public players: Player[],
    public encounters: Encounter[],
    public created_at?: Date,
    public updated_at?: Date
  ) {}
}

type Player = {
  name: string;
  trainer_id: number;
  ref_id: string;
};

export type Encounter = {
  player_ref: string;
  location: string;
  pokemon: string;
  status: PokemonStatus;
  note?: string;
};

export enum PokemonStatus {
  Captured,
  Dead,
  InTeam,
}

export interface UpdateRunDto {
  delete_encounter?: DeleteEncounterDto;
  updated_encounter?: Encounter;
  updated_trainer?: UpdateTrainerDto;
}

export interface DeleteEncounterDto {
  player_ref: string;
  location: string;
}

export interface UpdateTrainerDto {
  ref_id: string;
  name?: string;
  trainer_id?: number;
}
