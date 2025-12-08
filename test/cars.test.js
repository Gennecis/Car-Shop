const request = require("supertest");
const app = require("../server");      // 你的 Express app
const { MongoClient, ObjectId } = require("mongodb");

let connection;
let db;
let testCarId;

beforeAll(async () => {
  // 連到 MongoDB
  connection = await MongoClient.connect(process.env.MONGODB_URL);
  db = connection.db("CarShop");
});

// beforeEach(async () => {
//   // 在每個測試前清空 Cars collection
//   await db.collection("Cars").deleteMany({});
// });

describe("Cars API CRUD Test", () => {
  // createCar
  test("POST /cars - create a new car", async () => {
    const response = await request(app)
      .post("/cars")
      .send({
      carName: "Model X",
      brand: "Tesla",
      year: 2023,
      color: "Red",
      price: 90000
    });
    expect(response.status).toBe(201); // 對應 controller 回傳 201
    expect(response.body).toHaveProperty("insertedId");
    // 抓出剛新增的 car
    const newCar = await db.collection("Cars").findOne({ _id: new ObjectId(response.body.insertedId) });
    testCarId = newCar._id.toString();
    expect(newCar).toBeDefined();
    expect(newCar.carName).toBe("Model X");
  });

  // getSingle
  test("GET /cars/:id - get a single car", async () => {
    const response = await request(app).get(`/cars/${testCarId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("carName", "Model X");
  });

  // getAll
  test("GET /cars - should return cars list", async () => {
    const response = await request(app).get("/cars");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // updateCar
  test("PUT /cars/:id - update car", async () => {
    const response = await request(app)
    .put(`/cars/${testCarId}`)
    .send({
      carName: "Model X Updated",
      brand: "Tesla",
      year: 2024,
      color: "Blue",
      price: 95000
    });
    expect(response.status).toBe(204); // 對應 controller 回傳 204
  });

  // deleteCar
  test("DELETE /cars/:id - delete car", async () => {
    const response = await request(app).delete(`/cars/${testCarId}`);
    expect(response.status).toBe(204);
  });
});

afterAll(async () => {
  await connection.close();  // 關閉資料庫連線
});