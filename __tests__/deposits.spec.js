const request = require("supertest");
const app = require("../src/app");

describe("Test Deposit", () => {

  test("Should not be able to deposit client balance", async () => {
    const profile_id = 1;
    const user_id = 4;
    const amount = 200;

    const response = await request(app).post(`/balances/deposit/${user_id}`)
      .set({ profile_id: profile_id })
      .send({ "amount": amount });

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual("Deposit made successfully!");
  });

  test("Should not be able to deposit client balance if deposit amount is greater than 25% of the total sum of jobs", async () => {
    const profile_id = 1;
    const user_id = 4;
    const amount = 500;

    const response = await request(app).post(`/balances/deposit/${user_id}`)
      .set({ profile_id: profile_id })
      .send({ "amount": amount });

    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("You cannot deposit an amount greater than 25% of the sum of your job payable");
  });
});