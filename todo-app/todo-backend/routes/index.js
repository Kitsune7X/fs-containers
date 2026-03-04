const express = require('express');
const router = express.Router();

const configs = require('../util/config');

const redis = require('../redis');

let visits = 0;

/* GET index data. */
router.get('/', async (req, res) => {
	visits++;

	res.send({
		...configs,
		visits,
	});
});

/* GET todos count */
router.get('/statistics', async (_, res) => {
	const addedTodoCount = (await redis.get('added_todos')) ?? 0;
	res.status(200).json({ added_todos: +addedTodoCount });
});

module.exports = router;
