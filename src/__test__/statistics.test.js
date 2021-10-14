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

describe('upsertStatistic', () => {
    const query = `
  mutation upsertStatistic($data: StatisticInput!) {
    upsertStatistic(data: $data) {
      id
      mode
      game {
        id
      }
      playerId
    }
  }
`;
    it('upsertStatistic', async () => {
        const data = { data: { game: { id: 3 }, mode: '13', rank: '12' } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.upsertStatistic).toBeDefined();
    });

    it('upsertStatistic not logged', async () => {
        const data = { data: { game: { id: 3 }, mode: '13', rank: '12' } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });

    it('upsertStatistic wrong data', async () => {
        const data = { data: { game: { id: 15 }, mode: '13', rank: '12' } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });

    it('upsertStatistic no data', async () => {
        const response = await request
            .post('/graphql')
            .send({ query })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
});

describe('deleteStatistic', () => {
    const query = `
  mutation deleteStatistic($id: Float!) {
    deleteStatistic(id: $id)
  }
`;
    let statId = 0;

    beforeAll(async () => {
        const query = `
  mutation upsertStatistic($data: StatisticInput!) {
    upsertStatistic(data: $data) {
      id
      mode
      game {
        id
      }
      playerId
    }
  }
`;
        let data = { data: { game: { id: 3 }, mode: '13', rank: '12' } };
        let response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        let data2 = JSON.parse(response.text);
        expect(data2.data.upsertStatistic).toBeDefined();
        statId = data2.data.upsertStatistic.id;
    });

    it('deleteStatistic', async () => {
        const data = { id: Number.parseInt(statId) };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.deleteStatistic).toBe(true);
    });

    it('deleteStatistic not logged', async () => {
        const data = { id: Number.parseInt(statId) };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });

    it('deleteStatistic wrong data', async () => {
        const data = { id: Number.parseInt(statId) };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });

    it('deleteStatistic no data', async () => {
        const response = await request
            .post('/graphql')
            .send({ query })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
});
