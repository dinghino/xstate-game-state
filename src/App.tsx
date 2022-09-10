import React, { Suspense } from "react";
import { useSelector } from "@xstate/react";
import {
  ActionIcon,
  AppShell,
  Button,
  Center,
  ColorSchemeProvider,
  Container,
  Group,
  Header,
  MantineProvider,
  MantineTheme,
  Navbar,
  Stack,
} from "@mantine/core";
import { closeAllModals, ModalsProvider } from "@mantine/modals";
import { CanvasRoot } from "./components/threejs";

// import service, { playerService } from "./state";
import { playerService } from "./state";
import { useControlsModal } from "./hooks/use-controls-modal";
import { DeviceGamepad2, Keyboard, Mouse, TableAlias } from "tabler-icons-react";
import { TControllerType } from "./machines/configuration/configuration.types";
import { usePauseMouse } from "./hooks/use-pause-mouse";
import { VelocityStats } from "./components/VelocityStats";
import { useWindowEvent } from "@mantine/hooks";

const Provider: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <ColorSchemeProvider colorScheme="dark" toggleColorScheme={() => null}>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "dark" }}>
      <ModalsProvider>
          {children}
      </ModalsProvider>
    </MantineProvider>
  </ColorSchemeProvider>
);

const Toolbar = () => {
  const inputs = useSelector(playerService, ({ context }) => context.inputs);
  const active = useSelector(inputs, (state) => state.matches('active'));
  const controllers = useSelector(inputs, ({ context }) => context.controllers);

  const showControlsModal = useControlsModal(inputs as any);

  const toggleService = React.useCallback(() => {
    inputs.send(active ? "STOP" : "START")
  }, [inputs.send, active]);

  const toggleController = React.useCallback((controller: TControllerType) => {
    inputs.send({ type: "TOGGLE_CONTROLLER", controller, value: !controllers[controller]})
  }, [controllers])
  const activeColor = (v?: boolean) => v ? 'green' : 'red'

  return (
    <Stack align="right">
      <Button uppercase leftIcon={<DeviceGamepad2 size={18}/>} onClick={toggleService} color={activeColor(active)}>
        {active ? "Running" : "Stopped"}
      </Button>
      <Group position="center" grow>
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
        <ActionIcon variant="filled" size="lg" onClick={showControlsModal}>
        <TableAlias/>
      </ActionIcon>
      </Group>
    </Stack>
  )
}

export default function App() {
  const inputs = useSelector(playerService, ({ context }) => context.inputs);
  const active = useSelector(inputs, (state) => state.matches('active'));

  usePauseMouse('KeyX')
  useWindowEvent('keypress', e => {
    if (e.code === 'KeyZ') {
      console.info(active)
      inputs.send(active ? 'STOP' : 'START')
    }
  })
  React.useEffect(() => {
    inputs.send("START");
    return () => {
      closeAllModals();
      inputs.send("STOP");
    };
  }, []);

  const getStyles = (theme: MantineTheme) => ({
    main: {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
      // paddingLeft overrides the default extra padding while keeping the css calculation valid
      paddingTop: 0, paddingBottom: 0, paddingRight: 0, paddingLeft: "var(--mantine-navbar-width, 0px)"
    }
  })

  return (
    <Provider>
      <AppShell
        navbar={
          <Navbar width={{base:200}} p="xs" py="xl">
            <Navbar.Section mb="xl"><Toolbar/></Navbar.Section>
            <Navbar.Section><VelocityStats vertical /></Navbar.Section>
          </Navbar>}
        styles={getStyles}
      >
      <Container fluid sx={{padding: 0, height: '100vh'}}>
        <Suspense fallback={null}>
          <CanvasRoot />
        </Suspense>
      </Container>

      </AppShell>
    </Provider>
  );
}
