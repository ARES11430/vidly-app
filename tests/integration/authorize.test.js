const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
let server;

describe("Authorize middleware", () => {
  let token;

  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genre.deleteMany({});
  });

  const execute = () => {
    return request(server).post("/api/genres").set("x-auth-token", token).send({
      name: "Comedy",
    });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if not token is provided", async () => {
    token = "";
    const res = await execute();
    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await execute();
    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await execute();
    expect(res.status).toBe(200);
  });
});
