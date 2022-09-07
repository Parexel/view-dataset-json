import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        text: {
            primary: '#222222',
            secondary: '#666666',
            disabled: '#C4C4C4',
        },
        background: {
            paper: '#FFF',
            default: '#e0e0e0',
        },
    },
    shape: {
        borderRadius: 8,
    },
});

export default theme;
