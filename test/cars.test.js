const request = require("supertest");
const app = require("../server");
const { MongoClient, ObjectId } = require("mongodb");

let connection;
let db;
let carId;

beforeAll(async () => {
  connection = await MongoClient.connect(process.env.MONGODB_URL);
  db = connection.db("CarShop");
});

beforeEach(async () => {
  await db.collection("Cars").deleteMany({});
});

afterAll(async () => {
  await connection.close();
});

describe("Cars API CRUD Test", () => {

  test("POST /cars → create a car", async () => {
    const response = await request(app)
      .post("/cars")
      .send({
        carName: "Civic",
        brand: "Honda",
        year: "2020",
        color: "Black",
        price: "90000"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("insertedId");

    carId = response.body.insertedId;
  });

  test("GET /cars/:id → get one car", async () => {
    const insertedCar = await db.collection("Cars").insertOne({
      carName: "Corolla",
      brand: "Toyota",
      year: "2022",
      color: "White",
      price: "85000"
    });

    const response = await request(app).get(`/cars/${insertedCar.insertedId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("carName", "Corolla");
  });

  test("GET /cars → list cars", async () => {
    const response = await request(app).get("/cars");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

});
