import React, { Suspense } from 'react'
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
import { useStateActions } from './machines/hooks'

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
  const actions = useStateActions(playerService)

  usePauseMouse('KeyX')

  /** @debug event listener for testing purposes */
  useWindowEvent('keypress', e => {
    if (e.code === 'KeyZ') {
      actions.pause('controls')
    }
  })

  React.useEffect(() => {
    actions.start()
    return () => {
      closeAllModals()
      actions.pause()
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
