import {
  Image,
  Group,
  Stack,
  Text,
  FileButton,
  Button,
  TextInput,
  ActionIcon,
  FocusTrap,
} from "@mantine/core";
import { readFile } from "../../util/uploadFile";
import { TRAINER_SPRITE_MAP } from "../../data/sprites";
import { useContext, useState } from "react";
import { RunContext, WebSocketContext } from "../RunPage";
import { useHover } from "@mantine/hooks";
import { FaCheck, FaEdit } from "react-icons/fa";
import "./PlayerProfile.css";

interface ComponentProps {
  ref_id: string;
}

export default function PlayerProfile(props: ComponentProps) {
  const ws = useContext(WebSocketContext);
  const { runData } = useContext(RunContext);
  const [isEditing, setIsEditing] = useState(false);
  const { hovered, ref } = useHover();

  const player = runData.players.find((p) => p.ref_id === props.ref_id);
  const initialName = player ? player.name : "Trainer";
  const [name, setName] = useState(initialName);

  async function updateFile(file: File | null) {
    if (!file) return;
    const saveData = await readFile(file);
    if (!saveData || !saveData.data?.trainedId) return;
    const updatedTrainer = {
      ref_id: props.ref_id,
      trainer_id: saveData.data.trainedId,
    };
    ws.sendMessage({
      updated_trainer: updatedTrainer,
    });
  }

  const handleSave = () => {
    const updatedTrainer = {
      ref_id: props.ref_id,
      name: name,
    };
    ws.sendMessage({
      updated_trainer: updatedTrainer,
    });
    setIsEditing(false);
  };

  const nameProps = {
    fz: "3rem",
    fw: 600,
  };
  const inputStyles = {
    input: {
      fontSize: "3rem",
      fontWeight: 600,
      width: `${Math.max(name.length - 1, 5)}ch`,
    },
  };

  return (
    <Group>
      <Image src={TRAINER_SPRITE_MAP["30"]} w={200} h={200} />
      <Stack>
        {isEditing ? (
          <Group>
            <FocusTrap active={isEditing}>
              <TextInput
                variant="unstyled"
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
                styles={inputStyles}
                size="xl"
              />
            </FocusTrap>
            <ActionIcon onClick={handleSave} variant="transparent">
              <FaCheck size={18} />
            </ActionIcon>
          </Group>
        ) : (
          <Group ref={ref} className="trainer-name-container">
            <Text {...nameProps} onClick={() => setIsEditing(true)}>
              {name}
            </Text>
            {
              <ActionIcon
                onClick={() => setIsEditing(true)}
                variant="transparent"
                size={24}
                opacity={hovered ? 1 : 0}
              >
                <FaEdit size={16} />
              </ActionIcon>
            }
          </Group>
        )}
        <FileButton onChange={updateFile} accept=".sav">
          {(props) => (
            <Button {...props} w={200}>
              Upload .sav
            </Button>
          )}
        </FileButton>
      </Stack>
    </Group>
  );
}
