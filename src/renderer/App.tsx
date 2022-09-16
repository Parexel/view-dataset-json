import { ThemeProvider } from '@mui/material/styles';
import theme from 'renderer/utils/theme';
import Main from 'renderer/components/Home';
import { CssBaseline } from '@mui/material';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Main />
        </ThemeProvider>
    );
}
