import React, { Suspense } from "react";
import { useSelector } from "@xstate/react";
import {
  ActionIcon,
  Badge,
  Button,
  Center,
  ColorSchemeProvider,
  Container,
  Divider,
  Group,
  MantineProvider,
  Stack,
} from "@mantine/core";
import { closeAllModals, ModalsProvider } from "@mantine/modals";
import { CanvasRoot } from "./components/threejs";

// import service, { playerService } from "./state";
import { playerService } from "./state";
import { useControlsModal } from "./hooks/use-controls-modal";
import { Keyboard, Mouse, TableAlias } from "tabler-icons-react";
import { TControllerType } from "./machines/configuration/configuration.types";

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

function evalPercent(current: number, max: number, reverse = false) {
  return ((current / max) * 100 * (reverse ? -1 : 1)).toFixed(2);
}

const Stats = ({ vertical = false }: { vertical?: boolean }) => {
  const playerState = useSelector(playerService, ({ context }) => context.values);
  const velocity = useSelector(playerState, ({ context }) => context.velocity);
  const settings = useSelector(playerState, ({ context }) => context.settings);

  const Wrapper = vertical ? React.Fragment : Center;
  const Inner = vertical ? Stack : Group;
  const Splitter = vertical ? <Divider my="xl" /> : <Divider orientation="vertical" mx="xl" />;

  return (
    <Wrapper>
      <Inner>
        <Badge size="lg" radius="sm" leftSection="F">
          {evalPercent(velocity.forward, settings.forward.max, true)}%
        </Badge>
        <Badge size="lg" radius="sm" leftSection="S">
          {evalPercent(velocity.left, settings.left.max)}%
        </Badge>
        <Badge size="lg" radius="sm" leftSection="V">
          {evalPercent(velocity.up, settings.up.max)}%
        </Badge>
      </Inner>
      {Splitter}
      <Inner>
        <Badge color="teal" size="lg" radius="sm" leftSection="P">
          {evalPercent(velocity.pitch, settings.pitch.max, true)}%
        </Badge>
        <Badge color="teal" size="lg" radius="sm" leftSection="Y">
          {evalPercent(velocity.yaw, settings.yaw.max)}%
        </Badge>
        <Badge color="teal" size="lg" radius="sm" leftSection="R">
          {evalPercent(velocity.roll, settings.roll.max)}%
        </Badge>
      </Inner>
    </Wrapper>
  );
};

export default function App() {
  const inputs = useSelector(playerService, ({ context }) => context.inputs);
  const active = useSelector(inputs, (state) => state.matches('active'));
  const controllers = useSelector(inputs, ({ context }) => context.controllers);

  const showControlsModal = useControlsModal(inputs as any);

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
        <Stats />
      </Center>

      <Container size="xl" my="xl" sx={{ minHeight: 500, height: "75%" }}>
        <Suspense fallback={null}>
          <CanvasRoot />
        </Suspense>
      </Container>
    </Provider>
  );
}
