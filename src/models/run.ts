import { ObjectId } from "mongodb";

export default class Run {
  constructor(
    public url: string,
    public players: Player[],
    public runData: Object,
    public id?: ObjectId
  ) {}
}

type Player = {
  name: string;
  trainerId: number;
};
