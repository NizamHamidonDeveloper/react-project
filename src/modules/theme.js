import { createMuiTheme } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';

const rawTheme = createMuiTheme({
  palette: {
      primary: {
        light: '#869bff',
        main: '#556ee6',
        dark: '#4056bc',
      },
      secondary: {
        light: '#ff072e',
        main: '#d50022',
        dark: '#660312',
      },
      warning: {
        main: '#910c21',
        dark: '#660312',
      },
      error: {
        xLight: red[50],
        main: red[500],
        dark: red[700],
      },
      success: {
        xLight: green[50],
        main: green[500],
        dark: green[700],
      },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: 14
    },
    props: {
      MuiTab: {
        disableRipple: true,
      },
    }
  });

const theme = {
  ...rawTheme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: '#061A26',
      },
    },
    MuiButton: {
      label: {
        textTransform: 'none',
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none',
        },
      },
    },
    MuiTabs: {
      root: {
        marginLeft: rawTheme.spacing(1),
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: rawTheme.palette.common.white,
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        margin: '0 16px',
        minWidth: 0,
        padding: 0,
        [rawTheme.breakpoints.up('md')]: {
          padding: 0,
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: rawTheme.spacing(1),
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: '#404854',
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: rawTheme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20,
        },
      },
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
    MuiBox:{
      root: {
        padding: 0
      },
    }
  },
};

export default theme;
