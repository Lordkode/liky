import request from "supertest";
import App from "../src/app";
import { describe, it, expect, beforeAll } from "@jest/globals";

let appInstance: App;
let app: any;

beforeAll(async () => {
  appInstance = new App();
  app = appInstance.app;
});

afterAll(async () => {
  await appInstance.close();
});

describe("Auth API Integration", () => {
  const user = {
    email: "test@exemple.com",
    password: "securep@ss123",
    username: "TestUser",
  };

  // Register user
  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send(user);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("data.user");
    expect(res.body.data.user).toHaveProperty("id");
    expect(res.body.data.user).toHaveProperty("email", user.email);
    expect(res.body.data.user).toHaveProperty("username", user.username);
    expect(res.body.data).toHaveProperty("token");
  });

  // Login user
  it("should log in a user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("data.user");
    expect(res.body.data.user).toHaveProperty("id");
    expect(res.body.data.user).toHaveProperty("email", user.email);
    expect(res.body.data.user).toHaveProperty("username", user.username);
    expect(res.body.data).toHaveProperty("token");
  });

  // Login with wrong password
  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: "wr@ngpass123" });

    expect(res.status).toBe(401);
    expect(res.type).toBe("text/html");
    expect(res.text).toContain("Error");
    expect(res.text).toContain("Email or password is incorrect");
  });
});
