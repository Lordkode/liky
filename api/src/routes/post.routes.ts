import { Router, Request, Response, NextFunction, ErrorRequestHandler } from "express";
import multer from "multer";
import { PostController } from "../controller/post.controller";
import { PrismaClient } from "../generated/prisma";
import { authMiddleware } from "../middlewares/auth.middleware";
import { prisma } from "../db/prisma";
import { UnsupportedFileTypeError, InvalidPostDataError } from "../utils/errors/post-errors";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "_" + uniqueSuffix + ".jpg");
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "images/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new UnsupportedFileTypeError());
    }
  },
});

// Middleware pour logger les erreurs Multer
const handleMulterError: ErrorRequestHandler = (err, req, res, next): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      next(new InvalidPostDataError('Le fichier est trop volumineux. Taille maximale : 10MB'));
      return;
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      next(new InvalidPostDataError(`Champ de fichier inattendu. Champ attendu: 'file'`));
      return;
    }
    next(new InvalidPostDataError(err.message));
    return;
  }
  next(err);
};

export class PostRouter {
  private prisma: PrismaClient;
  public router: Router;
  private postController: PostController;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.router = Router();
    this.postController = new PostController(this.prisma);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Route for create new post
    this.router.post(
      "/",
      authMiddleware.authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        next();
      },
      upload.single("file"),
      handleMulterError as ErrorRequestHandler,
      this.postController.createPost
    );

    // route for get post
    this.router.get(
      "/:id",
      authMiddleware.authenticate,
      this.postController.getPost
    );

    // Route to get one user feed
    this.router.get(
      "/",
      authMiddleware.authenticate,
      this.postController.getUserPosts
    );
  }
}

export const postRouter = new PostRouter(prisma);
