import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import HomeIcon from '@mui/icons-material/Home';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { setView } from 'renderer/redux/slices/ui';
import { setData } from 'renderer/redux/slices/data';
import { useAppDispatch } from 'renderer/redux/hooks';

const Header: React.FC = () => {
    const dispatch = useAppDispatch();

    const handleHomeClick = () => {
        dispatch(setView('select'));
    };

    const handleOpenClick = () => {
        dispatch(setView('view'));
        dispatch(setData({ name: null }));
        // To implement
    };

    const handleCloudClick = () => {
        // To implement
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: 'background.paper',
            }}
        >
            <Toolbar>
                <Stack
                    sx={{ width: '100%' }}
                    direction="row"
                    justifyContent="flex-start"
                >
                    <IconButton
                        onClick={handleHomeClick}
                        id="home"
                        size="medium"
                    >
                        <HomeIcon
                            sx={{
                                color: 'primary.main',
                                fontSize: '32px',
                            }}
                        />
                    </IconButton>
                    <IconButton
                        onClick={handleOpenClick}
                        id="open"
                        size="medium"
                    >
                        <FileOpenOutlinedIcon
                            sx={{
                                color: 'primary.main',
                                fontSize: '32px',
                            }}
                        />
                    </IconButton>
                    <IconButton
                        onClick={handleCloudClick}
                        id="cloud"
                        size="medium"
                    >
                        <CloudDownloadOutlinedIcon
                            sx={{
                                color: 'primary.main',
                                fontSize: '32px',
                            }}
                        />
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
