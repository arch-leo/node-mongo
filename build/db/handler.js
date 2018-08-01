"use strict";
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
function _connectDB(dbUrl, callback) {
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log(err);
        }
        callback(err, db);
    });
}
// 数据库增删改查方法封装
var handler = {
    insertOne: function (dbUrl, colName, doc, options, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var inc = {};
            switch (doc.belong) {
                case '1':
                    inc = { $inc: { id: 1, id1: 1 } };
                    break;
                case '2':
                    inc = { $inc: { id: 1, id2: 1 } };
                    break;
                case '3':
                    inc = { $inc: { id: 1, id3: 1 } };
                    break;
                case '4':
                    inc = { $inc: { id: 1, id4: 1 } };
                    break;
                default:
                    inc = { $inc: { id: 1 } };
                    break;
            }
            // 单个文档自增id  多个文档 要想实现自增id 需要逐条插入
            db.collection(colName).findOneAndUpdate({ count: colName }, inc, options, function (error, result) {
                switch (doc.belong) {
                    case '1':
                        doc.belongId = result.value.id1.toString();
                        break;
                    case '2':
                        doc.belongId = result.value.id2.toString();
                        break;
                    case '3':
                        doc.belongId = result.value.id3.toString();
                        break;
                    case '4':
                        doc.belongId = result.value.id4.toString();
                        break;
                    default:
                        break;
                }
                doc.id = result.value.id.toString();
                db.collection(colName).insertOne(doc, function (err, res) {
                    callback(err, result);
                    db.close();
                });
            });
        });
    },
    insertMany: function (dbUrl, colName, docs, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).insertMany(docs, function (err, result) {
                callback(err, result);
                db.close();
            });
        });
    },
    findOne: function (dbUrl, colName, query, options, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).findOne(query, options, function (err, doc) {
                if (err) {
                    console.log(err);
                    return;
                }
                callback(err, doc);
                db.close();
            });
        });
    },
    findOneAndUpdate: function (dbUrl, colName, query, update, options, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).findOneAndUpdate(query, update, options, function (err, doc) {
                if (err) {
                    console.log(err);
                    return;
                }
                callback(err, doc);
                db.close();
            });
        });
    },
    findMany: function (dbUrl, colName, query, options, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var limit = options.limit || 0;
            var skip = options.skip || 0;
            var sort = options.sort || { _id: 1 };
            db.collection(colName).find(query).limit(limit).skip(skip).sort(sort).toArray(function (err, docs) {
                if (err) {
                    console.log(err);
                    return;
                }
                callback(null, docs);
                db.close();
            });
        });
    },
    deleteOne: function (dbUrl, colName, query, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).deleteOne(query, function (err, result) {
                callback(err, result);
                db.close();
            });
        });
    },
    deleteMany: function (dbUrl, colName, query, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).deleteMany(query, function (err, result) {
                callback(err, result);
                db.close();
            });
        });
    },
    updateOne: function (dbUrl, colName, query, update, options, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).updateOne(query, update, options, function (err, result) {
                callback(err, result);
                db.close();
            });
        });
    },
    updateMany: function (dbUrl, colName, query, update, options, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).updateMany(query, update, options, function (err, result) {
                callback(err, result);
                db.close();
            });
        });
    },
    findInsert: function (dbUrl, colName, query, opts, options, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).findOne(query, opts, function (err, doc) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (doc) {
                    if (doc.times == 4 || doc.times == 9 || doc.times == 14) {
                        db.collection(colName).findOneAndUpdate({ name: query.name }, { $inc: { times: 1, award: 1 } }, options, function (error, result) {
                            callback(err, { vote: 1, award: result.value.award });
                            db.close();
                        });
                    }
                    else if (doc.times == 15) {
                        callback(err, { vote: 0, award: doc.award });
                        db.close();
                    }
                    else {
                        db.collection(colName).findOneAndUpdate({ name: query.name }, { $inc: { times: 1 } }, options, function (error, result) {
                            callback(err, { vote: 1, award: 0 });
                            db.close();
                        });
                    }
                }
                else {
                    query.times = 0;
                    query.award = 0;
                    query.type = 'vote';
                    db.collection(colName).insertOne(query, function (err, res) {
                        callback(err, res);
                        db.close();
                    });
                }
            });
        });
    },
    findUpdate: function (dbUrl, colName, query, opts, options, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).findOne(query, opts, function (err, doc) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (doc.award == 0) {
                    callback(err, { msg: 4, award: 0 });
                    db.close();
                }
                else {
                    db.collection(colName).findOneAndUpdate({ name: query.name }, { $inc: { award: -1 } }, options, function (error, result) {
                        callback(err, { msg: 4, award: result.value.award });
                        db.close();
                    });
                }
            });
        });
    },
    findMainUpdate: function (dbUrl, colName, query, opts, options, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var words = {
                belong: query.belong,
                belongId: query.belongId,
            };
            var update = {
                name: query.name,
                img: query.img
            };
            db.collection(colName).findOneAndUpdate(words, { $set: update }, options, function (error, result) {
                callback(err, result);
                db.close();
            });
        });
    },
    findItemUpdate: function (dbUrl, colName, query, opts, options, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            var words = {
                belong1: query.belong1,
                belong2: query.belong2,
                name: query.keywords
            };
            var update = {
                name: query.name,
                img: query.img,
                good: parseInt(query.good),
                bad: parseInt(query.bad)
            };
            db.collection(colName).findOneAndUpdate(words, { $set: update }, options, function (error, result) {
                callback(err, result);
                db.close();
            });
        });
    },
    findItemClear: function (dbUrl, colName, query, opts, options, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).updateMany({ type: 'vote' }, { $set: { times: 0, award: 0 } }, options, function (error, result) {
                callback(err, result);
                db.close();
            });
        });
    },
    incTimer: function (dbUrl, colName, query, opts, options, callback) {
        _connectDB(dbUrl, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).updateMany({ type: 'items' }, { $set: { times: 0, award: 0 } }, options, function (error, result) {
                callback(err, result);
                db.close();
            });
        });
    }
};
module.exports = handler;
