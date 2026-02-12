import { ThemeProvider } from '@mui/material'
import { StyledEngineProvider } from '@mui/material'
import AuthProvider from '../features/authentication/components/AuthProvider'
import Main from '../components/Layout/Main'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import theme from '../themes/mainTheme'
import '../styles/globals.css'
import '../styles/colors.css'

function MyApp({ Component, pageProps }) {

  return (
    <AuthProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <Main>
              <Component {...pageProps} />
            </Main>
        </ThemeProvider>
      </StyledEngineProvider>
    </AuthProvider>
  )
}

export default MyApp
