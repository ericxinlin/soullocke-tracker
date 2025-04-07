import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import SaveUpload from "./components/SaveUpload";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <SaveUpload />
    </MantineProvider>
  );
}
