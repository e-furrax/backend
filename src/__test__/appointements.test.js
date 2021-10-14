const request = require('supertest')('localhost:4000');
const requestpg = require('supertest')('localhost:3000');
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
    const response = await requestpg
        .post('/graphql')
        .send({ query, variables: login })
        .set('Content-Type', 'application/json')
        .expect(200);
    const data = JSON.parse(response.text);
    token = data.data.login.accessToken;
});

describe('getAppointments', () => {
    const query = `
  {
    getAppointments {
      _id
      _createdAt
      _updatedAt
      from
      to
      status
    }
  }
`;
    it('getAppointments', async () => {
        const data = {};
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.getAppointments).toBeDefined();
    });
    it('getAppointments no logged', async () => {
        const data = { input: '' };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});

describe('getAppointments', () => {
    const query = `
  query getAppointmentsByUser($data: AppointmentStatusInput!) {
    getAppointmentsByUser(data: $data) {
      _id
      _createdAt
      _updatedAt
      from
      to
      game
      date
      matches
      status
    }
  }
`;
    it('getAppointmentsByUser', async () => {
        const data = { data: { from: 18, status: ['PENDING', 'CONFIRMED'] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.getAppointmentsByUser).toBeDefined();
    });
    it('getAppointmentsByUser no param', async () => {
        const response = await request
            .post('/graphql')
            .send({ query })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('getAppointmentsByUser wrong param', async () => {
        const data = { data: { status: ['PENDING', 'CONFIRMED'] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('getAppointmentsByUser no logged', async () => {
        const data = { data: { from: 18, status: ['PENDING', 'CONFIRMED'] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});

describe('createAppointment', () => {
    const query = `
  mutation createAppointment($appointmentInput: AppointmentInput!) {
    createAppointment(appointmentInput: $appointmentInput) {
      _createdAt
    }
  }
`;
    it('createAppointment', async () => {
        const data = {
            appointmentInput: {
                to: 3,
                description: 'default description',
                date: '2021-10-15T18:22',
                game: 'League of Legends',
                matches: 1,
            },
        };
        const data2 = {
            appointmentInput: {
                to: 3,
                description: 'default description',
                date: '2021-10-15T18:22',
                game: 'League of Legends',
                matches: 1,
            },
        };
        await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);

        const response = await request
            .post('/graphql')
            .send({ query, variables: data2 })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data3 = JSON.parse(response.text);
        console.log(response.text);
        expect(data3.data.createAppointment).toBeDefined();
    });
    it('createAppointment no param', async () => {
        const response = await request
            .post('/graphql')
            .send({ query })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('createAppointment no target', async () => {
        const data = {
            appointmentInput: {
                description: 'default description',
                date: '2021-10-15T18:22',
                game: 'League of Legends',
                matches: 1,
            },
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('createAppointment no date', async () => {
        const data = {
            appointmentInput: {
                to: 18,
                description: 'default description',
                game: 'League of Legends',
                matches: 1,
            },
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('createAppointment no game', async () => {
        const data = {
            appointmentInput: {
                description: 'default description',
                date: '2021-10-15T18:22',
                matches: 1,
            },
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('createAppointment no matches', async () => {
        const data = {
            appointmentInput: {
                to: 18,
                description: 'default description',
                date: '2021-10-15T18:22',
                game: 'League of Legends',
            },
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('createAppointment no logged', async () => {
        const data = {
            appointmentInput: {
                to: 18,
                description: 'default description',
                date: '2021-10-15T18:22',
                game: 'League of Legends',
                matches: 1,
            },
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

describe('confirmAppointment', () => {
    const query = `
  mutation confirmAppointment($payload: AppointmentIdsInput!) {
    confirmAppointment(payload: $payload)
  }
`;
    let appointmentId = 0;
    beforeAll(async () => {
        const query = `
  {
    getAppointments {
      _id
      _createdAt
      _updatedAt
      from
      to
      status
    }
  }
`;
        const data = {};
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.getAppointments).toBeDefined();
        appointmentId = data2.data.getAppointments[0]._id;
    });

    it('confirmAppointment', async () => {
        const data = { payload: { ids: [appointmentId] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.confirmAppointment).toBeDefined();
    });
    it('confirmAppointment, wrong id', async () => {
        const data = { payload: { ids: [599] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('confirmAppointment, not logged', async () => {
        const data = { payload: { ids: [appointmentId] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});

describe('deleteAppointment', () => {
    const query = `
  mutation deleteAppointment($payload: AppointmentIdsInput!) {
    deleteAppointment(payload: $payload)
  }
`;
    let appointmentId = 0;
    async function getAppoitement() {
        const query = `
  {
    getAppointments {
      _id
      _createdAt
      _updatedAt
      from
      to
      status
    }
  }
`;
        const data = {};
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.getAppointments).toBeDefined();
        appointmentId = data2.data.getAppointments[0]._id;
    }

    it('deleteAppointment', async () => {
        await getAppoitement();
        const data = { payload: { ids: [appointmentId] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.data.deleteAppointment).toBeDefined();
    });
    it('deleteAppointment, wrong id', async () => {
        const data = { payload: { ids: [599] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(400);
    });
    it('deleteAppointment, not logged', async () => {
        const data = { payload: { ids: [appointmentId] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});
