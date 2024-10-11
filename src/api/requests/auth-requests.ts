import { client_v1 } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { ClientType } from '@/api/types';
import { SignUpBody, SignUpResponse } from '@/types/auth';
import { BackendResponse } from '@/types/common';

class Auth_requests {
    private client: ClientType;
    constructor(client: ClientType) {
        this.client = client;
    }

    public signUp(data: SignUpBody) {
        return this.client.post<BackendResponse<SignUpResponse>>(endpoints.auth.sign_up, data);
    }
}

const auth_requests = new Auth_requests(client_v1);

export { auth_requests };
