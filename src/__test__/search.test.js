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
        email: 'pierre@gmail.com',
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

describe('search', () => {
    const query = `
  query SearchByUsernameOrGamename($input: String!) {
    SearchByUsernameOrGamename(input: $input) {
      users {
        id
        username
        profileImage
      }
      games {
        id
        name
      }
    }
  }
`;
    it('search', async () => {
        const data = { input: 'Pierre' };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.SearchByUsernameOrGamename).toBeDefined();
    });
    it('search empty param', async () => {
        const data = { input: '' };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.SearchByUsernameOrGamename).toBeDefined();
    });
    it('search no param', async () => {
        const response = await request
            .post('/graphql')
            .send({ query })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('search no logged', async () => {
        const data = { input: '' };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.SearchByUsernameOrGamename).toBeDefined();
    });
});
