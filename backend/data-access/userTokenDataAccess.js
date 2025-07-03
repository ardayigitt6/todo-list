const UserToken = require("../models/UserToken");

exports.createToken = async (tokenData) => {
    return await UserToken.create(tokenData);
};

exports.deleteToken = async (token) => {
    return await UserToken.deleteOne({ token });
};
