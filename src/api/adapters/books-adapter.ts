import { BookItem, RawBook, RawSearchBook, SearchBookItem } from '@/types/book';

class BooksAdapter {
    public getSearchBookItem(raw: RawSearchBook): SearchBookItem {
        return raw;
    }

    public getBookItem(raw: RawBook): BookItem {
        return raw;
    }
}

const books_adapter = new BooksAdapter();

export { books_adapter };
