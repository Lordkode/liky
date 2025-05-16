import request from 'supertest';
import { PrismaClient } from '../generated/prisma';
import App from '../app';

describe('Auth Integration Tests', () => {
  let app: any;
  let prisma: PrismaClient;
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser'
  };

  beforeAll(async () => {
    app = new App().app;
    prisma = new PrismaClient();

    // Nettoyer la base de données avant les tests
    await prisma.user.deleteMany({
      where: {
        email: testUser.email
      }
    });
  });

  afterAll(async () => {
    // Nettoyer la base de données
    await prisma.user.deleteMany({
      where: {
        email: testUser.email
      }
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    beforeEach(async () => {
      // Nettoyer la base de données avant chaque test d'inscription
      await prisma.user.deleteMany({
        where: {
          email: testUser.email
        }
      });
    });

    it('devrait créer un nouvel utilisateur', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.username).toBe(testUser.username);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('devrait rejeter une inscription avec un email déjà utilisé', async () => {
      // Première inscription
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      // Tentative de réinscription avec le même email
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(409);
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('already exist');
    });

    it('devrait rejeter une inscription avec des données invalides', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: '123', // mot de passe trop court
        username: 'te' // username trop court
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400); // Le service renvoie 400 pour les données invalides
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
    });

    it('devrait rejeter une inscription avec des champs manquants', async () => {
      const incompleteUser = {
        email: 'test2@example.com',
        // password manquant
        username: 'testuser2'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser);

      expect(response.status).toBe(400); // Le service renvoie 400 pour les champs manquants
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // S'assurer qu'un utilisateur existe pour les tests de connexion
      try {
        await request(app)
          .post('/api/auth/register')
          .send(testUser);
      } catch (error) {
        // L'utilisateur existe peut-être déjà, on continue
      }
    });

    it('devrait connecter un utilisateur avec des identifiants valides', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('devrait rejeter une connexion avec un mot de passe incorrect', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Authentication failed');
    });

    it('devrait rejeter une connexion avec un email inexistant', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Authentication failed');
    });

    it('devrait rejeter une connexion avec des champs manquants', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email
          // password manquant
        });

      expect(response.status).toBe(400); // Le service renvoie 400 pour les champs manquants
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;

    beforeEach(async () => {
      // Créer un utilisateur et obtenir un token
      try {
        const registerResponse = await request(app)
          .post('/api/auth/register')
          .send(testUser);
        
        if (registerResponse.status === 201) {
          token = registerResponse.body.data.token;
        } else {
          // Si l'utilisateur existe déjà, on se connecte
          const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
              email: testUser.email,
              password: testUser.password
            });
          token = loginResponse.body.data.token;
        }
      } catch (error) {
        // En cas d'erreur, on essaie de se connecter
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password
          });
        token = loginResponse.body.data.token;
      }
    });

    it('devrait récupérer les informations de l\'utilisateur connecté', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.username).toBe(testUser.username);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('devrait rejeter une requête sans token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Token not valid');
    });

    it('devrait rejeter une requête avec un token invalide', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Token not valid');
    });
  });
}); 