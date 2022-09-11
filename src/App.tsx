import React, { Suspense } from 'react'
import { useSelector } from '@xstate/react'
import {
  AppShell,
  ColorSchemeProvider,
  Container,
  MantineProvider,
  MantineTheme,
  Navbar,
} from '@mantine/core'
import { closeAllModals, ModalsProvider } from '@mantine/modals'
import { useWindowEvent } from '@mantine/hooks'

import { playerService } from './state'
import { usePauseMouse } from './hooks/use-pause-mouse'

import { CanvasRoot } from './components/threejs'
import { VelocityStats } from './components/VelocityStats'
import { Toolbar } from './components/Toolbar'

const Provider: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <ColorSchemeProvider colorScheme="dark" toggleColorScheme={() => null}>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
      <ModalsProvider>
          {children}
      </ModalsProvider>
    </MantineProvider>
  </ColorSchemeProvider>
)

export default function App() {
  const inputs = useSelector(playerService, ({ context }) => context.inputs)
  const active = useSelector(inputs, (state) => state.matches('active'))

  usePauseMouse('KeyX')
  useWindowEvent('keypress', e => {
    if (e.code === 'KeyZ') {
      console.info(active)
      inputs.send(active ? 'STOP' : 'START')
    }
  })
  React.useEffect(() => {
    inputs.send('START')
    return () => {
      closeAllModals()
      inputs.send('STOP')
    }
  }, [])

  const getStyles = (theme: MantineTheme) => ({
    main: {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
      // paddingLeft overrides the default extra padding while keeping the css calculation valid
      paddingTop: 0, paddingBottom: 0, paddingRight: 0, paddingLeft: 'var(--mantine-navbar-width, 0px)'
    }
  })

  return (
    <Provider>
      <AppShell
        navbar={
          <Navbar width={{base:240}} p="xs" py="xl">
            <Navbar.Section mb="xl"><Toolbar/></Navbar.Section>
            <Navbar.Section><VelocityStats /></Navbar.Section>
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
  )
}
