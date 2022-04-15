const request = require("supertest");
const app = require("../src/app");
const contract_status = require("../src/enums/contract_status");

describe("Test Contracts", () => {

  test("Should be able to list all contracts belongs a client", async () => {
    const profile_id = 4
    const response = await request(app).get("/contracts").set({ profile_id })

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(3);
    response.body.map(item => {
      expect(item.status).not.toEqual(contract_status.TERMINATED);
      expect(item.ClientId).toEqual(profile_id);
    })
  })

  test("Should be able to list all contracts as a contractor profile", async () => {
    const profile_id = 8
    const response = await request(app).get("/contracts").set({ profile_id })

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
    response.body.map(item => {
      expect(item.status).not.toEqual(contract_status.TERMINATED);
      expect(item.ContractorId).toEqual(profile_id);
    })
  })

  test("Should be able to list a contract as a contractor profile given a contract id", async () => {
    const profile_id = 6;
    const contract_id = 2
    const response = await request(app).get(`/contracts/${contract_id}`).set({ profile_id })

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.ContractorId).toEqual(profile_id);
  })

  test("Should be able to list a contract belongs a client given a contract id", async () => {
    const profile_id = 4;
    const contract_id = 9;
    const response = await request(app).get(`/contracts/${contract_id}`).set({ profile_id })

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.ClientId).toEqual(profile_id);
  })

  test("Should not be able to list contracts whose status is TERMINATED", async () => {
    const profile_id = 5;
    const response = await request(app).get("/contracts").set({ profile_id })

    expect(response.statusCode).toBe(404);
  })

  test("Should not be able to list a contract with an invalid/inexistent profile", async () => {
    const profile_id = 1895;
    const contract_id = 4;
    const response = await request(app).get(`/contracts/${contract_id}`).set({ profile_id });

    expect(response.statusCode).toBe(401);
  });

  test("Should not be able to list a contract if profile_id is not sent", async () => {
    const contract_id = 4;
    const response = await request(app).get(`/contracts/${contract_id}`);

    expect(response.statusCode).toBe(401);
  });

  test("Should not be able to list a contract which not belongs to a client given a contract id", async () => {
    const profile_id = 4;
    const contract_id = 4;
    const response = await request(app).get(`/contracts/${contract_id}`).set({ profile_id });

    expect(response.statusCode).toBe(404);
  });
});