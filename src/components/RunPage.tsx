import { useLoaderData } from "react-router";
import { Container, Group, Stack, Text } from "@mantine/core";
import { Link } from "react-router";
import Timeline from "./Timeline";
import RunData from "../models/run";
import PlayerProfile from "./PlayerProfile";

export default function RunPage() {
  let data: RunData = useLoaderData();
  console.log(data);

  return (
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
        <Timeline trainerId_1={2397798450} trainerId_2={0} />
      </Container>
    </Stack>
  );
}
