import request from "supertest";
import app from './app';
import { IUser } from './interface';
import { message } from './messages';
import { validate, v4 } from 'uuid';

const server = request(app);

const url = '/api/users';
const testUser:IUser = {
  username: 'Test',
	age: 100,
	hobbies: []
};
let uuid = '';

describe('Scenario 1: from task', () => {
  it('Get all users', async () => {
    const response = await server.get(url);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('Сreate user', async () => {
    const response = await server.post(url).send(JSON.stringify(testUser));
    expect(response.statusCode).toBe(201);
    uuid = response.body.id;
    expect(validate(uuid)).toBe(true);
    testUser.id = uuid;
    expect(response.body).toEqual(testUser);
  });

  it('Get user', async () => {
    const response = await server.get(`${url}/${uuid}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(testUser);
  });

  it('Update user', async () => {
    testUser.hobbies = ['I love women'];
    const response = await server.put(`${url}/${uuid}`).send(JSON.stringify(testUser));
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(testUser);
  });

  it('Delete user', async () => {
    const response = await server.delete(`${url}/${uuid}`);
    expect(response.statusCode).toBe(204);
    expect(response.body).toEqual({});
  });

  it('Get no such user', async () => {
    const response = await server.get(`${url}/${uuid}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(message.noData);
  });
});

describe('Scenario 2: Errors request to GET, POST and ERROR=500', () => {
  it('GET "/"', async () => {
    const response = await server.get('/');
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(message.nonExistEndpoint);
  });
  
  it('Get no such user, "id === uuid"', async () => {
    const response = await server.get(`${url}/${v4()}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(message.noData);
  });

  it('Get user, "id !== uuid"', async () => {
    const response = await server.get(`${url}/123`);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(message.notUUID);
  });

  it('POST "/"', async () => {
    const response = await server.post('/').send(JSON.stringify(testUser));
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(message.nonExistEndpoint);
  });

  it('POST "/api/users/{uuid}"', async () => {
    const response = await server.post(`${url}/${v4()}`).send(JSON.stringify(testUser));
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(message.nonExistEndpoint);
  });

  it('Сreate user without required fields', async () => {
    const response = await server.post(url).send(JSON.stringify({age: 1}));
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(message.noValidBody);
  });

  it('POST "ERROR=500"', async () => {
    const response = await server.post(url).send('{"username:"Test","age":100,"hobbies":[}');
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe(message.serverError);
  });

  it('Server is working', async () => {
    const response = await server.get(url);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe('Scenario 3: Errors request to PUT and DELETE', () => {
  it('PUT "/api/users"', async () => {
    const response = await server.put(url).send(JSON.stringify(testUser));
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(message.nonExistEndpoint);
  });

  it('Update no such user, "id === uuid"', async () => {
    const response = await server.put(`${url}/${v4()}`).send(JSON.stringify(testUser));
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(message.noData);
  });

  it('Update user, "id !== uuid"', async () => {
    const response = await server.put(`${url}/123}`).send(JSON.stringify(testUser));
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(message.notUUID);
  });

  it('Update user, without required fields', async () => {
    const newUser = await server.post(url).send(JSON.stringify(testUser));
    uuid = newUser.body.id;
    const response = await server.put(`${url}/${uuid}`).send(JSON.stringify({age: 18}));
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(message.noValidBody);
  });

  it('DELETE "/api/users"', async () => {
    const response = await server.delete(url);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(message.nonExistEndpoint);
  });

  it('Delete no such user, "id === uuid"', async () => {
    const response = await server.delete(`${url}/${v4()}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(message.noData);
  });

  it('Delete user, "id !== uuid"', async () => {
    const response = await server.delete(`${url}/123`);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(message.notUUID);
  });
});

app.close();