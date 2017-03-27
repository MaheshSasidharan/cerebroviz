var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var path = require('path');
var fs = require("fs");
var glob = require("glob");

//var multiparty = require('../node_modules/multiparty/index');
var multiparty = require('multiparty');
var Helper = require('../CommonFactory/helper');
var Constants = require('../CommonFactory/constants');

//var multipartyMiddleware = multiparty();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/GetAssessments', function(req, res, next) {
    var params = {
        errors: {
            errors_101: Constants.Errors._101,
            queryFailed: Constants.Errors.Assessments.GetAssessmentQuestionFailed
        },
        query: Constants.Queries.Assessments.GetAssessmentQuestions.query,
        callback: function(rows) {
            if (rows && rows.length) {
                //res.json({status: true, assessments: rows});
                var params = {
                    errors: {
                        errors_101: Constants.Errors._101,
                        queryFailed: Constants.Errors.Assessments.GetAssessmentResponseFailed
                    },
                    query: Constants.Queries.Assessments.GetAssessmentResponse.query,
                    whereVals: [req.session.id],
                    callback: function(rowsInner) {
                        if (rowsInner && rowsInner.length) {
                            rowsInner.forEach(function(oResponse) {
                                if (oResponse.questionId) {
                                    var index = Helper.FindItemInArray(rows, "questionId", oResponse.questionId, "index");
                                    if (index != null) {
                                        rows[index].response = oResponse.response;
                                        rows[index].responseTextId = oResponse.responseTextId;
                                    }
                                }
                            });
                        }
                        res.json({ status: true, assessments: rows });
                    }
                };
                handle_database(req, res, params);
            } else {
                res.json({ status: false, msg: Constants.Errors.Assessments.GetAssessmentResponseFailed });
            }
        }
    };
    handle_database(req, res, params);
});

router.post('/SaveAssessments', function(req, res) {
    var oSaveItem = req.body.oSaveItem;
    if (oSaveItem && oSaveItem.length) {
        var arrInserts = [];
        var arrUpdates = [];
        oSaveItem.forEach(function(oItem) {
            if (oItem.responseTextId) {
                arrUpdates.push(oItem);
            } else {
                arrInserts.push(oItem);
            }
        });

        if (arrInserts.length) {
            var whereVals = [];
            arrInserts.forEach(function(oItem) {
                whereVals.push([req.session.id, oItem.questionId, oItem.response]);
            });
            var params = {
                sType: "BulkInsert",
                errors: {
                    errors_101: Constants.Errors._101,
                    queryFailed: Constants.Errors.Assessments.SaveAssessmentFailed
                },
                query: Constants.Queries.Assessments.InsertResponse.query,
                whereVals: whereVals,
                callback: function(rowsInner) {
                    console.log(rowsInner);
                    res.json({ status: true, insertedId: rowsInner, message: "Inserted" });
                }
            };
            handle_database(req, res, params);
        }

        if (arrUpdates.length) {
            // If we have something to be updated
            var whereVals = null;
            var pendingUpdates = arrUpdates.length;
            arrUpdates.forEach(function(oItem) {
                whereVals = [{ response: oItem.response }, oItem.responseTextId];
                var params = {
                    sType: "IndividualUpdate",
                    errors: {
                        errors_101: Constants.Errors._101,
                        queryFailed: Constants.Errors.Assessments.SaveAssessmentFailed
                    },
                    query: Constants.Queries.Assessments.UpdateResponse.query,
                    whereVals: whereVals,
                    callback: function(rowsInner) {
                        if (!(--pendingUpdates)) {
                            res.json({ status: true, message: "Updated" });
                        }
                    }
                };
                handle_database(req, res, params);
            });
        }
    }
});

router.post('/AudioUpload', function(req, res, next) {
    if (req.body.oSaveItem) {
        // Create folder for user if it does not exist
        var userDir = req.session.id;
        Helper.CreateUserDirectories(userDir, false);
        var buf = new Buffer(req.body.oSaveItem.blob, 'base64'); // decode
        Helper.SaveFileToDisk(["AllUsersAssessments", userDir, "audio", "voiceAssessment", req.body.oSaveItem.character + ".mp3"], buf, res);
    } else {
        return res.json({ status: false });
    }
});

router.post('/AudioUploadWord', function(req, res, next) {
    if (req.body.oSaveItem) {
        var sourceFolderName = 'AssessmentAssets/soundClips';
        // Create folder for user if it does not exist
        var userDir = req.session.id;
        Helper.CreateUserDirectories(userDir, false);

        var nAssmntNum = req.body.oSaveItem.sVoicePrefix;
        var pattern = sourceFolderName + "/" + nAssmntNum + "_[a-z0-9]*.mp3";
        var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

        function cb(er, files) {
            if (files.length) { // Found matches
                if (files.length > 1) { // Found multiple matches
                    res.json({ code: 405, status: false, msg: "Multiple matches found" });
                }
                var fileName = files[0].split(sourceFolderName + '/')[1];
                var buf = new Buffer(req.body.oSaveItem.blob, 'base64'); // decode
                Helper.SaveFileToDisk(["AllUsersAssessments", userDir, "audio", "audioAssessment", fileName], buf, res);
            } else {
                res.json({ code: 404, status: false, msg: "File not found" });
            }
        }
    } else {
        return res.json({ status: false });
    }
});

router.get('/GetAudioAssessment', function(req, res, next) {
    var nAssmntNum = req.query.nAssmntNum;
    var pattern = "AssessmentAssets/soundClips/" + nAssmntNum + "_[a-z0-9]*.mp3";
    var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

    function cb(er, files) {
        if (files.length) { // Found matches
            if (files.length > 1) { // Found multiple matches
                res.json({ code: 405, status: false, msg: "Multiple matches found" });
            }
            res.set({ 'Content-Type': 'audio/mp3' });
            var root = __dirname.split('/routes')[0];
            var filepath = path.resolve(root + "/bin/" + files[0]);
            var readStream = fs.createReadStream(filepath);
            readStream.pipe(res);
        } else {
            res.json({ code: 404, status: false, msg: "File not found" });
        }
    }
});

router.get('/GetSyncVoiceAssessment', function(req, res, next) {
    var nAssmntNum = req.query.nAssmntNum;
    var pattern = "AssessmentAssets/syncVoice/" + nAssmntNum + "_[a-z]*.wav";
    var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

    function cb(er, files) {
        if (files.length) { // Found matches
            if (files.length > 1) { // Found multiple matches
                res.json({ code: 405, status: false, msg: "Multiple matches found" });
            }
            res.set({ 'Content-Type': 'audio/mpeg' });
            var root = __dirname.split('/routes')[0];
            var filepath = path.resolve(root + "/bin/" + files[0]);
            var readStream = fs.createReadStream(filepath);
            readStream.pipe(res);
        } else {
            res.json({ code: 404, status: false, msg: "File not found" });
        }
    }
});

router.post('/AudioSyncVoiceUpload', function(req, res, next) {
    if (req.body.oSaveItem) {
        var sourceFolderName = 'AssessmentAssets/syncVoice';
        // Create folder for user if it does not exist
        var userDir = req.session.id;
        Helper.CreateUserDirectories(userDir, false);

        var nAssmntNum = req.body.oSaveItem.sVoicePrefix;
        var pattern = sourceFolderName + "/" + nAssmntNum + "_[a-z]*.wav";
        var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

        function cb(er, files) {
            if (files.length) { // Found matches
                if (files.length > 1) { // Found multiple matches
                    res.json({ code: 405, status: false, msg: "Multiple matches found" });
                }
                var fileName = files[0].split(sourceFolderName + '/')[1];
                var buf = new Buffer(req.body.oSaveItem.blob, 'base64'); // decode
                Helper.SaveFileToDisk(["AllUsersAssessments", userDir, "audio", "syncVoiceAssessment", fileName], buf, res);
            } else {
                res.json({ code: 404, status: false, msg: "File not found" });
            }
        }
    } else {
        return res.json({ status: false });
    }
});

router.post('/AudioPicturePromptVoiceUpload', function(req, res, next) {
    if (req.body.oSaveItem) {        
        // Create folder for user if it does not exist
        var userDir = req.session.id;
        Helper.CreateUserDirectories(userDir, false);

        // Next create only folders related to Picture Prompt
        var sSetName = req.body.oSaveItem.sSetName;
        
        var picturePromptDir = userDir + "/audio" + "/picturePromptAssessment" + "/" + sSetName;
        Helper.CreateUserDirectories(picturePromptDir, true);
        
        var sPicName = req.body.oSaveItem.sPicName + ".wav";
        var buf = new Buffer(req.body.oSaveItem.blob, 'base64'); // decode
        Helper.SaveFileToDisk(["AllUsersAssessments", userDir, "audio", "picturePromptAssessment", sSetName, sPicName], buf, res);
    } else {
        return res.json({ status: false });
    }
});

router.get('/GetPicNamesMatrixAssessment', function(req, res, next) {
    var initPath = "AssessmentAssets/matrixPics/";
    var pattern = initPath + "**/*";
    var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

    function cb(er, files) {
        if (files.length) {
            var arrPicNames = [];
            files.forEach(function(filePath) {
                filePath = filePath.substring(filePath.indexOf(initPath) + initPath.length);
                //if (filePath.indexOf(".") >= 0) {
                arrPicNames.push(filePath);
                //}
            });
            res.json({ status: true, arrPicNames: arrPicNames });
        } else {
            res.json({ code: 404, status: false, msg: "File not found" });
        }
    }
});

router.get('/GetMatrixAssessment', function(req, res, next) {
    var sSetName = req.query.sSetName;
    var sSetType = req.query.sSetType;
    var sPicName = req.query.sPicName;
    var pattern = "AssessmentAssets/matrixPics/" + sSetName + "/" + sSetType + "/" + sPicName;
    var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

    function cb(er, files) {
        if (files.length) { // Found matches
            if (files.length > 1) { // Found multiple matches
                res.json({ code: 405, status: false, msg: "Multiple matches found" });
            }
            var root = __dirname.split('/routes')[0];
            var img = fs.readFileSync(root + "/bin/" + files[0]);
            var fileExtenstion = files[0].substring(files[0].indexOf(".") + 1);
            res.writeHead(200, { 'Content-Type': 'image/' + fileExtenstion });
            res.end(img, 'binary');
        } else {
            res.json({ code: 404, status: false, msg: "File not found" });
        }
    }
});

router.get('/GetPicNamesPicturePrompt', function(req, res, next) {
    var initPath = "AssessmentAssets/picturePrompt/";
    var pattern = initPath + "**/*";
    var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

    function cb(er, files) {
        if (files.length) {
            var arrPicNames = [];
            files.forEach(function(filePath) {
                filePath = filePath.substring(filePath.indexOf(initPath) + initPath.length);
                //if (filePath.indexOf(".") >= 0) {
                arrPicNames.push(filePath);
                //}
            });
            res.json({ status: true, arrPicNames: arrPicNames });
        } else {
            res.json({ code: 404, status: false, msg: "File not found" });
        }
    }
});

router.get('/GetPicturePromptAssessment', function(req, res, next) {
    var sSetName = req.query.sSetName;
    var sPicName = req.query.sPicName;
    var pattern = "AssessmentAssets/picturePrompt/" + sSetName + "/" + sPicName;
    var mg = new glob.Glob(pattern, { 'nocase': true }, cb);

    function cb(er, files) {
        if (files.length) { // Found matches
            if (files.length > 1) { // Found multiple matches
                res.json({ code: 405, status: false, msg: "Multiple matches found" });
            }
            var root = __dirname.split('/routes')[0];
            var img = fs.readFileSync(root + "/bin/" + files[0]);
            var fileExtenstion = files[0].substring(files[0].indexOf(".") + 1);
            res.writeHead(200, { 'Content-Type': 'image/' + fileExtenstion });
            res.end(img, 'binary');
        } else {
            res.json({ code: 404, status: false, msg: "File not found" });
        }
    }
});

var env = process.env.NODE_ENV || 'development';
var config = require('../config')[env];
var pool = mysql.createPool(config.poolConfig);

function handle_database(req, res, params) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json(params.errors.errors_101);
            return;
        }
        switch (params.sType) {
            case "BulkInsert":
                connection.query(params.query, [params.whereVals], function(err, rows) {
                    connection.release();
                    if (!err) {
                        params.callback(rows);
                    } else {
                        res.json({ status: false, msg: params.errors.queryFailed });
                    }
                });
                break;
            case "IndividualUpdate":
                connection.query(params.query, params.whereVals, function(err, rows) {
                    connection.release();
                    if (!err) {
                        params.callback(rows);
                    } else {
                        res.json({ status: false, msg: params.errors.queryFailed });
                    }
                });
                break;
            default:
                connection.query(params.query, params.whereVals, function(err, rows) {
                    connection.release();
                    if (!err) {
                        params.callback(rows);
                    } else {
                        res.json({ status: false, msg: params.errors.queryFailed });
                    }
                });
        }

        connection.on('error', function(err) {
            res.json(params.errors.errors_101);
            return;
        });
    });
}

module.exports = router;
