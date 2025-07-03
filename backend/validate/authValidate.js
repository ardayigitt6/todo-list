exports.registerValidate = (data) => {
    if (!data.username || !data.password) {
        return res.status(400).json({ error: "Kullanıcı adı ve şifre boş olamaz!" });
    }
    return { error: null };
};

exports.loginValidate = (data) => {
    if (!data.username || !data.password) {
        return res.status(400).json({ error: "Kullanıcı adı ve şifre boş olamaz!" });
    }
    return { error: null };
};