const todoDataAccess = require("../data-access/todoDataAccess");

exports.getTodos = async (owner, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = (query.search || "").trim();
    const shouldHideCompleted = query.shouldHideCompleted === "true";
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;

    const dbQuery = { owner, ...(search ? { title: { $regex: search, $options: "i" } } : {}) };
    if (shouldHideCompleted) {
        dbQuery.completed = { $ne: true }
    }

    const todos = await todoDataAccess.findTodos(dbQuery, sortOrder, skip, limit);
    const totalTodos = await todoDataAccess.countTodos(dbQuery);

    return {
        currentPage: page,
        totalPages: Math.ceil(totalTodos / limit),
        totalTodos,
        todos,
    };
};

exports.createTodo = async (title, owner) => {
    return await todoDataAccess.createTodo({ title, owner });
};

exports.updateTodo = async (id, owner, title) => {
    return await todoDataAccess.updateTodo({ id, owner, title });
};

exports.deleteTodo = async (id, owner) => {
    return await todoDataAccess.deleteTodo({ id, owner });
};

exports.toggleComplate = async (id, owner) => {
    const todo = await todoDataAccess.findTodoById(id, owner);
    if (!todo) return null;
    todo.completed = !todo.completed;
    await todo.save();
    return todo;
};
