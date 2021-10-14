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

describe('sendMessage', () => {
    const query = `
  mutation sendMessage($data: MessageInput!) {
    sendMessage(data: $data)
  }
`;
    it('sendMessage', async () => {
        const data = { data: { content: 'bip', toUser: { id: 2 } } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.sendMessage).toBeDefined();
    });
    it('sendMessage no content', async () => {
        const data = { data: { toUser: { id: 17 } } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
    it('sendMessage no param', async () => {
        const response = await request
            .post('/graphql')
            .send({ query })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('sendMessage no logged', async () => {
        const data = { data: { content: 'bip', toUser: { id: 17 } } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});

describe('getConversation', () => {
    const query = `
    query getConversation($conversationId: Float!) {
    getConversation(conversationId: $conversationId) {
      id
      content
      toUser {
        id
        username
      }
      fromUser {
        id
        username
      }
      createdAt
    }
  }
`;
    it('getConversation', async () => {
        const data = { conversationId: 1 };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.getConversation).toBeDefined();
    });

    it('getConversation wrong param', async () => {
        const data = { conversationId: 15 };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.getConversation).toBeDefined();
    });
    it('getConversation no param', async () => {
        const data = {};
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('getConversation no logged', async () => {
        const data = { conversationId: 1 };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});

describe('getConversations', () => {
    const query = `
  query getConversations {
    getConversations {
      id
      conversationId
      content
      toUser {
        id
        username
      }
      fromUser {
        id
        username
      }
      createdAt
    }
  }
`;
    it('getConversations', async () => {
        const data = {};
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.getConversations).toBeDefined();
    });
    it('getConversations no logged', async () => {
        const data = {};
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});
