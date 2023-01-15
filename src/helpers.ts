import { IncomingMessage, ServerResponse } from 'http';
import { IUser } from './interface';

export const getBody = (req:IncomingMessage) => {
    return new Promise( resolve => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => resolve(body));
    });
};

export const sendResponse = (res:ServerResponse, code:number, message:string) => {
    if (code === 204) {
        res.statusCode = code;
        res.end();
    } else if (code < 400) {
        res.writeHead(code, { "Content-Type": "application/json" });
        res.end(message);
    } else {
        res.statusMessage = message;
        res.writeHead(code, { "Content-Type": "application/json" });
        res.end(JSON.stringify({message: message}));
    };
};

export const validateData = (data:IUser) => {
    if (typeof data.username !== 'string') return false;
    if (typeof data.age !== 'number') return false;
    if (typeof data.hobbies !== 'object') return false;
    let flag = true;
    data.hobbies.forEach(item => {
        if (typeof item !== 'string') flag = false;
    });
    return flag;
};