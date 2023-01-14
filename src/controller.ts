import { IUser } from './interface';

export const controller = (method:string, url:string) => {
    const table = process.env.TABLE_USERS || JSON.stringify([]);
    const db:Array<IUser> = JSON.parse(table);

    // для теста добавим что-то в db
    db.push({
        id: '123',
        username: '456',
        age: 789,
        hobbies: ['0']
    });

    const code = 200;
    const body = table;

    const tableNew = JSON.stringify(db);

    return { code, body, tableNew };
};