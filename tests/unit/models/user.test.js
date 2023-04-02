const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

describe("user.generateAuthToken", () => {
  it("Should generate valid jwt", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    expect(decoded).toMatchObject(payload);
  });
});
