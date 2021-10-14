const request = require('supertest')('localhost:3000');
let token = '';

beforeAll(async () => {
    const query = `
        mutation login($password: String!, $email: String!) {
            login(password: $password, email: $email) {
                accessToken
                id
                email
                username
                role
                profileImage
            }
        }
    `;
    const login = {
        email: 'thomas@gmail.com',
        password: 'password',
    };
    const response = await request
        .post('/graphql')
        .send({ query, variables: login })
        .set('Content-Type', 'application/json')
        .expect(200);
    const data = JSON.parse(response.text);
    token = data.data.login.accessToken;
});

describe('getAvailability', () => {
    const query = `
  query getAvailability($user: UserInput!) {
    getAvailability(user: $user) {
      value
    }
  }
`;
    it('getAvailability', async () => {
        const data = { user: { id: 6 } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.getAvailability).toBeDefined();
    });
    it('getAvailability not logged', async () => {
        const data = { user: { id: 6 } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.getAvailability).toBeDefined();
    });
    it('getAvailability wrong param', async () => {
        const data = { user: { id: 600 } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
    it('getAvailability no param', async () => {
        const response = await request
            .post('/graphql')
            .send({ query })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});

describe('updateAvailability', () => {
    const query = `
  mutation updateAvailability($value: String!) {
    updateAvailability(value: $value) {
      value
    }
  }
`;
    it('updateAvailability', async () => {
        const data = {
            value: '[{"name":"Monday","start":"08:00","end":"18:00","enabled":true},{"name":"Tuesday","start":"08:00","end":"18:00","enabled":false},{"name":"Wednesday","start":"08:00","end":"18:00","enabled":false},{"name":"Thursday","start":"08:00","end":"18:00","enabled":false},{"name":"Friday","start":"08:00","end":"18:00","enabled":true},{"name":"Saturday","start":"08:00","end":"18:00","enabled":false},{"name":"Sunday","start":"08:00","end":"18:00","enabled":false}]',
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.updateAvailability).toBeDefined();
    });
    it('updateAvailability not logged', async () => {
        const data = {
            value: '[{"name":"Monday","start":"08:00","end":"18:00","enabled":true},{"name":"Tuesday","start":"08:00","end":"18:00","enabled":false},{"name":"Wednesday","start":"08:00","end":"18:00","enabled":false},{"name":"Thursday","start":"08:00","end":"18:00","enabled":false},{"name":"Friday","start":"08:00","end":"18:00","enabled":true},{"name":"Saturday","start":"08:00","end":"18:00","enabled":false},{"name":"Sunday","start":"08:00","end":"18:00","enabled":false}]',
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
    it('updateAvailability incomplete param', async () => {
        const data = {
            value: '[{"name":"Monday","start":"08:00","end":"18:00","enabled":true},{"name":"Tuesday","start":"08:00","end":"18:00","enabled":false},{"name":"Wednesday","start":"08:00","end":"18:00","enabled":false},{"name":"Thursday","start":"08:00","end":"18:00","enabled":false},{"name":"Friday","start":"08:00","end":"18:00","enabled":true},{"name":"Saturday","start":"08:00","end":"18:00","enabled":false}]',
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.updateAvailability).toBeDefined();
    });
    it('updateAvailability no param', async () => {
        const response = await request
            .post('/graphql')
            .send({ query })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});
