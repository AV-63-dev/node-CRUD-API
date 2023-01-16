import * as dotenv from "dotenv";
import http from 'http';
import { controller } from './controller';
import { messageServerStart, messageServerError } from './messages';
import { getBody, sendResponse } from './helpers';

dotenv.config();
const port = Number(process.env.PORT);

const requestHandler = async (req:http.IncomingMessage, res:http.ServerResponse) => {
    try {
        const data = await getBody(req);
        const {code, body, table, error} = controller(String(req.method), String(req.url), String(data));
        if (error) throw new Error('code 500');
        process.env.TABLE_USERS = table;
        sendResponse(res, Number(code), String(body));
    } catch {
        const {code, body} = messageServerError();
        sendResponse(res, code, body);
    };
};

export default http.createServer(requestHandler).listen(port, messageServerStart);