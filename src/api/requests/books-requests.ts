import { client_v1 } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { ClientType } from '@/api/types';
import { RawBook, RawSearchBook } from '@/types/book';
import { BackendResponse } from '@/types/common';

class Books_requests {
    private client: ClientType;
    constructor(client: ClientType) {
        this.client = client;
    }

    public search(text: string, abortSignal?: AbortSignal) {
        return this.client.get<BackendResponse<RawSearchBook[]>>(endpoints.books.search(text), {
            signal: abortSignal,
        });
    }

    public getAll(signal?: AbortSignal) {
        return this.client.get<BackendResponse<RawBook[] | undefined>>(endpoints.books.getAll, {
            signal,
        });
    }

    public create(data: any) {
        return this.client.post<BackendResponse<RawBook>>(endpoints.books.create, data);
    }

    public edit(id: string, data: any) {
        return this.client.patch<BackendResponse<RawBook>>(endpoints.books.edit(id), data);
    }

    public delete(id: string) {
        return this.client.delete<BackendResponse<RawBook[]>>(endpoints.books.delete(id));
    }
}

const books_requests = new Books_requests(client_v1);

export { books_requests };
