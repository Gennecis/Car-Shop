const request = require("supertest");
const app = require("../server");
const { MongoClient } = require("mongodb");

let connection;
let db;
let storeId;

beforeAll(async () => {
  connection = await MongoClient.connect(process.env.MONGODB_URL);
  db = connection.db("CarShop");
});

beforeEach(async () => {
  await db.collection("store").deleteMany({});
});

afterAll(async () => {
  await connection.close();
});

describe("Stores API CRUD Test", () => {

  test("POST /stores → create store", async () => {
    const response = await request(app)
      .post("/stores")
      .send({
        name: "Main Street Store",
        manager: "John Doe",
        number: 123
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("insertedId");

    storeId = response.body.insertedId;
  });

  test("GET /stores/:id → get store", async () => {
    const inserted = await db.collection("store").insertOne({
      name: "Main Street Store",
      manager: "John Doe",
      number: 123
    });

    const response = await request(app).get(`/stores/${inserted.insertedId}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Main Street Store");
  });

  test("GET /stores → list stores", async () => {
    const response = await request(app).get("/stores");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("PUT /stores/:id → update store", async () => {
    const insertedStore = await db.collection("store").insertOne({
      name: "Downtown Store",
      manager: "John Doe",
      number: 101
    });

    const response = await request(app)
      .put(`/stores/${insertedStore.insertedId}`)
      .send({
        name: "Uptown Store",
        manager: "Jane Smith",
        number: 102
      });

    expect(response.status).toBe(204);

    const updated = await db.collection("store").findOne({ _id: insertedStore.insertedId });
    expect(updated.name).toBe("Uptown Store");
    expect(updated.manager).toBe("Jane Smith");
  });

  test("DELETE /stores/:id → delete store", async () => {
    const insertedStore = await db.collection("store").insertOne({
      name: "Test Store",
      manager: "Test Manager",
      number: 999
    });

    const response = await request(app).delete(`/stores/${insertedStore.insertedId}`);

    expect(response.status).toBe(204);

    const deleted = await db.collection("store").findOne({ _id: insertedStore.insertedId });
    expect(deleted).toBeNull();
  });

});