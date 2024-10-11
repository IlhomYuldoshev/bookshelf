import { Box, CircularProgress } from '@mui/material';

type Props = {};

const LoadingScreen = (props: Props) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100vw',
            }}
        >
            <CircularProgress size={120} />
        </Box>
    );
};

export default LoadingScreen;
