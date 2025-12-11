const request = require("supertest");
const app = require("../server");
const { MongoClient, ObjectId } = require("mongodb");

let connection;
let db;
let repairId;
let carId;

beforeAll(async () => {
  connection = await MongoClient.connect(process.env.MONGODB_URL);
  db = connection.db("CarShop");
});

beforeEach(async () => {
  await db.collection("Repair").deleteMany({});
  await db.collection("Cars").deleteMany({});
});

afterAll(async () => {
  await connection.close();
});

describe("Repair API CRUD Test", () => {

  test("POST /repair → create a repair order", async () => {

    // Insert a car because your repair probably references carId
    const insertedCar = await db.collection("Cars").insertOne({
      carName: "Model X",
      brand: "Tesla",
      year: "2020",
      color: "Black",
      price: "100000"
    });

    carId = insertedCar.insertedId.toString();

    const response = await request(app)
      .post("/repair")
      .send({
        carId: carId,
        date: "2024-01-02",
        description: "Brake replacement",
        status: "Pending"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("insertedId");

    repairId = response.body.insertedId;
  });

  test("GET /repair/:id → get one repair", async () => {

    const insertedRepair = await db.collection("Repair").insertOne({
      carId: new ObjectId(),
      date: "2024-01-05",
      description: "Oil change",
      status: "Done"
    });

    const response = await request(app).get(`/repair/${insertedRepair.insertedId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("description", "Oil change");
  });

  test("GET /repair → list repairs", async () => {
    const response = await request(app).get("/repair");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("PUT /repair/:id → update repair", async () => {
    const insertedRepair = await db.collection("Repair").insertOne({
      carName: "Model X",
      brand: "Tesla",
      year: 2020,
      entryMonth: "2024-01-01",
      Status: "Pending",
      RepairCost: 5000,
      completionDate: "2024-02-01"
    });

    const response = await request(app)
      .put(`/repair/${insertedRepair.insertedId}`)
      .send({
        carName: "Model X",
        brand: "Tesla",
        year: 2020,
        entryMonth: "2024-01-01",
        Status: "Completed",
        RepairCost: 5500,
        completionDate: "2024-01-15"
      });

    expect(response.status).toBe(204);

    const updated = await db.collection("Repair").findOne({ _id: insertedRepair.insertedId });
    expect(updated.Status).toBe("Completed");
    expect(updated.RepairCost).toBe(5500);
  });

  test("DELETE /repair/:id → delete repair", async () => {
    const insertedRepair = await db.collection("Repair").insertOne({
      carName: "Civic",
      brand: "Honda",
      year: 2021,
      entryMonth: "2024-01-05",
      Status: "Completed",
      RepairCost: 3000,
      completionDate: "2024-01-10"
    });

    const response = await request(app).delete(`/repair/${insertedRepair.insertedId}`);

    expect(response.status).toBe(204);

    const deleted = await db.collection("Repair").findOne({ _id: insertedRepair.insertedId });
    expect(deleted).toBeNull();
  });

});
