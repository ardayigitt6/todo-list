const { registerValidate, loginValidate } = require("../validate/authValidate");
const authService = require("../services/authService");

// Register (Kayıt Olma) Endpointi
exports.register = async (req, res) => {
    const { error } = registerValidate(req.body);
    if (error) return res.status(400).json({ error });

    try {
        await authService.register(req.body.username, req.body.password);
        res.status(201).json({ message: "Kullanıcı başarıyla kaydedildi." });
    }
    catch (error) {
        res.status(500).json({ error: "Sunucu hatası !!" });
    }
};

// Login(Giriş Yapma) Endpointi
exports.login = async (req, res) => {
    const { error } = loginValidate(req.body);
    if (error) return res.status(400).json({ error });

    try {
        const token = await authService.login(req.body.username, req.body.password);
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ error: "Sunucu hatası !!" });
    }
};

// Logout (Çıkış) Endpointi
exports.logout = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    try {
        await authService.logout(token);
        res.json({ message: "Çıkış yapıldı!" });
    }
    catch (err) {
        res.status(500).json({ error: "Sunucu hatası !!" });
    }
};
