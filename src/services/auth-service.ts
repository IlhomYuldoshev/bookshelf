import md5 from 'md5';

const seperator = '____________';
type Credentials = {
    key: string;
    secret: string;
};

export const auth_service = {
    clearCredentials(): void {
        localStorage.removeItem('user_secret');
    },
    getCredentials(): Credentials | null {
        try {
            const secret = localStorage.getItem('user_secret');
            if (secret && secret.split(seperator)) {
                return {
                    key: secret.split(seperator)[0],
                    secret: secret.split(seperator)[1],
                };
            } else {
                return null;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    },
    setCredentials(key: string, secret: string): void {
        localStorage.setItem('user_secret', `${key}${seperator}${secret}`);
    },
    prepareSign(
        method: string,
        body: string,
        url: string
    ): {
        key: string;
        sign: string;
    } {
        const key = this.getCredentials()?.key ?? '';
        const secret = this.getCredentials()?.secret ?? '';

        const signText = `${method}${url}${body ? JSON.stringify(body) : ''}${secret}`;

        console.log('sign params: ', { method, url, body, secret });
        console.log('sign text', signText);

        return {
            key,
            sign: md5(signText),
        };
    },
};
