import { books_adapter } from '@/api/adapters/books-adapter';
import { books_requests } from '@/api/requests';
import { paths } from '@/constants/paths';
import BookItem from '@/pages/books/components/BookItem';
import { showToast } from '@/services/toast-service';
import { RouterLink } from '@/shared/components/router-link';
import useRequest from '@/shared/hooks/use-request';
import { Box, CircularProgress, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';

type Props = {};

const BookListView = (props: Props) => {
    const [deleteLoading, setDeleteLoading] = useState<number[]>([]);
    const [changeStatusLoading, setChangeStatusLoading] = useState<number[]>([]);

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

    const loading = getBooksQuery.loading;
    const isEmpty = !getBooksQuery.data?.length && !loading;
    const data = getBooksQuery.data || [];

    const deleteBook = async (id: number) => {
        const index = deleteLoading.indexOf(id);
        if (index === -1) {
            try {
                setDeleteLoading((prev) => [...prev, id]);
                await books_requests.delete(id);
                getBooksQuery.optimisticUpdateSelectedData(data.filter((i) => i.book.id !== id));
            } catch (error) {
                console.log(error);
                showToast({ message: error, type: 'error' });
            } finally {
                setDeleteLoading((prev) => prev.filter((i) => i !== id));
            }
        }
    };

    const changeBookStatus = async (id: number, newStatus: 0 | 1 | 2) => {
        const index = changeStatusLoading.indexOf(id);
        if (index === -1) {
            try {
                setChangeStatusLoading((prev) => [...prev, id]);
                await books_requests.edit(id, { status: newStatus });
                getBooksQuery.optimisticUpdateSelectedData(
                    data.map((i) => {
                        if (i.book.id === id) {
                            return { ...i, status: newStatus };
                        }
                        return i;
                    })
                );
            } catch (error) {
                console.log(error);
                showToast({ message: error, type: 'error' });
            } finally {
                setChangeStatusLoading((prev) => prev.filter((i) => i !== id));
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {loading && (
                <Stack alignItems={'center'} p={10}>
                    <CircularProgress size={120} />
                </Stack>
            )}
            {isEmpty && (
                <Typography variant="h5">
                    No books found,{' '}
                    <RouterLink to={paths.home}>Add books by search them</RouterLink>
                </Typography>
            )}
            <Grid container spacing={3} p={3}>
                {data.map((i) => {
                    return (
                        <Grid size={{ xs: 12, md: 4 }}>
                            <BookItem
                                title={i.book.title}
                                status={i.status}
                                onChangeStatus={(status) => changeBookStatus(i.book.id, status)}
                                onDelete={() => deleteBook(i.book.id)}
                                loadingChangeStatus={changeStatusLoading.includes(i.book.id)}
                                loadingDelete={deleteLoading.includes(i.book.id)}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default BookListView;
