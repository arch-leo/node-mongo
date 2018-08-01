"use strict";
var express = require("express");
// 自定义的对数据库操作的方法
var handler = require("../db/handler");
var router = express.Router();
// 注册信息数据库
var db = 'mongodb://localhost:27017/jlj';
router.get('/', function (req, res) {
    res.end('index');
});
// 请求main
router.get('/mains', function (req, res) {
    handler.findMany(db, 'mains', {}, {}, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        res.json(result);
    });
});
router.get('/mains/:id', function (req, res) {
    handler.findMany(db, 'mains', {
        belong: req.params.id
    }, {}, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        res.json(result);
    });
});
router.get('/items', function (req, res) {
    handler.findMany(db, 'items', {}, {}, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        res.json(result);
    });
});
router.get('/items/:id', function (req, res) {
    handler.findMany(db, 'items', {
        belong1: req.params.id
    }, {}, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        res.json(result);
    });
});
router.get('/items/:_id/:id', function (req, res) {
    handler.findMany(db, 'items', {
        belong1: req.params._id,
        belong2: req.params.id
    }, {}, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        res.json(result);
    });
});
router.post('/item/:id', function (req, res) {
    if (!req.body.name) {
        res.json({
            state: 404
        });
        return false;
    }
    if (req.body.type == 'good') {
        handler.findOneAndUpdate(db, 'items', {
            id: req.params.id
        }, {
            $inc: {
                good: 1
            }
        }, {
            returnOriginal: false
        }, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            res.json(result.value);
        });
    } else if (req.body.type == 'bad') {
        handler.findOneAndUpdate(db, 'items', {
            id: req.params.id
        }, {
            $inc: {
                bad: 1
            }
        }, {
            returnOriginal: false
        }, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            res.json(result.value);
        });
    } else {
        handler.findOne(db, 'items', {
            id: req.params.id
        }, {}, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            res.json(result);
        });
    }
});
// post handler
router.post('/add/main', function (req, res) {
    handler.insertOne(db, 'mains', req.body, {
        returnOriginal: false
    }, function (err, result) {
        if (err)
            console.log(err);
        res.json(result);
    });
});
router.post('/add/item', function (req, res) {
    req.body.good = parseInt(req.body.good);
    req.body.bad = parseInt(req.body.bad);
    handler.insertOne(db, 'items', req.body, {
        returnOriginal: false
    }, function (err, result) {
        if (err)
            console.log(err);
        res.json(result);
    });
});
router.post('/vote', function (req, res) {
    handler.findInsert(db, 'users', req.body, {}, {
        returnOriginal: false
    }, function (err, result) {
        if (err)
            console.log(err);
        res.json(result);
    });
});
router.post('/award', function (req, res) {
    handler.findUpdate(db, 'users', req.body, {}, {
        returnOriginal: false
    }, function (err, result) {
        if (err)
            console.log(err);
        res.json(result);
    });
});
router.post('/record', function (req, res) {
    res.json({
        msg: '暂无中奖纪录'
    });
});
// 修改数据 需要加身份验证
router.post('/update/main', function (req, res) {
    if (req.body.pwd != 'leo123456') {
        res.json({
            state: 404
        });
        return false;
    }
    handler.findMainUpdate(db, 'mains', req.body, {}, {
        returnOriginal: false
    }, function (err, result) {
        if (err)
            console.log(err);
        res.json(result);
    });
});
router.post('/update/item', function (req, res) {
    if (req.body.pwd != 'leo123456') {
        res.json({
            state: 404
        });
        return false;
    }
    handler.findItemUpdate(db, 'items', req.body, {}, {
        returnOriginal: false
    }, function (err, result) {
        if (err)
            console.log(err);
        res.json(result);
    });
});
router.get('/clear', function (req, res) {
    if (req.query.pwd != 'leo123456') {
        res.json({
            state: 404
        });
        return false;
    }
    handler.findItemClear(db, 'users', req.body, {}, {
        returnOriginal: false
    }, function (err, result) {
        if (err)
            console.log(err);
        res.json(result);
    });
});
router.get('/timer', function (req, res) {
    if (req.query.pwd != 'leo123456') {
        res.json({
            state: 404
        });
        return false;
    }
    handler.findMany(db, 'items', {
        good: {
            $gte: 0
        }
    }, {}, function (err, result) {
        if (err)
            console.log(err);

        result.forEach(function (mydoc) {
            handler.updateOne(db, 'items', {
                _id: mydoc._id
            }, {
                $inc: {
                    good: parseInt(Math.random() * 40 + 40),
                    bad: parseInt(Math.random() * 10 + 10)
                }
            }, {}, function (err, data) {

            })
        })
        res.json({
            state: 200
        });
    });
});
router.post('/update', function (req, res) {
    if (req.body.pwd != 'leo123456') {
        res.json({
            state: 404
        });
        return false;
    }

    function getRandom() {
        return parseInt(Math.random() * 100 + 50);
    }
    handler.updateMany(db, 'items', {
        'good': 132
    }, {
        $set: {
            'good': getRandom()
        }
    }, {
        returnOriginal: false
    }, function (err, result) {
        if (err)
            console.log(err);
        res.json(result);
    });
});
module.exports = router;