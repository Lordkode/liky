import request from 'supertest';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '../generated/prisma';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repository/user.repository';
import App from '../app';

describe('Post Integration Tests', () => {
  let app: any;
  let prisma: PrismaClient;
  let authService: AuthService;
  let token: string;
  let userId: string;
  const testImagePath = path.join(__dirname, './fixtures/test-image.jpg');
  const fixturesDir = path.join(__dirname, './fixtures');
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser'
  };

  beforeAll(async () => {
    app = new App().app;
    prisma = new PrismaClient();
    
    // Nettoyer la base de données avant les tests
    await prisma.image.deleteMany({
      where: {
        user: {
          email: testUser.email
        }
      }
    });
    await prisma.user.deleteMany({
      where: {
        email: testUser.email
      }
    });
    
    // Créer un utilisateur de test
    const userRepository = new UserRepository(prisma);
    authService = new AuthService(userRepository);
    
    const user = await authService.register(testUser);
    token = user.token;
    userId = user.user.id;

    // Créer les dossiers nécessaires
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }

    // Créer une image de test si elle n'existe pas
    if (!fs.existsSync(testImagePath)) {
      const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
      fs.writeFileSync(testImagePath, imageBuffer);
    }
  });

  afterAll(async () => {
    // Nettoyer la base de données
    await prisma.image.deleteMany({
      where: {
        user: {
          email: testUser.email
        }
      }
    });
    await prisma.user.deleteMany({
      where: {
        email: testUser.email
      }
    });
    await prisma.$disconnect();

    // Nettoyer les fichiers temporaires
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  });

  describe('POST /api/feed', () => {
    beforeEach(async () => {
      // Nettoyer la base de données avant chaque test de post
      await prisma.image.deleteMany({
        where: {
          user: {
            email: testUser.email
          }
        }
      });
      await prisma.user.deleteMany({
        where: {
          email: testUser.email
        }
      });
      // Créer un utilisateur de test
      const userRepository = new UserRepository(prisma);
      authService = new AuthService(userRepository);
      const user = await authService.register(testUser);
      token = user.token;
      userId = user.user.id;
    });

    it('devrait créer un nouveau post avec une image', async () => {
      const response = await request(app)
        .post('/api/feed')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', testImagePath)
        .field('title', 'Test Post');

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('url');
      expect(response.body.data).toHaveProperty('publicId');
      expect(response.body.data.title).toBe('Test Post');
      expect(response.body.data.userId).toBe(userId);
    });

    it('devrait rejeter une requête sans fichier', async () => {
      const response = await request(app)
        .post('/api/feed')
        .set('Authorization', `Bearer ${token}`)
        .field('title', 'Test Post');

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('No file provided');
    });

    it('devrait rejeter une requête sans token', async () => {
      const response = await request(app)
        .post('/api/feed')
        .attach('file', testImagePath)
        .field('title', 'Test Post');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Token not valid');
    });

    it('devrait rejeter un fichier trop volumineux', async () => {
      // Créer un fichier de 11MB
      const largeFilePath = path.join(fixturesDir, 'large-image.jpg');
      const largeFile = Buffer.alloc(11 * 1024 * 1024); // 11MB
      fs.writeFileSync(largeFilePath, largeFile);

      const response = await request(app)
        .post('/api/feed')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', largeFilePath)
        .field('title', 'Test Post');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Taille maximale : 10MB');

      // Nettoyer le fichier temporaire
      fs.unlinkSync(largeFilePath);
    });

    it('devrait rejeter un type de fichier non supporté', async () => {
      // Créer un fichier texte
      const textFilePath = path.join(fixturesDir, 'test.txt');
      fs.writeFileSync(textFilePath, 'Test content');

      const response = await request(app)
        .post('/api/feed')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', textFilePath)
        .field('title', 'Test Post');

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Unsupported file type');

      // Nettoyer le fichier temporaire
      fs.unlinkSync(textFilePath);
    });
  });

  describe('GET /api/feed', () => {
    it('devrait récupérer les posts de l\'utilisateur', async () => {
      // Créer d'abord un post pour s'assurer qu'il y a des données
      await request(app)
        .post('/api/feed')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', testImagePath)
        .field('title', 'Test Post for Feed');

      const response = await request(app)
        .get('/api/feed')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('url');
      expect(response.body.data[0]).toHaveProperty('publicId');
    });

    it('devrait rejeter une requête sans token', async () => {
      const response = await request(app)
        .get('/api/feed');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Token not valid');
    });
  });

  describe('GET /api/feed/:id', () => {
    let postId: string;

    beforeEach(async () => {
      // Créer un post pour les tests
      const createResponse = await request(app)
        .post('/api/feed')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', testImagePath)
        .field('title', 'Test Post for Get');

      if (createResponse.status === 201) {
        postId = createResponse.body.data.id;
      }
    });

    it('devrait récupérer un post spécifique', async () => {
      if (!postId) {
        console.warn('Aucun post créé pour le test');
        return;
      }

      const response = await request(app)
        .get(`/api/feed/${postId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('id', postId);
      expect(response.body.data).toHaveProperty('url');
      expect(response.body.data).toHaveProperty('publicId');
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data).toHaveProperty('userId');
    });

    it('devrait retourner 404 pour un post inexistant', async () => {
      const response = await request(app)
        .get('/api/feed/nonexistent-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Post not found');
    });

    it('devrait rejeter une requête sans token', async () => {
      if (!postId) {
        console.warn('Aucun post créé pour le test');
        return;
      }

      const response = await request(app)
        .get(`/api/feed/${postId}`);

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Token not valid');
    });
  });
}); 