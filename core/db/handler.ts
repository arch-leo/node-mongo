import * as mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;

function _connectDB(dbUrl, callback) {
    MongoClient.connect(dbUrl, (err, db) => {
        if (err) { console.log(err); }
        callback(err, db);
    });
}

// 数据库增删改查方法封装
const handler = {
    insertOne(dbUrl, colName, doc, options, callback) {
        _connectDB(dbUrl, (err, db) => {
            if (err) {
                console.log(err);
                return;
            }
            let inc = {};
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
            db.collection(colName).findOneAndUpdate({ count: colName }, inc, options, (error, result) => {
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
                db.collection(colName).insertOne(doc, (err, res) => {
                    callback(err, result);
                    db.close();
                });
            });
        });
    },
    insertMany(dbUrl, colName, docs, callback) {
        _connectDB(dbUrl, (err, db) => {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).insertMany(docs, (err, result) => {
                callback(err, result);
                db.close();
            });
        });
    },
    findOne(dbUrl, colName, query, options, callback) {
        _connectDB(dbUrl, (err, db) => {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).findOne(query, options, (err, doc) => {
                if (err) {
                    console.log(err);
                    return;
                }
                callback(err, doc);
                db.close();
            });
        });
    },
    findOneAndUpdate(dbUrl, colName, query, update, options, callback) {
        _connectDB(dbUrl, (err, db) => {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).findOneAndUpdate(query, update, options, (err, doc) => {
                if (err) {
                    console.log(err);
                    return;
                }
                callback(err, doc);
                db.close();
            });
        });
    },
    findMany(dbUrl, colName, query, options, callback) {
        _connectDB(dbUrl, (err, db) => {
            if (err) {
                console.log(err);
                return;
            }
            let limit = options.limit || 0;
            let skip = options.skip || 0;
            let sort = options.sort || { _id: 1 };
            db.collection(colName).find(query).limit(limit).skip(skip).sort(sort).toArray((err, docs) => {
                if (err) {
                    console.log(err);
                    return;
                }
                callback(null, docs);
                db.close();
            });
        });
    },
    deleteOne(dbUrl, colName, query, callback) {
        _connectDB(dbUrl, (err, db) => {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).deleteOne(query, (err, result) => {
                callback(err, result);
                db.close();
            });
        });
    },
    deleteMany(dbUrl, colName, query, callback) {
        _connectDB(dbUrl, (err, db) => {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).deleteMany(query, (err, result) => {
                callback(err, result);
                db.close();
            });
        });
    },
    updateOne(dbUrl, colName, query, update, options, callback) {
        _connectDB(dbUrl, (err, db) => {
            if (err) {
                console.log(err);
                return;
            }

            db.collection(colName).updateOne(query, update, options, (err, result) => {
                callback(err, result);
                db.close();
            });
        });
    },
    updateMany(dbUrl, colName, query, update, options, callback) {
        _connectDB(dbUrl, (err, db) => {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).updateMany(query, update, options, (err, result) => {
                callback(err, result);
                db.close();
            });
        });
    },
    findInsert(dbUrl, colName, query, opts, options, callback) {            //如果用户不存在增加用户   否则增加投票次数和抽奖次数
        _connectDB(dbUrl, (err, db) => {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).findOne(query, opts, (err, doc) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (doc) {
                    if (doc.times == 4 || doc.times == 9 || doc.times == 14) {
                        db.collection(colName).findOneAndUpdate({ name: query.name }, { $inc: { times: 1, award: 1 } }, options, (error, result) => {
                            callback(err, { vote: 1, award: result.value.award });
                            db.close();
                        });
                    } else if (doc.times == 15) {
                        callback(err, { vote: 0, award: doc.award });
                        db.close();
                    } else {
                        db.collection(colName).findOneAndUpdate({ name: query.name }, { $inc: { times: 1 } }, options, (error, result) => {
                            callback(err, { vote: 1, award: 0 });
                            db.close();
                        });
                    }
                } else {
                    query.times = 0;
                    query.award = 0;
                    query.type = 'vote';
                    db.collection(colName).insertOne(query, (err, res) => {
                        callback(err, res);
                        db.close();
                    });
                }
            });
        });
    },
    findUpdate(dbUrl, colName, query, opts, options, callback) {            //如果用户不存在增加用户   否则增加投票次数和抽奖次数
        _connectDB(dbUrl, (err, db) => {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).findOne(query, opts, (err, doc) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (doc.award == 0) {
                    callback(err, { msg: 4, award: 0 });
                    db.close();
                } else {
                    db.collection(colName).findOneAndUpdate({ name: query.name }, { $inc: { award: -1 } }, options, (error, result) => {
                        callback(err, { msg: 4, award: result.value.award });
                        db.close();
                    });
                }
            });
        });
    },
    findMainUpdate(dbUrl, colName, query, opts, options, callback) {
        _connectDB(dbUrl, (err, db) => {
            if (err) {
                console.log(err);
                return;
            }
            let words = {
                belong: query.belong,
                belongId: query.belongId,
            }
            let update = {
                name: query.name,
                img: query.img
            }
            db.collection(colName).findOneAndUpdate(words, { $set: update }, options, (error, result) => {
                callback(err, result);
                db.close();
            });
        });
    },
    findItemUpdate(dbUrl, colName, query, opts, options, callback) {
        _connectDB(dbUrl, (err, db) => {
            if (err) {
                console.log(err);
                return;
            }
            let words = {
                belong1: query.belong1,
                belong2: query.belong2,
                name: query.keywords
            }
            let update = {
                name: query.name,
                img: query.img,
                good: parseInt(query.good),
                bad: parseInt(query.bad)
            }
            db.collection(colName).findOneAndUpdate(words, { $set: update }, options, (error, result) => {
                callback(err, result);
                db.close();
            });
        });
    },
    findItemClear(dbUrl, colName, query, opts, options, callback) {
        _connectDB(dbUrl, (err, db) => {
            if (err) {
                console.log(err);
                return;
            }
            db.collection(colName).updateMany({ type: 'vote' }, { $set: { times: 0, award: 0 } }, options, (error, result) => {
                callback(err, result);
                db.close();
            });
        });
    }

};

export = handler;