import { createTheme } from '@mui/material/styles'

export default createTheme({
  palette: {
    primary: {
      light: 'rgb(28, 73, 100)',
      main: '#305E79',
      dark: '#rgb(137, 186, 212)',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },

  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
        fullWidth: true,
        InputLabelProps: {
          shrink: true
        }
      }
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained'
      }
    },
    MuiLoadingButton: {
      defaultProps: {
        variant: 'contained'
      }
    }
  }
});