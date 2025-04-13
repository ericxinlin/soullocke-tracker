import { useLoaderData } from "react-router";
import { Container, Group, Stack, Text } from "@mantine/core";
import { Link } from "react-router";
import Timeline from "./Timeline";
import RunData from "../models/run";
import PlayerProfile from "./PlayerProfile";
import { useWebSocket, IWebSocketContext } from "../util/useWebsocket";
import { createContext } from "react";

export const WebSocketContext = createContext<IWebSocketContext>({
  messages: [],
  sendMessage: () => {},
  socket: null,
});

export const RunContext = createContext<RunData>({
  id_string: "",
  players: [
    { name: "Player 1", trainer_id: 0 },
    { name: "Player 2", trainer_id: 0 },
  ],
  encounters: [],
});

export default function RunPage() {
  let data: RunData = useLoaderData();

  const url = `/ws/update/${data.id_string}`;
  const wsContext: IWebSocketContext = useWebSocket(url);

  return (
    <WebSocketContext value={wsContext}>
      <RunContext value={data}>
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
