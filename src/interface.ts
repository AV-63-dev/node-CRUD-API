export interface IUser {
    id: string;
    username: string;
    age: number;
    hobbies: Array<string>;
};

export interface ILiveWorkers {
    [key: string]: any
};

export interface IMsg {
    method?:string,
    url?:string,
    code?:number,
    body?:string,
    table?:string
};