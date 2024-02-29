import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const APPBAR_HEIGHT = '58px'
const BOARD_BAR_HEIGHT = '60px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APPBAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`
const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: APPBAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT
  },
  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: {
    //       main: '#ff5252'
    //     }
    //   }
    // },
    // dark: {
    //   palette: {
    //     primary: {
    //       main: '#000'
    //     }
    //   }
    // }
  },
  components: {
    // MuiCssBaseline: {
    //   styleOverrides: {
    //     body: {
    //       '*::webkit-scrollbar': {

    //       }
    //     }
    //   }
    // },
    MuiButton: {
      styleOverrides: {
        root: ({}) => ({
          textTransform: 'none',
          borderWidth: '0.5px !important',
          '&:hover': {
            borderWidth: '1px !important'
          }
        })
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          // color: theme.palette.primary.main,
          fontSize: '0.875rem',
          '.MuiOutlinedInput-notchedOutline': {
            // borderColor: theme.palette.primary.light
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            // borderColor: theme.palette.primary.main
          },
          '& fieldset': {
            borderWidth: '0.5px !important'
          },
          '&:hover fieldset': {
            borderWidth: '1px !important'
          },
          '&.Mui-focused fieldset': {
            borderWidth: '1px !important'
          }
        })
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({}) => ({
          // color: theme.palette.primary.main,
          fontSize: '0.875rem'
        })
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': {
            fontSize: '0.875rem'
          }
        }
      }
    }
  }
})

export default theme
