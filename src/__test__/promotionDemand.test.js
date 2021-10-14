const request = require('supertest')('localhost:3000');
let token = '';

beforeAll(async () => {
    await login('pierre@gmail.com', 'password');
});
describe('updateRole', () => {
    const query = `
  mutation updateRole($promotion: PromotionInput!) {
    updateRole(promotion: $promotion) {
      id
      email
      username
      role
    }
  }
`;
    it('updateRole', async () => {
        const data = { promotion: { id: 6, role: 'FURRAX' } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.updateRole.role).toBe('FURRAX');
    });
    it('updateRole not logged', async () => {
        const data = { promotion: { id: 6, role: 'FURRAX' } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
    it('updateRole no perm', async () => {
        await login('tom@gmail.com', 'password');
        const data = { promotion: { id: 6, role: 'FURRAX' } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});

async function login(email, pwd) {
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
        email: email,
        password: pwd,
    };
    const response = await request
        .post('/graphql')
        .send({ query, variables: login })
        .set('Content-Type', 'application/json')
        .expect(200);
    const data = JSON.parse(response.text);
    token = data.data.login.accessToken;
}
