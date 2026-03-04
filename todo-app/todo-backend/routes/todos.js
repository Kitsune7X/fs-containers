const express = require('express');
const { Todo } = require('../mongo');
const router = express.Router();
const redis = require('../redis/index');

/* GET todos listing. */
router.get('/', async (_, res) => {
	const todos = await Todo.find({});
	res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
	const todo = await Todo.create({
		text: req.body.text,
		done: false,
	});

	let currentTodoCount = (await redis.get('added_todos')) ?? 0;
	// Set redis key value
	await redis.set('added_todos', ++currentTodoCount);
	res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
	const { id } = req.params;
	req.todo = await Todo.findById(id);
	if (!req.todo) return res.sendStatus(404);

	next();
};

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
	await req.todo.delete();
	res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
	res.status(200).json(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
	console.log(req.body);
	const { todo } = req;
	todo.text = req.body.text;
	todo.done = req.body.done;
	const updatedTodo = await todo.save();
	res.status(200).json(updatedTodo);
});

router.use('/:id', findByIdMiddleware, singleRouter);

module.exports = router;
