import { UserRepository } from "../repository/user.repository";
import { jwtService } from "../utils/jwt.utils";
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from "../utils/errors/auth-errors";
import { User } from "../generated/prisma";
import { PasswordService } from "../utils/password.utils";

export interface RegisterDTO {
  email: string;
  password: string;
  username: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  user: Omit<User, "password">;
  token: string;
}

export class AuthService {
  private userRepository: UserRepository;

  constructor(
    userRepository: UserRepository,
  ) {
    this.userRepository = userRepository;
  }

  // Method to register user
  async register(userData: RegisterDTO): Promise<AuthResponseDTO> {
    // Check if user already exist
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new UserAlreadyExistsError(userData.email);
    }

    // Hash password
    const hashedPassword = await PasswordService.hashPassword(
      userData.password
    );

    // Create new user
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Generate token
    const token = jwtService.generateToken({ userId: newUser.id });

    // Delete password from response
    const { password, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  // Method to login
  async login(credentials: LoginDTO): Promise<AuthResponseDTO> {
    // find user by email
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    // compare password
    const isValidePassword = await PasswordService.comparePasswords(
      credentials.password,
      user.password
    );
    if (!isValidePassword) {
      throw new InvalidCredentialsError();
    }

    // Generate token
    const token = jwtService.generateToken({ userId: user.id });

    // Delete password ffrom response
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}
