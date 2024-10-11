import type { BookItem } from '@/types/book';
import { LoadingButton } from '@mui/lab';
import { Box, Card, CircularProgress, MenuItem, Select, Stack, Typography } from '@mui/material';

type Props = {
    title: string;
    status?: 0 | 1 | 2;
    loadingDelete?: boolean;
    loadingChangeStatus?: boolean;
    onDelete?: () => void | Promise<void>;
    onChangeStatus?: (newStatus: 0 | 1 | 2) => void | Promise<void>;

    loadingAdd?: boolean;
    addBook?: () => void | Promise<void>;
};

const BookItem = ({
    title,
    status,
    loadingDelete,
    loadingChangeStatus,
    loadingAdd,
    onChangeStatus,
    onDelete,
    addBook,
}: Props) => {
    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="h6" mb={1}>
                {title}
            </Typography>
            {status != null ? (
                <>
                    <Stack direction={'row'} spacing={2} mt={1}>
                        {onChangeStatus && (
                            <Select
                                fullWidth
                                size="small"
                                value={status}
                                onChange={(e) => {
                                    const newStatus = e.target.value as 0 | 1 | 2;
                                    if (status != newStatus) {
                                        onChangeStatus(newStatus);
                                    }
                                }}
                                disabled={loadingChangeStatus}
                                IconComponent={
                                    loadingChangeStatus
                                        ? () => (
                                              <Box sx={{ mr: 1 }}>
                                                  <CircularProgress size={14} />
                                              </Box>
                                          )
                                        : undefined
                                }
                            >
                                <MenuItem value={'0'}>New</MenuItem>
                                <MenuItem value={'1'}>Reading</MenuItem>
                                <MenuItem value={'2'}>Finished</MenuItem>
                            </Select>
                        )}
                        {onDelete && (
                            <LoadingButton
                                fullWidth
                                variant="contained"
                                color="error"
                                loading={loadingDelete}
                                onClick={onDelete}
                                size="small"
                            >
                                Delete
                            </LoadingButton>
                        )}
                    </Stack>
                </>
            ) : (
                <>
                    <LoadingButton
                        fullWidth
                        variant="contained"
                        color="primary"
                        loading={loadingAdd}
                        onClick={addBook}
                        size="small"
                    >
                        Add book
                    </LoadingButton>
                </>
            )}
        </Card>
    );
};

export default BookItem;
