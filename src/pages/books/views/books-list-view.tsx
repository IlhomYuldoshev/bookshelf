import { books_adapter } from '@/api/adapters/books-adapter';
import { books_requests } from '@/api/requests';
import useRequest from '@/shared/hooks/use-request';

type Props = {};

const BookListView = (props: Props) => {
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

    return (
        <div>
            {loading && <div>Loading...</div>}
            {isEmpty && <div>Empty</div>}
            {data.map((i) => (
                <div key={i.book.id}>{i.book.title}</div>
            ))}
        </div>
    );
};

export default BookListView;
