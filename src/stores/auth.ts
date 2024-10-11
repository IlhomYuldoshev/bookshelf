import { account_adapter } from '@/api/adapters/account-adapter';
import { account_requests } from '@/api/requests';
import { auth_service } from '@/services/auth-service';
import { AccountData } from '@/types/account';
import { create } from 'zustand';

type AuthStoreType = {
    userData: AccountData | null;
    loading: boolean;
    getUserData(): Promise<void>;
};

const useAuthStore = create<AuthStoreType>((set, get) => ({
    userData: null,
    loading: false,
    async getUserData() {
        const currentState = get();
        if (currentState.loading || !auth_service.getCredentials()) return;
        try {
            set({ loading: true });
            const response = await account_requests.me();
            set({
                userData: account_adapter.getUserData(response.data.data),
            });
        } catch (e) {
            console.log('error');
            set({
                userData: null,
            });
        } finally {
            set({ loading: false });
        }
    },
}));

export { useAuthStore };
