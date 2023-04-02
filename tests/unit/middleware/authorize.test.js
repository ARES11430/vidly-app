const { User } = require("../../../models/user");
const { authorize } = require("../../../middleware/authorize");
const mongoose = require("mongoose");

describe("Authorize middleware unit", () => {
  it("Should populate req.user with the payload of a valid JWT", () => {
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();

    authorize(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
