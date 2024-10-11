export type RawSearchBook = {
    isbn: string;
    title: string;
    cover: string;
    author: string;
    published: number;
};

export type RawBook = {
    book: {
        id: number;
        isbn: string;
        title: string;
        cover: string;
        author: string;
        published: number;
        pages: number;
    };
    status: 0 | 1 | 2;
};

export type SearchBookItem = RawSearchBook;
export type BookItem = RawBook;
