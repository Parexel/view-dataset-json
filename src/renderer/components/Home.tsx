import { useState } from 'react';
import { Typography, Box, Stack, Button } from '@mui/material';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';

const Home = () => {
    const [data, setData] = useState({});
    const handleOpenLocal = async () => {
        const newData = await window.electron.openFile();
        if (newData !== undefined) {
            setData(newData);
        }
    };

    const handleOpenRemote = async () => {
        // TODO
    };

    return (
        <Box>
            <Stack
                spacing={20}
                direction="row"
                sx={{ height: '100vh' }}
                alignItems="center"
                justifyContent="center"
            >
                <Button
                    onClick={handleOpenLocal}
                    sx={{ width: '200px', height: '200px' }}
                    color="primary"
                    variant="contained"
                    startIcon={
                        <Stack
                            alignItems="center"
                            justifyItems="center"
                            spacing={2}
                        >
                            <FileOpenOutlinedIcon
                                sx={{ height: '50px', width: '50px' }}
                            />
                            <Typography variant="button">
                                Open Local File
                            </Typography>
                        </Stack>
                    }
                />
                <Button
                    onClick={handleOpenRemote}
                    sx={{ width: '200px', height: '200px' }}
                    color="primary"
                    variant="contained"
                    startIcon={
                        <Stack
                            alignItems="center"
                            justifyItems="center"
                            spacing={2}
                        >
                            <CloudDownloadOutlinedIcon
                                sx={{ height: '50px', width: '50px' }}
                            />
                            <Typography variant="button">
                                Open Remote File
                            </Typography>
                        </Stack>
                    }
                />
            </Stack>
            <Typography variant="body1">{Object.keys(data)}</Typography>
        </Box>
    );
};

export default Home;
