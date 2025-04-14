import RunData, { Encounter, DeleteEncounterDto } from "../models/run";

export type RunAction =
  | { type: "SET_RUN_DATA"; payload: RunData }
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
          encounter.player_ref === updatedEncounter.player_ref
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
            encounter.player_ref === deleteDto.player_ref
          )
      );
      return { ...state, encounters: newEncounters };
    }
    case "SET_RUN_DATA":
      return action.payload;
    default:
      return state;
  }
}
