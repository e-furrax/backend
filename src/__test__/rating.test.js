const request = require('supertest')('localhost:3000');
let token = '';

beforeAll(async () => {
    await login('pierre@gmail.com', 'password');
});

describe('addRating', () => {
    const query = `
  mutation addRating($data: RatingInput!) {
    addRating(data: $data) {
      rating
      comments
      createdAt
      fromUser {
        username
      }
      toUser {
        username
      }
    }
  }
`;
    it('addRating', async () => {
        const data = {
            data: { rating: '5', comments: 'hello', toUser: { id: 2 } },
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.addRating).toBeDefined();
    });
    it('addRating no param', async () => {
        const response = await request
            .post('/graphql')
            .send({ query })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('addRating no rating', async () => {
        const data = { data: { comments: 'hello', toUser: { id: 2 } } };
        const response = await request
            .post('/graphql')
            .send({ query })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('addRating no target', async () => {
        const data = { data: { rating: '5', comments: 'hello' } };
        const response = await request
            .post('/graphql')
            .send({ query })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });

    it('addRating wrong target', async () => {
        const data = {
            data: { rating: '5', comments: 'hello', toUser: { id: 255 } },
        };
        const response = await request
            .post('/graphql')
            .send({ query })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });

    it('addRating no logged', async () => {
        const data = {
            data: { rating: '5', comments: 'hello world', toUser: { id: 2 } },
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});

describe('getRatings', () => {
    const query = `
  query getRatings {
    getRatings {
      id
      rating
      comments
      createdAt
      fromUser {
        username
        profileImage
      }
      toUser {
        username
      }
    }
  }
`;
    it('getRatings', async () => {
        const data = {};
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.getRatings).toBeDefined();
    });
    it('getRatings no data', async () => {
        const data = {};
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.getRatings).toBeDefined();
    });
    it('getRatings not logged', async () => {
        const data = {};
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.getRatings).toBeDefined();
    });
});

describe('removeRating', () => {
    const query = `
  mutation removeRating($ratings: RatingIdsInput!) {
    removeRating(ratings: $ratings)
  }
`;
    it('removeRating', async () => {
        const data = { ratings: { ids: [113] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.removeRating).toBeDefined();
    });
    it('getRatings no data', async () => {
        const data = {};
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('getRatings not logged', async () => {
        const data = { ratings: { ids: [113] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
    it('getRatings no perm', async () => {
        await login('tom@gmail.com', 'password');
        const data = { ratings: { ids: [113] } };
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
