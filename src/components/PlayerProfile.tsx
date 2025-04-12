import { Image, Group, Stack, Text, FileButton, Button } from "@mantine/core";
import { readFile } from "../util/uploadFile";
import { TRAINER_SPRITE_MAP } from "../data/sprites";

export default function PlayerProfile() {
  async function updateFile(file: File | null) {
    if (!file) return 0;
    const saveData = await readFile(file);
    if (!saveData) return 0;
  }

  return (
    <Group>
      <Image src={TRAINER_SPRITE_MAP["30"]} w={200} h={200} />
      <Stack>
        <Text fz="3rem" fw={600}>
          Trainer 1
        </Text>
        <FileButton onChange={updateFile} accept="application/octet-stream">
          {(props) => <Button {...props}>Upload .sav</Button>}
        </FileButton>
      </Stack>
    </Group>
  );
}
