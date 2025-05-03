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

    //{ access_token: 'iwboawamggeljwc6d0bm8wjrkfs5i8', expires_in: 4978322 }
    static fromKV({ access_token, expires_in }: any): Token {
        return new Token(access_token, expires_in);
    }
}