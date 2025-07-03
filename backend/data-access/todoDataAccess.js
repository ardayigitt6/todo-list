const Todo = require("../models/Todo");

exports.findTodos = async (query, sortOrder, skip, limit) => {
    return await Todo.find(query).sort({ createdAt: sortOrder }).skip(skip).limit(limit);
};

exports.countTodos = async (query) => {
    return await Todo.countDocuments(query);
};

exports.createTodo = async (todoData) => {
    const todo = new Todo(todoData);
    return await todo.save();
};

exports.updateTodo = async (id, owner, title) => {
    return await Todo.findOneAndUpdate({ _id: id, owner }, { title }, { new: true });
};

exports.deleteTodo = async (id, owner) => {
    return await Todo.findOneAndDelete({ _id: id, owner });
};

exports.findTodoById = async (id, owner) => {
    return await Todo.findOne({ _id: id, owner });
};