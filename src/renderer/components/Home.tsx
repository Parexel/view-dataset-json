import { useAppSelector } from 'renderer/redux/hooks';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import SelectDataset from 'renderer/components/SelectDataset';
import ViewDataset from 'renderer/components/ViewDataset';
import Header from 'renderer/components/Header';

const Home = () => {
    const currentView = useAppSelector((state) => state.ui.view);

    return (
        <Stack sx={{ display: 'flex', height: '100vh' }}>
            <Header />
            <Box
                sx={{
                    paddingTop: '65px',
                    display: 'flex',
                    flex: '1 1 auto',
                    maxHeight: '100%',
                }}
            >
                {currentView === 'select' && <SelectDataset />}
                {currentView === 'view' && <ViewDataset />}
            </Box>
        </Stack>
    );
};

export default Home;
