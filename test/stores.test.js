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

});