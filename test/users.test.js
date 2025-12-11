const request = require("supertest");
const app = require("../server");
const { MongoClient, ObjectId } = require("mongodb");

let connection;
let db;
let testUserId;

beforeAll(async () => {
  connection = await MongoClient.connect(process.env.MONGODB_URL);
  db = connection.db("CarShop");

  process.env.NODE_ENV = "test"; // prevent server from starting
});

beforeEach(async () => {
  await db.collection("users").deleteMany({});
});

afterAll(async () => {
  await connection.close();
});

describe("Users API CRUD Test", () => {

  test("POST /users - create user", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        email: "test@example.com",
        username: "testuser",
        name: "Test User",
        ipaddress: "1.2.3.4",
      });

    // Your controller returns 204 on success
    expect(response.status).toBe(201);

    const newUser = await db.collection("users")
      .findOne({ email: "test@example.com" });

    expect(newUser).toBeDefined();
    expect(newUser.username).toBe("testuser");

    testUserId = newUser._id.toString();
  });

  test("GET /users/:id - get one user", async () => {
    // Seed a user so GET works even if POST failed
    const seedUser = await db.collection("users").insertOne({
      email: "seed@example.com",
      username: "seed",
    });
    const id = seedUser.insertedId.toString();

    const response = await request(app).get(`/users/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe("seed@example.com");
  });

  test("GET /users - get all users", async () => {
    await db.collection("users").insertOne({
      email: "list@example.com",
      username: "list",
    });

    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("PUT /users/:id → update user", async () => {
    const insertedUser = await db.collection("users").insertOne({
      email: "test@example.com",
      username: "testuser",
      name: "Test User",
      ipaddress: "192.168.1.1"
    });

    const response = await request(app)
      .put(`/users/${insertedUser.insertedId}`)
      .send({
        email: "updated@example.com",
        username: "updateduser",
        name: "Updated User",
        ipaddress: "192.168.1.2"
      });

    expect(response.status).toBe(204);

    const updated = await db.collection("users").findOne({ _id: insertedUser.insertedId });
    expect(updated.email).toBe("updated@example.com");
  });

  test("DELETE /users/:id → delete user", async () => {
    const insertedUser = await db.collection("users").insertOne({
      email: "delete@example.com",
      username: "deleteuser",
      name: "Delete User",
      ipaddress: "192.168.1.3"
    });

    const response = await request(app).delete(`/users/${insertedUser.insertedId}`);

    expect(response.status).toBe(204);

    const deleted = await db.collection("users").findOne({ _id: insertedUser.insertedId });
    expect(deleted).toBeNull();
  });

});