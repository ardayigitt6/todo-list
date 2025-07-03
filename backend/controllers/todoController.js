const { todoTitleValidate } = require("../validate/todoValidate");
const todoService = require("../services/todoService");

// GET/ todos
exports.getTodos = async (req, res) => {
    try {
        const result = await todoService.getTodos(req.user.owner, req.query);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: "Sunucu hatası !!" });
    }
};

// POST/ todos
exports.createTodo = async (req, res) => {
    const { error } = todoTitleValidate(req.body);
    if (error) return res.status(400).json({ error });

    try {
        const newTodo = await todoService.createTodo(req.body.title, req.user.owner);
        res.status(201).json(newTodo);
    }
    catch (error) {
        res.status(500).json({ error: "Sunucu hatası !!" });
    }
};

// PUT/ todos/:id
exports.updateTodo = async (req, res) => {
    const { error } = todoTitleValidate(req.body);
    if (error) return res.status(400).json({ error });

    try {
        const updatedTodo = await todoService.updateTodo(req.params.id, req.user.owner, req.body.title);
        if (!updatedTodo) {
            return res.status(404).json({ error: "Todo bulunmadı!" });
        }
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: "Sunucu hatası !!" });
    }
}

//DELETE/ todos/:id
exports.deleteTodo = async (req, res) => {

    try {
        const deletedTodo = await todoService.deleteTodo(req.params.id, req.user.owner);
        if (!deletedTodo) {
            return res.status(404).json({ error: "Todo bulunmadı !" });
        }
        res.json({ message: "Todo silindi." });
    } catch (error) {
        res.status(500).json({ error: "Sunucu hatası !!" });
    }
};

//PATCH/ todos/:id/complete
exports.toggleComplete = async (req, res) => {
    try {
        const todo = await todoService.toggleComplete(req.params.id, req.user.owner);
        if (!todo) {
            return res.status(404).json({ error: "Todo bulunmadı !" });
        }
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: "Sunucu hatası !!" });
    }
}












