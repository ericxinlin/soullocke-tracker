import { useParams } from "react-router";
import { Container, Group, Stack, Text } from "@mantine/core";
import { Link } from "react-router";
import Timeline from "./Timeline";
import RunData, { UpdateRunDto } from "../models/run";
import PlayerProfile from "./PlayerProfile/PlayerProfile";
import { useWebSocket, IWebSocketContext } from "../util/useWebSocket";
import { createContext, useReducer, useEffect } from "react";
import { handleEvents, RunAction, runReducer } from "../util/runReducer";
import { useNavigate } from "react-router";

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
      { name: "Player 1", trainer_id: 0, ref_id: "0" },
      { name: "Player 2", trainer_id: 0, ref_id: "1" },
    ],
    encounters: [],
  },
  dispatch: () => {},
});

export default function RunPage() {
  const { runId } = useParams<{ runId: string }>();
  const data: RunData = {
    id_string: "",
    players: [
      { name: "Player 1", trainer_id: 0, ref_id: "0" },
      { name: "Player 2", trainer_id: 0, ref_id: "1" },
    ],
    encounters: [],
  };

  const navigate = useNavigate();
  const [runData, dispatch] = useReducer(runReducer, data);

  useEffect(() => {
    async function fetchRunData() {
      try {
        const response = await fetch(`/api/run/${runId}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          dispatch({
            type: "SET_RUN_DATA",
            payload: data,
          });
        } else {
          console.error("Error fetching run data");
        }
      } catch (err) {
        console.error("Error fetching run data", err);
        navigate("/error");
      }
    }
    fetchRunData();
  }, []);

  const url = `/ws/update/${runId}`;
  const wsContext: IWebSocketContext = useWebSocket(url);

  useEffect(() => {
    if (wsContext.messages.length === 0) return;
    wsContext.messages.forEach((message) => {
      console.log("Received message:", message);
      const dto: UpdateRunDto = message.data;
      handleEvents(dto, dispatch);
    });
    wsContext.clearMessages();
  }, [wsContext.messages]);

  const players = runData.players.map((player) => (
    <PlayerProfile ref_id={player.ref_id} key={player.ref_id} />
  ));

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
          <Group justify="center">{players}</Group>
          <Container w="67%">
            <Timeline />
          </Container>
        </Stack>
      </RunContext>
    </WebSocketContext>
  );
}
