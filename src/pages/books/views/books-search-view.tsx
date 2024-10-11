import { books_adapter } from '@/api/adapters/books-adapter';
import { books_requests } from '@/api/requests';
import { useDebounce } from '@/shared/hooks/use-debounce';
import useRequest from '@/shared/hooks/use-request';
import { Search } from '@mui/icons-material';
import { Box, CircularProgress, Grid2 as Grid, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

type Props = {};

const BooksSearchView = (props: Props) => {
    const [text, setText] = useState('');
    const debouncedText = useDebounce(text, 500);

    const searchBooksQuery = useRequest(
        (abortSignal) => {
            return books_requests.search(text, abortSignal);
        },
        {
            enabled: !!text,
            selectData(response) {
                return response.data.data.map((i) => books_adapter.getSearchBookItem(i));
            },
            dependencies: [debouncedText],
        }
    );

    const loading = searchBooksQuery.loading;
    const isEmpty = !!debouncedText && !searchBooksQuery.data?.length && !loading;
    const data = searchBooksQuery.data || [];

    return (
        <Box>
            <Box
                sx={{
                    padding: '60px',
                    backgroundColor: (theme) => theme.palette.primary.light,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <TextField
                    placeholder="Search by book title"
                    variant="outlined"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    sx={{
                        width: '100%',
                        maxWidth: '500px',

                        fieldset: {
                            borderRadius: '20px',
                            backgroundColor: '#fff',
                            boxShadow: 'none',
                        },
                        '.MuiInputBase-input': {
                            zIndex: 2,
                        },
                    }}
                    slotProps={{
                        input: {
                            endAdornment: <Search sx={{ position: 'relative', zIndex: 2 }} />,
                        },
                    }}
                />
            </Box>

            <Box>
                {loading ? (
                    <Stack alignItems={'center'} p={10}>
                        <CircularProgress size={120} />
                    </Stack>
                ) : isEmpty ? (
                    'No books found'
                ) : (
                    <Grid container spacing={3} p={3}>
                        {data.map((i) => {
                            return <Grid size={4}>{i.title}</Grid>;
                        })}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default BooksSearchView;
