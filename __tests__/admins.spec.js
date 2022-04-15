const request = require("supertest");
const app = require("../src/app");

describe("Test Admins", () => {

  test("Should  be able to list the best profession given a date", async () => {
    const profile_id = 1;
    const startDate = "2020-08-14";
    const endDate = "2020-08-17";

    const response = await request(app).get(`/admin/best-profession/?start=${startDate}&end=${endDate}`)
      .set({ profile_id: profile_id })

    expect(response.statusCode).toEqual(200);
    expect(response.body.profession).toEqual("Programmer");
  });

  test("Should not be able to list the best professions given an out of range date", async () => {
    const profile_id = 1;
    const startDate = "2022-08-14";
    const endDate = "2022-08-17";

    const response = await request(app).get(`/admin/best-profession/?start=${startDate}&end=${endDate}`)
      .set({ profile_id: profile_id })

    expect(response.statusCode).toEqual(404);
  });

  test("Should be able to list the best clients given a date", async () => {
    const profile_id = 1;
    const startDate = "2020-08-14";
    const endDate = "2020-08-17";
    const limit = 4;

    const response = await request(app).get(`/admin/best-clients/?start=${startDate}&end=${endDate}&limit=${limit}`)
      .set({ profile_id: profile_id })

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(4);
  });

  test("Should be able to list the first two best clients if limit param is omitted from query", async () => {
    const profile_id = 1;
    const startDate = "2020-08-14";
    const endDate = "2020-08-17";

    const response = await request(app).get(`/admin/best-clients/?start=${startDate}&end=${endDate}`)
      .set({ profile_id: profile_id })

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  });

  test("Should be able to list the first two best clients if limit param is sent as not a number", async () => {
    const profile_id = 1;
    const startDate = "2020-08-14";
    const endDate = "2020-08-17";
    const limit = "b";

    const response = await request(app).get(`/admin/best-clients/?start=${startDate}&end=${endDate}&limit=${limit}`)
      .set({ profile_id: profile_id })

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  });

  test("Should not be able to list the best clients given an out of range date", async () => {
    const profile_id = 1;
    const startDate = "2022-08-14";
    const endDate = "2022-08-17";
    const limit = 4;

    const response = await request(app).get(`/admin/best-clients/?start=${startDate}&end=${endDate}&limit=${limit}`)
      .set({ profile_id: profile_id })

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(0);
  });
});