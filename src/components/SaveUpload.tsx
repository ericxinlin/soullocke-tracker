import { useState, useEffect, useRef } from "react";
import { FileButton, Button, Group, Text, TextInput } from "@mantine/core";
import { readFile } from "../util/uploadFile";
import { mapPokemon, mapRoutes } from "../util/mapPokemon";
import { ALLOWED_POKEMON_LIST } from "../data/pokemon";

export default function SaveUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [trainerId, setTrainerId] = useState<string>("");
  const [expected, setExpected] = useState<string>("");
  const [toCheck, setToCheck] = useState<string>("");

  const resetRef = useRef<() => void>(null);
  const clearFile = () => {
    setFile(null);
    resetRef.current?.();
  };

  useEffect(() => {
    if (file) {
      (async () => {
        const result = await readFile(file);
        setTrainerId(result?.data?.trainedId.toString() ?? "");
        if (result?.data?.trainedId) {
          let poke1 = mapPokemon(result?.data?.trainedId, "Chikorita");
          let poke2 = mapPokemon(result?.data?.trainedId, "Totodile");
          let poke3 = mapPokemon(result?.data?.trainedId, "Cyndaquil");

          setExpected(poke1 + ", " + poke2 + ", " + poke3);
        }
      })();
    } else {
      setTrainerId("");
    }
  }, [file]);

  function checkMod() {
    console.log(parseInt(trainerId));
    let species = [152, 158, 155]; // chikorita, totodile, cyndaquil

    for (let i = 1; i < 3000; i++) {
      let current = "";
      species.forEach((id) => {
        let index = (id * (parseInt(trainerId) & 0xffff)) % i;
        current += ALLOWED_POKEMON_LIST[index];
        if (id != 158) current += ", ";
      });
      console.log(`${i}: ${current} | search: ${toCheck}`);
      if (current == toCheck) break;
    }
  }

  function printActual() {
    for (let i = 0; i < ALLOWED_POKEMON_LIST.length; i++) {
      if (ALLOWED_POKEMON_LIST[i] == toCheck) {
        console.log(toCheck + ": " + i);
      }
    }
  }

  function printRoute() {
    console.log(mapRoutes(parseInt(trainerId)));
  }

  return (
    <>
      <Group justify="center">
        <TextInput
          value={toCheck}
          onChange={(event) => setToCheck(event.currentTarget.value)}
        />
        <Button disabled={!file} color="green" onClick={checkMod}>
          Check Mod
        </Button>
        <Button color="blue" onClick={printActual}>
          Print Actual
        </Button>
        <Button color="blue" onClick={printRoute}>
          Print Route
        </Button>
        <FileButton resetRef={resetRef} onChange={setFile} accept="">
          {(props) => <Button {...props}>Upload .sav</Button>}
        </FileButton>
        <Button disabled={!file} color="red" onClick={clearFile}>
          Reset
        </Button>
      </Group>

      {file && (
        <>
          <Text size="sm" ta="center" mt="sm">
            trainer id: {trainerId}
          </Text>
          <Text>{expected}</Text>
        </>
      )}
    </>
  );
}
