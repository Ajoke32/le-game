import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../app.js";
import { dbAdapter } from "../config/db.js";

let server;
let baseUrl;

const validUser = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@gmail.com",
  phone: "+380501112233",
  password: "abc",
};

const validFighter = {
  name: "Ryu",
  power: 90,
  defense: 8,
};

const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  return {
    status: response.status,
    body: await response.json(),
  };
};

const post = (path, body) => request(path, { method: "POST", body });
const patch = (path, body) => request(path, { method: "PATCH", body });
const del = (path) => request(path, { method: "DELETE" });

beforeAll(() => {
  server = app.listen(0);
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  dbAdapter.set("users", []).set("fighters", []).set("fights", []).write();
});

describe("users API", () => {
  it("returns an empty users list", async () => {
    const response = await request("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("creates, reads, updates, and deletes a user", async () => {
    const created = await post("/api/users", validUser);

    expect(created.status).toBe(200);
    expect(created.body).toMatchObject(validUser);
    expect(created.body.id).toEqual(expect.any(String));

    const found = await request(`/api/users/${created.body.id}`);

    expect(found.status).toBe(200);
    expect(found.body).toMatchObject({
      id: created.body.id,
      firstName: "Ada",
    });

    const updated = await patch(`/api/users/${created.body.id}`, {
      firstName: "Grace",
    });

    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({
      id: created.body.id,
      firstName: "Grace",
      lastName: "Lovelace",
    });

    const removed = await del(`/api/users/${created.body.id}`);

    expect(removed.status).toBe(200);
    expect(removed.body.id).toBe(created.body.id);

    const missing = await request(`/api/users/${created.body.id}`);

    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({
      error: true,
      message: "User not found",
    });
  });
});

describe("fighters API", () => {
  it("returns an empty fighters list", async () => {
    const response = await request("/api/fighters");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("creates, reads, updates, and deletes a fighter", async () => {
    const created = await post("/api/fighters", validFighter);

    expect(created.status).toBe(200);
    expect(created.body).toMatchObject({
      ...validFighter,
      health: 85,
    });
    expect(created.body.id).toEqual(expect.any(String));

    const found = await request(`/api/fighters/${created.body.id}`);

    expect(found.status).toBe(200);
    expect(found.body.name).toBe("Ryu");

    const updated = await patch(`/api/fighters/${created.body.id}`, {
      health: 120,
    });

    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({
      id: created.body.id,
      health: 120,
    });

    const removed = await del(`/api/fighters/${created.body.id}`);

    expect(removed.status).toBe(200);
    expect(removed.body.id).toBe(created.body.id);

    const missing = await request(`/api/fighters/${created.body.id}`);

    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({
      error: true,
      message: "Fighter not found",
    });
  });
});

describe("validation", () => {
  it("rejects invalid user create and update payloads", async () => {
    expect((await post("/api/users", { ...validUser, email: "ada@yahoo.com" })).status).toBe(400);
    expect((await post("/api/users", { ...validUser, phone: "380501112233" })).status).toBe(400);
    expect((await post("/api/users", { ...validUser, password: "ab" })).status).toBe(400);
    expect((await post("/api/users", { ...validUser, id: "client-id" })).status).toBe(400);
    expect((await post("/api/users", { ...validUser, createdAt: "today" })).status).toBe(400);
    expect((await post("/api/users", { ...validUser, phone: undefined })).status).toBe(400);

    const created = await post("/api/users", validUser);

    expect((await patch(`/api/users/${created.body.id}`, {})).status).toBe(400);
    expect((await patch(`/api/users/${created.body.id}`, { id: "client-id" })).status).toBe(400);
    expect((await patch(`/api/users/${created.body.id}`, { createdAt: "today" })).status).toBe(400);
  });

  it("rejects invalid fighter create and update payloads", async () => {
    expect((await post("/api/fighters", { ...validFighter, power: 0 })).status).toBe(400);
    expect((await post("/api/fighters", { ...validFighter, power: 101 })).status).toBe(400);
    expect((await post("/api/fighters", { ...validFighter, defense: 0 })).status).toBe(400);
    expect((await post("/api/fighters", { ...validFighter, defense: 11 })).status).toBe(400);
    expect((await post("/api/fighters", { ...validFighter, health: 79 })).status).toBe(400);
    expect((await post("/api/fighters", { ...validFighter, health: 121 })).status).toBe(400);
    expect((await post("/api/fighters", { ...validFighter, id: "client-id" })).status).toBe(400);
    expect((await post("/api/fighters", { ...validFighter, createdAt: "today" })).status).toBe(400);
    expect((await post("/api/fighters", { power: 90, defense: 8 })).status).toBe(400);

    const created = await post("/api/fighters", validFighter);

    expect((await patch(`/api/fighters/${created.body.id}`, {})).status).toBe(400);
    expect((await patch(`/api/fighters/${created.body.id}`, { id: "client-id" })).status).toBe(400);
    expect((await patch(`/api/fighters/${created.body.id}`, { createdAt: "today" })).status).toBe(400);
  });
});

describe("uniqueness", () => {
  it("rejects duplicate user emails case-insensitively and duplicate phones", async () => {
    await post("/api/users", validUser);

    expect(
      (await post("/api/users", {
        ...validUser,
        email: "ADA@gmail.com",
        phone: "+380501112244",
      })).status
    ).toBe(400);

    expect(
      (await post("/api/users", {
        ...validUser,
        email: "other@gmail.com",
      })).status
    ).toBe(400);
  });

  it("rejects duplicate fighter names case-insensitively", async () => {
    await post("/api/fighters", validFighter);

    const duplicate = await post("/api/fighters", {
      ...validFighter,
      name: "RYU",
    });

    expect(duplicate.status).toBe(400);
  });
});

describe("auth API", () => {
  it("logs in with valid credentials", async () => {
    const created = await post("/api/users", validUser);
    const login = await post("/api/auth/login", {
      email: "ADA@gmail.com",
      password: validUser.password,
    });

    expect(login.status).toBe(200);
    expect(login.body.id).toBe(created.body.id);
  });

  it("rejects invalid credentials using the shared error format", async () => {
    await post("/api/users", validUser);

    const login = await post("/api/auth/login", {
      email: validUser.email,
      password: "wrong",
    });

    expect([400, 404]).toContain(login.status);
    expect(login.body).toMatchObject({
      error: true,
      message: expect.any(String),
    });
  });
});

describe("fights API", () => {
  it("returns an empty fight history", async () => {
    const response = await request("/api/fights");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("creates a fight, saves its log, and returns it by id", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const firstFighter = await post("/api/fighters", validFighter);
    const secondFighter = await post("/api/fighters", {
      name: "Ken",
      power: 80,
      defense: 7,
      health: 90,
    });

    const created = await post("/api/fights", {
      fighter1: firstFighter.body.id,
      fighter2: secondFighter.body.id,
    });

    expect(created.status).toBe(200);
    expect(created.body).toMatchObject({
      id: expect.any(String),
      fighter1: firstFighter.body.id,
      fighter2: secondFighter.body.id,
    });
    expect(created.body.log.length).toBeGreaterThan(0);
    expect(created.body.log[0]).toEqual({
      fighter1Shot: 83,
      fighter2Shot: 72,
      fighter1Health: 13,
      fighter2Health: 7,
    });

    const history = await request("/api/fights");

    expect(history.status).toBe(200);
    expect(history.body).toHaveLength(1);
    expect(history.body[0].id).toBe(created.body.id);

    const found = await request(`/api/fights/${created.body.id}`);

    expect(found.status).toBe(200);
    expect(found.body).toEqual(created.body);

    vi.restoreAllMocks();
  });

  it("returns 404 for a missing fight", async () => {
    const response = await request("/api/fights/missing-fight");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: true,
      message: "Fight not found",
    });
  });

  it("rejects invalid fight create payloads", async () => {
    const firstFighter = await post("/api/fighters", validFighter);
    const secondFighter = await post("/api/fighters", {
      name: "Ken",
      power: 80,
      defense: 7,
    });

    expect((await post("/api/fights", { fighter1: firstFighter.body.id })).status).toBe(400);
    expect(
      (await post("/api/fights", {
        fighter1: firstFighter.body.id,
        fighter2: secondFighter.body.id,
        extra: true,
      })).status
    ).toBe(400);
    expect(
      (await post("/api/fights", {
        fighter1: firstFighter.body.id,
        fighter2: firstFighter.body.id,
      })).status
    ).toBe(400);
    expect(
      (await post("/api/fights", {
        fighter1: firstFighter.body.id,
        fighter2: "unknown-fighter",
      })).status
    ).toBe(400);
  });
});
