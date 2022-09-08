import React, { Suspense } from "react";
import { useSelector } from "@xstate/react";
import {
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

const Provider: React.FC = ({ children }) => (
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

// const Stats = ({orientation = "horizontal"}: {orientation?: "vertical" | "horizontal"}) => {
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
  const active = useSelector(inputs, ({ context }) => context.active);

  React.useEffect(() => console.info("inputs", inputs), [inputs]);

  const showControlsModal = useControlsModal(inputs as any);

  React.useEffect(() => {
    playerService.send("START");
    return () => {
      closeAllModals();
      playerService.send("STOP");
    };
  }, [inputs]);

  return (
    <Provider>
      <Center my="xl">
        <Group>
          <Button
            onClick={() => playerService.send(active ? "STOP" : "START")}
            color={active ? "green" : "yellow"}
          >
            {active ? "Stop" : "Start"} inputs
          </Button>
          <Button onClick={showControlsModal}>Show Controls</Button>
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
