import BoxSlot from "./BoxSlot";
import { Group, Stack } from "@mantine/core";

export default function TeamDisplay() {
  return (
    <Stack>
      <Group>
        <BoxSlot key={1} pokemon1={null} pokemon2={null} />
        <BoxSlot key={2} pokemon1={null} pokemon2={null} />
        <BoxSlot key={3} pokemon1={null} pokemon2={null} />
      </Group>
      <Group>
        <BoxSlot key={4} pokemon1={null} pokemon2={null} />
        <BoxSlot key={5} pokemon1={null} pokemon2={null} />
        <BoxSlot key={6} pokemon1={null} pokemon2={null} />
      </Group>
    </Stack>
  );
}
