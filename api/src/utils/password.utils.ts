import bcrypt from "bcrypt";

export class PasswordService {
  private static readonly SALT_ROUNDS = 10;

  // Method for hash password
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  // Method for compare hash and password
  static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
