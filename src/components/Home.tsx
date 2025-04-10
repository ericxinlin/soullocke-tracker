import { Image, Center, Code, Stack, Text, Button } from "@mantine/core";

export default function Home() {
  async function pingDb() {
    await fetch("/api/pingdb");
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
          <Stack align="center">
            <Image src="../../radical_red_logo.png" w={200} />
            <Text fw={700} fz="lg">
              Version: <Code fz="xl">4.1</Code>
            </Text>
            <Button onClick={pingDb}>Ping DB</Button>
          </Stack>
        </Stack>
      </Center>
    </div>
  );
}
