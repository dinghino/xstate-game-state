import React, { Suspense } from "react";
import { useSelector } from "@xstate/react";
import {
  ActionIcon,
  Button,
  Center,
  ColorSchemeProvider,
  Container,
  Group,
  MantineProvider,
} from "@mantine/core";
import { closeAllModals, ModalsProvider } from "@mantine/modals";
import { CanvasRoot } from "./components/threejs";

// import service, { playerService } from "./state";
import { playerService } from "./state";
import { useControlsModal } from "./hooks/use-controls-modal";
import { Keyboard, Mouse, TableAlias } from "tabler-icons-react";
import { TControllerType } from "./machines/configuration/configuration.types";
import { usePauseMouse } from "./hooks/use-pause-mouse";
import { VelocityStats } from "./components/VelocityStats";

const Provider: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <ColorSchemeProvider colorScheme="dark" toggleColorScheme={() => null}>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "dark" }}>
      <ModalsProvider>
        <Container id="App" pt="xl" px={0}>
          {children}
        </Container>
      </ModalsProvider>
    </MantineProvider>
  </ColorSchemeProvider>
);

export default function App() {
  const inputs = useSelector(playerService, ({ context }) => context.inputs);
  const state = useSelector(playerService, ({ context }) => context.values);
  const active = useSelector(inputs, (state) => state.matches('active'));
  const controllers = useSelector(inputs, ({ context }) => context.controllers);

  const showControlsModal = useControlsModal(inputs as any);

  usePauseMouse('KeyX')

  React.useEffect(() => {
    inputs.send("START");
    return () => {
      closeAllModals();
      inputs.send("STOP");
    };
  }, []);

  const activeColor = (v?: boolean) => v ? 'green' : 'red'

  const toggleService = React.useCallback(() => {
    inputs.send(active ? "STOP" : "START")
  }, [inputs.send, active]);

  const toggleController = React.useCallback((controller: TControllerType) => {
    inputs.send({ type: "TOGGLE_CONTROLLER", controller, value: !controllers[controller]})
  }, [controllers])

  return (
    <Provider>
      <Center my="xl">
        <Group>
          <ActionIcon
            disabled={!active}
            size="lg" variant="filled"
            onClick={() => toggleController('keyboard')}
            color={activeColor(controllers.keyboard)}
            >
            <Keyboard />
          </ActionIcon>
          <ActionIcon
            disabled={!active}
            size="lg" variant="filled"
            onClick={() => toggleController('mouse')}
            color={activeColor(controllers.mouse)}>
            <Mouse />
          </ActionIcon>
          <Button onClick={toggleService} color={activeColor(active)}>
            {active ? "Running" : "Stopped"}
          </Button>
          <ActionIcon variant="filled" size="lg" onClick={showControlsModal}>
            <TableAlias/>
          </ActionIcon>
        </Group>
      </Center>
      <Center my="xl">
        <VelocityStats />
      </Center>

      <Container size="xl" my="xl" sx={{ minHeight: 500, height: "75%" }}>
        <Suspense fallback={null}>
          <CanvasRoot />
        </Suspense>
      </Container>
    </Provider>
  );
}
