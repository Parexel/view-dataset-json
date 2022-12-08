import { useAppDispatch } from 'renderer/redux/hooks';
import { Typography, Stack, Button } from '@mui/material';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { setView } from 'renderer/redux/slices/ui';

const SelectDataset = () => {
    const dispatch = useAppDispatch();

    const handleOpenLocal = async () => {
        dispatch(setView('view'));
    };

    const handleOpenRemote = async () => {
        // TODO
    };

    return (
        <Stack
            spacing={20}
            direction="row"
            sx={{ flex: '1 1 auto' }}
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
    );
};

export default SelectDataset;
