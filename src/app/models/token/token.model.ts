export class TokenRequestModel {
    Grant_Type: string;
    ClientId: string;
    Username: string;
    Refresh_token: string;
    Password: string;
}

export class TokenResponse {
    Access_Token: string;
    Refresh_Token: string;
    Username: string;
    Roles: string[];
    constructor() {
        this.Roles = [];
    }
}
