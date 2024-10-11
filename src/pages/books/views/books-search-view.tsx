import { books_adapter } from '@/api/adapters/books-adapter';
import { books_requests } from '@/api/requests';
import BookItem from '@/pages/books/components/BookItem';
import { showToast } from '@/services/toast-service';
import { useDebounce } from '@/shared/hooks/use-debounce';
import useRequest from '@/shared/hooks/use-request';
import { Search } from '@mui/icons-material';
import { Box, CircularProgress, Grid2 as Grid, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

type Props = {};

const BooksSearchView = (props: Props) => {
    const [text, setText] = useState('');
    const debouncedText = useDebounce(text, 500);

    const [addLoading, setAddLoading] = useState<string[]>([]);
    const [deleteLoading, setDeleteLoading] = useState<number[]>([]);

    // my booksni olishni custom hook ga aylantirib qo'yish kerak
    const getBooksQuery = useRequest(
        (abortSignal) => {
            return books_requests.getAll(abortSignal);
        },
        {
            selectData(response) {
                return response.data.data?.map((i) => books_adapter.getBookItem(i)) ?? [];
            },
        }
    );

    const searchBooksQuery = useRequest(
        (abortSignal) => {
            return books_requests.search(text, abortSignal);
        },
        {
            enabled: !!debouncedText,
            selectData(response) {
                return response.data.data.map((i) => books_adapter.getSearchBookItem(i));
            },
            dependencies: [debouncedText],
        }
    );

    const loading = searchBooksQuery.loading;
    const isEmpty = !!debouncedText && !searchBooksQuery.data?.length && !loading;
    const data = searchBooksQuery.data || [];

    const addBook = async (isbn: string) => {
        const index = addLoading.indexOf(isbn);
        if (index === -1) {
            try {
                setAddLoading((prev) => [...prev, isbn]);
                const res = await books_requests.create({ isbn: isbn });
                getBooksQuery.optimisticUpdateSelectedData([
                    ...(getBooksQuery.data ?? []),
                    res.data.data,
                ]);
            } catch (error) {
                console.log(error);
                showToast({ message: error, type: 'error' });
            } finally {
                setAddLoading((prev) => prev.filter((i) => i !== isbn));
            }
        }
    };

    const deleteBook = async (id: number) => {
        const index = deleteLoading.indexOf(id);
        if (index === -1) {
            try {
                setDeleteLoading((prev) => [...prev, id]);
                await books_requests.delete(id);
                getBooksQuery.optimisticUpdateSelectedData(
                    (getBooksQuery.data ?? [])?.filter((i) => i.book.id !== id)
                );
            } catch (error) {
                console.log(error);
                showToast({ message: error, type: 'error' });
            } finally {
                setDeleteLoading((prev) => prev.filter((i) => i !== id));
            }
        }
    };

    const findBookByIsbn = (isbn: string) => {
        const book = getBooksQuery.data?.find((i) => i.book.isbn === isbn);
        return book;
    };

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

            <Box sx={{ p: 3 }}>
                {loading ? (
                    <Stack alignItems={'center'} p={10}>
                        <CircularProgress size={120} />
                    </Stack>
                ) : isEmpty ? (
                    <Typography variant="h3">No books found</Typography>
                ) : (
                    <Grid container spacing={3} p={3}>
                        {data.map((i) => {
                            const addedBook = findBookByIsbn(i.isbn);

                            return (
                                <Grid size={4}>
                                    <BookItem
                                        key={i.isbn}
                                        title={i.title}
                                        addBook={() => addBook(i.isbn)}
                                        loadingAdd={addLoading.includes(i.isbn)}
                                        status={addedBook?.status}
                                        loadingDelete={
                                            addedBook
                                                ? deleteLoading.includes(addedBook?.book.id)
                                                : undefined
                                        }
                                        onDelete={
                                            addedBook
                                                ? () => deleteBook(addedBook.book.id)
                                                : undefined
                                        }
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default BooksSearchView;
