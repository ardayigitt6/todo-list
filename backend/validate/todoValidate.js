exports.todoTitleValidate = (data) => {
    if (!data.title) {
        return res.status(400).json({ error: "Başlık gerekli !" });
    }
    return { error: null };
};