import RunData, { Encounter, DeleteEncounterDto } from "../models/run";

export type RunAction =
  | { type: "UPDATE_ENCOUNTER"; payload: Encounter }
  | { type: "DELETE_ENCOUNTER"; payload: DeleteEncounterDto };

export function runReducer(state: RunData, action: RunAction): RunData {
  switch (action.type) {
    case "UPDATE_ENCOUNTER": {
      // Try to update the encounter: if exists, replace it, otherwise, push it.
      const updatedEncounter = action.payload;
      const index = state.encounters.findIndex(
        (encounter) =>
          encounter.location === updatedEncounter.location &&
          encounter.trainer.name === updatedEncounter.trainer.name &&
          encounter.trainer.trainer_id === updatedEncounter.trainer.trainer_id
      );
      if (index !== -1) {
        const newEncounters = [...state.encounters];
        newEncounters[index] = updatedEncounter;
        return { ...state, encounters: newEncounters };
      } else {
        return {
          ...state,
          encounters: [...state.encounters, updatedEncounter],
        };
      }
    }
    case "DELETE_ENCOUNTER": {
      const deleteDto = action.payload;
      const newEncounters = state.encounters.filter(
        (encounter) =>
          !(
            encounter.location === deleteDto.location &&
            encounter.trainer.name === deleteDto.trainer.name &&
            encounter.trainer.trainer_id === deleteDto.trainer.trainer_id
          )
      );
      return { ...state, encounters: newEncounters };
    }
    default:
      return state;
  }
}
