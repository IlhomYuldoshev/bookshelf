import { AccountData, RawMe } from '@/types/account';
import { SignUpBody } from '@/types/auth';

class AccountAdapter {
    prepareSignUpBody(values: any): SignUpBody {
        return {
            // TODO
            ...values,
        };
    }

    public getUserData(data: RawMe): AccountData {
        return {
            ...data,
        };
    }
}

const account_adapter = new AccountAdapter();

export { account_adapter };
