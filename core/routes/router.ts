import * as express from 'express';
import * as http from 'http';
import * as util from 'util';
import * as path from 'path';
import * as fs from 'fs';

// 自定义的对数据库操作的方法
import * as handler from '../db/handler';

const router = express.Router();

// 注册信息数据库
const db = 'mongodb://jlj:leo123456@127.0.0.1:10000/jlj';
router.get('/', (req, res) => {
	res.end('index');
});

// 请求main
router.get('/mains', (req, res) => {
	handler.findMany(db, 'mains', {}, {}, (err, result) => {
		if (err) {
			console.log(err);
			return;
		}
		res.json(result);
	});
});
router.get('/mains/:id', (req, res) => {
	handler.findMany(db, 'mains', { belong: req.params.id }, {}, (err, result) => {
		if (err) {
			console.log(err);
			return;
		}
		res.json(result);
	});
});
router.get('/items', (req, res) => {
	handler.findMany(db, 'items', {}, {}, (err, result) => {
		if (err) {
			console.log(err);
			return;
		}
		res.json(result);
	});
});
router.get('/items/:id', (req, res) => {
	handler.findMany(db, 'items', { belong1: req.params.id }, {}, (err, result) => {
		if (err) {
			console.log(err);
			return;
		}
		res.json(result);
	});
});
router.get('/items/:_id/:id', (req, res) => {
	handler.findMany(db, 'items', { belong1: req.params._id, belong2: req.params.id }, {}, (err, result) => {
		if (err) {
			console.log(err);
			return;
		}
		res.json(result);
	});
});
router.post('/item/:id', (req, res) => {
	if (!req.body.name) {
		res.json({ state: 404 });
		return false;
	}
	if (req.body.type == 'good') {
		handler.findOneAndUpdate(db, 'items', { id: req.params.id }, { $inc: { good: 1 } }, { returnOriginal: false }, (err, result) => {
			if (err) {
				console.log(err);
				return;
			}
			res.json(result.value);
		});
	} else if (req.body.type == 'bad') {
		handler.findOneAndUpdate(db, 'items', { id: req.params.id }, { $inc: { bad: 1 } }, { returnOriginal: false }, (err, result) => {
			if (err) {
				console.log(err);
				return;
			}
			res.json(result.value);
		});
	} else {
		handler.findOne(db, 'items', { id: req.params.id }, {}, (err, result) => {
			if (err) {
				console.log(err);
				return;
			}
			res.json(result);
		});
	}
});

// post handler
router.post('/add/main', (req, res) => {
	handler.insertOne(db, 'mains', req.body, { returnOriginal: false }, (err, result) => {
		if (err) console.log(err);
		res.json(result);
	});
});
router.post('/add/item', (req, res) => {
	req.body.good = parseInt(req.body.good);
	req.body.bad = parseInt(req.body.bad);
	handler.insertOne(db, 'items', req.body, { returnOriginal: false }, (err, result) => {
		if (err) console.log(err);
		res.json(result);
	});
});
router.post('/vote', (req, res) => {
	handler.findInsert(db, 'users', req.body, {}, { returnOriginal: false }, (err, result) => {
		if (err) console.log(err);
		res.json(result);
	});
});
router.post('/award', (req, res) => {
	handler.findUpdate(db, 'users', req.body, {}, { returnOriginal: false }, (err, result) => {
		if (err) console.log(err);
		res.json(result);
	});
});
router.post('/record', (req, res) => {
	res.json({ msg: '暂无中奖纪录' });
});

// 修改数据 需要加身份验证
router.post('/update/main', (req, res) => {
	if (req.body.pwd != 'leo123456') {
		res.json({ state: 404 });
		return false;
	}
	handler.findMainUpdate(db, 'mains', req.body, {}, { returnOriginal: false }, (err, result) => {
		if (err) console.log(err);
		res.json(result);
	});
});
router.post('/update/item', (req, res) => {
	if (req.body.pwd != 'leo123456') {
		res.json({ state: 404 });
		return false;
	}
	handler.findItemUpdate(db, 'items', req.body, {}, { returnOriginal: false }, (err, result) => {
		if (err) console.log(err);
		res.json(result);
	});
});
router.get('/clear', (req, res) => {
	if (req.body.pwd != 'leo123456') {
		res.json({ state: 404 });
		return false;
	}
	handler.findItemClear(db, 'users', req.body, {}, { returnOriginal: false }, (err, result) => {
		if (err) console.log(err);
		res.json(result);
	});
});

export = router;