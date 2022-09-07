import { ThemeProvider } from '@mui/material/styles';
import theme from 'renderer/utils/theme';
import Main from 'renderer/components/Main';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <Main />
        </ThemeProvider>
    );
}
