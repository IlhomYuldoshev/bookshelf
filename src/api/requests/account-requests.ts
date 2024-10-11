import { client_v1 } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { ClientType } from '@/api/types';
import { RawMe } from '@/types/account';
import { BackendResponse } from '@/types/common';

class Account_requests {
    private client: ClientType;
    constructor(client: ClientType) {
        this.client = client;
    }

    public me() {
        return this.client.get<BackendResponse<RawMe>>(endpoints.account.me);
    }
}

const account_requests = new Account_requests(client_v1);

export { account_requests };
