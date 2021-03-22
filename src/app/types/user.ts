export class User {

    constructor(public userName: string,
        public password: string,
        public role: string) { }
}

export class UserWithToken {
    constructor(public userName: string,
        public password: string,
        public role: string,
        public token: string
    ) { }
}