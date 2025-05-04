export class Token {
    access_token: string;
    expires_in: number;

    constructor(access_token: string, expires_in: number) {
        this.access_token = access_token;
        this.expires_in = expires_in;
    }

    static fromJson(json: string): Token {
        const obj = JSON.parse(json);
        return new Token(obj.access_token, obj.expires_in);
    }

    static fromKV({ access_token, expires_in }: any): Token {
        return new Token(access_token, expires_in);
    }
}