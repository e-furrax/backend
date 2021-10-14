const request = require('supertest')('localhost:3000');
let token = '';

describe('add Users', () => {
    const query = `
    mutation register($data: RegisterInput!) {
        register(data: $data) {
            username
            email
            gender
        }
    }
`;
    it('add user', async () => {
        const user = {
            data: {
                username: 'test',
                email: 'test@test.fr',
                password: 'password',
                gender: 'male',
            },
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: user })
            .set('Content-Type', 'application/json')
            .expect(200);
        expect(response.text.replace(/(\r\n|\n|\r)/gm, '')).toBe(
            '{"data":{"register":{"username":"test","email":"test@test.fr","gender":"male"' +
                '}}}'
        );
    });
    it('add user, no gender', async () => {
        const user = {
            data: {
                username: 'test',
                email: 'test@test.fr',
                password: 'password',
            },
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: user })
            .set('Content-Type', 'application/json')
            .expect(400);
    });
    it('add user, no username', async () => {
        const user = {
            data: {
                email: 'test@test.fr',
                password: 'password',
                gender: 'male',
            },
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: user })
            .set('Content-Type', 'application/json')
            .expect(400);
    });
    it('add user, no password', async () => {
        const user = {
            data: {
                username: 'test',
                email: 'test@test.fr',
                gender: 'male',
            },
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: user })
            .set('Content-Type', 'application/json')
            .expect(400);
    });
    it('add user, no email', async () => {
        const user = {
            data: {
                username: 'test',
                password: 'password',
                gender: 'male',
            },
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: user })
            .set('Content-Type', 'application/json')
            .expect(400);
    });
});

describe('login Users', () => {
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
    it('login unknow user', async () => {
        const login = {
            email: 'test1@test.fr',
            password: 'password',
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: login })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data = JSON.parse(response.text);
        expect(data.errors).toBeDefined();
    });
    it('login wrong password', async () => {
        const login = {
            email: 'test@test.fr',
            password: 'password123',
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: login })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data = JSON.parse(response.text);
        expect(data.errors).toBeDefined();
    });
    it('login user', async () => {
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
});

describe('get Users', () => {
    const query = `
  query($data: FilterInput) {
    getUsers(data: $data) {
      id
      email
      username
      description
      gender
      createdAt
      profileImage
      languages {
        name
      }
      games {
        id
        name
      }
      receivedRatings {
        rating
      }
    }
  }
`;
    it('getUsers', async () => {
        const response = await request
            .post('/graphql')
            .send({ query, variables: {} })
            .set('Content-Type', 'application/json')
            .expect(200);
    });
    it('getUsers by game', async () => {
        const data = { data: { games: [1] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
    });
    it('getUsers by language', async () => {
        const data = { data: { languages: [2] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
    });
    it('getUsers by gender', async () => {
        const data = { data: { gender: 'Male' } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
    });
});

describe('get User', () => {
    const query = `
  query getUser($data: UserInput!) {
    getUser(data: $data) {
      id
      email
      username
      description
      gender
      createdAt
      role
      profileImage
      donationLink
      receivedRatings {
        id
        comments
        rating
        fromUser {
          username
          profileImage
        }
        createdAt
      }
      givenRatings {
        id
        comments
        rating
        toUser {
          username
        }
        createdAt
      }
      languages {
        id
        name
      }
      games {
        id
        name
      }
      statistics {
        id
        rank
        mode
        playerId
        game {
          id
          name
        }
      }
    }
  }
`;
    it('getUser', async () => {
        const data = { data: { id: 1 } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
    });
    it('getUser non existent', async () => {
        const data = { data: { id: 999 } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});

describe('reset pwd', () => {
    const query = `
  mutation resetPassword($email: String!) {
    resetPassword(email: $email)
  }
`;
    it('reset pwd', async () => {
        const data = { email: 'test@test.fr' };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
    });
});

describe('add languages', () => {
    const query = `
  mutation addLanguages($languages: LanguagesInput!) {
    addLanguages(languages: $languages) {
      username
      languages {
        name
      }
    }
  }
`;
    it('add languages', async () => {
        const data = { languages: { ids: [1] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
    });
    it('add non existent languages', async () => {
        const data = { languages: { ids: [99] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});

describe('add games', () => {
    const query = `
  mutation addGames($games: GamesInput!) {
    addGames(games: $games) {
      username
      games {
        name
      }
    }
  }
`;
    it('add games', async () => {
        const data = { games: { ids: [1] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
    });
    it('add non existent games', async () => {
        const data = { games: { ids: [99] } };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});

describe('remove games', () => {
    const query = `
  mutation removeUserGame($id: Float!) {
    removeUserGame(id: $id) {
      username
      games {
        name
      }
    }
  }
`;
    it('remove games', async () => {
        const data = { id: 1 };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
    });
    it('remove non existent games', async () => {
        const data = { id: 1 };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});

describe('remove languages', () => {
    const query = `
  mutation removeUserLanguage($id: Float!) {
    removeUserLanguage(id: $id) {
      username
      languages {
        name
      }
    }
  }
`;
    it('remove languages', async () => {
        const data = { id: 1 };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
    });
    it('remove non existent languages', async () => {
        const data = { id: 1 };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
        const data2 = JSON.parse(response.text);
        expect(data2.errors).toBeDefined();
    });
});

describe('become furrax', () => {
    const query = `
  mutation becomeFurrax($data: BecomeFurraxInput!) {
    becomeFurrax(data: $data)
  }
`;
    it('become furrax', async () => {
        const data = {
            data: {
                games: { ids: [1] },
                description: 'test',
                availability:
                    '[{"name":"Monday","start":"08:00","end":"18:00","enabled":true},{"name":"Tuesday","start":"08:00","end":"18:00","enabled":true},{"name":"Wednesday","start":"08:00","end":"18:00","enabled":false},{"name":"Thursday","start":"08:00","end":"18:00","enabled":false},{"name":"Friday","start":"08:00","end":"18:00","enabled":false},{"name":"Saturday","start":"08:00","end":"18:00","enabled":false},{"name":"Sunday","start":"08:00","end":"18:00","enabled":false}]',
                languages: { ids: [2] },
            },
        };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
    });
    it('become furrax wrong data', async () => {
        const response = await request
            .post('/graphql')
            .send({ query, variables: {} })
            .set('Content-Type', 'application/json')
            .expect(400);
    });
});

describe('add donation link', () => {
    const query = `
  mutation addDonationLink($data: String!) {
    addDonationLink(data: $data)
  }
`;
    it('add donation link', async () => {
        const data = { data: 'test' };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
    });
});

describe('update donation link', () => {
    const query = `
  mutation updateDonationLink($data: String!) {
    updateDonationLink(data: $data)
  }
`;
    it('update donation link', async () => {
        const data = { data: 'test2' };
        const response = await request
            .post('/graphql')
            .send({ query, variables: data })
            .set('Content-Type', 'application/json')
            .expect(200);
    });
});
