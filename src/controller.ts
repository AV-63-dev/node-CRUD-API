import { IUser } from './interface';
import { messageNonExistEndpoint, messageNotUUID, messageNoData, messageNoValidBody } from './messages';
import { validate, v4 } from 'uuid';
import { validateData } from './helpers';

export const controller = (method:string, url:string, data:string) => {
    try {
        const table = process.env.TABLE_USERS || JSON.stringify([]);
        const db:Array<IUser> = JSON.parse(table);
        const dataObj:IUser = data ? JSON.parse(data) : {};
        const flagStartingPoint = /^\/api\/users$/.test(url);
        const testID = url.match(/^\/api\/users\/(.*)$/);
        const flagUUID = testID ? validate(testID[1]) : false;

        switch (method) {
            case 'GET':
                if (testID && flagUUID) {
                    const result = db.find(user => user.id === testID[1]);
                    if (result) {
                        return { code: 200, body: JSON.stringify(result), table };
                    } else {
                        const { code, body } = messageNoData();
                        return { code, body, table };
                    };
                } else if (testID && !flagUUID) {
                    const { code, body } = messageNotUUID();
                    return { code, body, table };
                } else if (flagStartingPoint) {
                    return { code: 200, body: table, table };
                };
                break;

            case 'POST':
                if (flagStartingPoint) {
                    if (validateData(dataObj)) {
                        const user = {
                            id: v4(),
                            username: dataObj.username,
                            age: dataObj.age,
                            hobbies: dataObj.hobbies
                        };
                        db.push(user);
                        return { code: 201, body: JSON.stringify(user), table: JSON.stringify(db) };
                    } else {
                        const { code, body } = messageNoValidBody();
                        return { code, body, table };
                    };
                };
                break;

            case 'PUT':
                if (testID && flagUUID) {
                    const resultIndex = db.findIndex(user => user.id === testID[1]);
                    if (resultIndex === -1) {
                        const { code, body } = messageNoData();
                        return { code, body, table };
                    } else {
                        if (validateData(dataObj)) {
                            db[resultIndex] = {
                                id: db[resultIndex].id,
                                username: dataObj.username,
                                age: dataObj.age,
                                hobbies: dataObj.hobbies
                            };
                            return { code: 200, body: JSON.stringify(db[resultIndex]), table: JSON.stringify(db) };
                        } else {
                            const { code, body } = messageNoValidBody();
                            return { code, body, table };
                        };
                    };
                } else if (testID && !flagUUID) {
                    const { code, body } = messageNotUUID();
                    return { code, body, table };
                };
                break;

            case 'DELETE':
                if (testID && flagUUID) {
                    const resultIndex = db.findIndex(user => user.id === testID[1]);
                    if (resultIndex === -1) {
                        const { code, body } = messageNoData();
                        return { code, body, table };
                    } else {
                        db.splice(resultIndex, 1);
                        return { code: 204, body: '', table: JSON.stringify(db) };
                    };
                } else if (testID && !flagUUID) {
                    const { code, body } = messageNotUUID();
                    return { code, body, table };
                };
                break;

            default:
                const {code, body} = messageNonExistEndpoint();
                return { code, body, table };
        };

        const {code, body} = messageNonExistEndpoint();
        return { code, body, table };

    } catch {
        return { error: true };
    };
};