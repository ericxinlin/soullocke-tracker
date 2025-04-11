import {
  Image,
  Center,
  Code,
  Stack,
  Text,
  UnstyledButton,
  Group,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  async function createRun() {
    let res = await fetch("/api/createrun", { method: "POST" });
    if (res.ok) {
      let id = await res.text();
      navigate(`/run/${id}`);
    }
  }

  return (
    <div style={{ height: "100vh", alignContent: "center" }}>
      <Center>
        <Stack align="center">
          <Text
            ta="center"
            fw={400}
            style={{ fontSize: "5rem", fontFamily: "'Jersey 25'" }}
            variant="gradient"
            gradient={{ from: "#7E6363", to: "#A87C7C", deg: 210 }}
          >
            Soullocke Tracker
          </Text>
          <Group w="100%" justify="space-evenly">
            <Stack align="center">
              <Image src="../../radical_red_logo.png" w={200} />
              <Text fw={700} fz="lg">
                Version: <Code fz="xl">4.1</Code>
              </Text>
            </Stack>

            <Stack gap={1}>
              {/* CREATE RUN */}
              <UnstyledButton onClick={createRun}>
                <Title order={1} fw={200}>
                  New Run
                </Title>
              </UnstyledButton>
              <UnstyledButton>
                <Title order={1} fw={200}>
                  Continue
                </Title>
              </UnstyledButton>
            </Stack>
          </Group>
        </Stack>
      </Center>
    </div>
  );
}
