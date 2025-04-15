import { Image, Group, Stack, Text, FileButton, Button } from "@mantine/core";
import { readFile } from "../util/uploadFile";
import { TRAINER_SPRITE_MAP } from "../data/sprites";
import { useContext } from "react";
import { WebSocketContext } from "./RunPage";

interface ComponentProps {
  ref_id: string;
}

export default function PlayerProfile(props: ComponentProps) {
  const ws = useContext(WebSocketContext);
  async function updateFile(file: File | null) {
    if (!file) return;
    const saveData = await readFile(file);
    if (!saveData || !saveData.data?.trainedId) return;
    let updatedTrainer = {
      ref_id: props.ref_id,
      trainer_id: saveData.data.trainedId,
    };
    ws.sendMessage({
      updated_trainer: updatedTrainer,
    });
  }

  return (
    <Group>
      <Image src={TRAINER_SPRITE_MAP["30"]} w={200} h={200} />
      <Stack>
        <Text fz="3rem" fw={600}>
          Trainer 1
        </Text>
        <FileButton onChange={updateFile} accept=".sav">
          {(props) => <Button {...props}>Upload .sav</Button>}
        </FileButton>
      </Stack>
    </Group>
  );
}
