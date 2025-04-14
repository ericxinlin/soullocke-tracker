import { useLoaderData } from "react-router";
import { Container, Group, Stack, Text } from "@mantine/core";
import { Link } from "react-router";
import Timeline from "./Timeline";
import RunData, { UpdateRunDto } from "../models/run";
import PlayerProfile from "./PlayerProfile";
import { useWebSocket, IWebSocketContext } from "../util/useWebSocket";
import { createContext, useReducer, useEffect } from "react";
import { RunAction, runReducer } from "../util/runReducer";

export const WebSocketContext = createContext<IWebSocketContext>({
  messages: [],
  sendMessage: () => {},
  clearMessages: () => {},
  socket: null,
});

export const RunContext = createContext<{
  runData: RunData;
  dispatch: React.Dispatch<RunAction>;
}>({
  runData: {
    id_string: "",
    players: [
      { name: "Player 1", trainer_id: 0 },
      { name: "Player 2", trainer_id: 0 },
    ],
    encounters: [],
  },
  dispatch: () => {},
});

export default function RunPage() {
  let data: RunData = useLoaderData();

  const [runData, dispatch] = useReducer(runReducer, data);

  const url = `/ws/update/${data.id_string}`;
  const wsContext: IWebSocketContext = useWebSocket(url);

  useEffect(() => {
    if (wsContext.messages.length === 0) return;
    wsContext.messages.forEach((message) => {
      console.log("Received message:", message);
      const dto: UpdateRunDto = message.data;
      if (!dto) return;
      if (dto.delete_encounter) {
        dispatch({
          type: "DELETE_ENCOUNTER",
          payload: dto.delete_encounter,
        });
      }
      if (dto.updated_encounter) {
        dispatch({
          type: "UPDATE_ENCOUNTER",
          payload: dto.updated_encounter,
        });
      }
    });
    wsContext.clearMessages();
  }, [wsContext.messages]);

  return (
    <WebSocketContext value={wsContext}>
      <RunContext value={{ runData, dispatch }}>
        <Stack>
          <Group px={20}>
            <Link to="/">
              <Text
                ta="center"
                fw={400}
                style={{ fontSize: "4rem", fontFamily: "'Jersey 25'" }}
                variant="gradient"
                gradient={{ from: "#7E6363", to: "#A87C7C", deg: 210 }}
              >
                Soullocke Tracker
              </Text>
            </Link>
          </Group>
          <Group justify="center">
            <PlayerProfile />
          </Group>
          <Container w="67%">
            <Timeline />
          </Container>
        </Stack>
      </RunContext>
    </WebSocketContext>
  );
}
