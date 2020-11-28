const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { connect } = require('./config/database');
const app = express();
const port = process.env.PORT || 5000;

var db_config = require('./config/database');
var conn = db_config.init();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));

const Storage = multer.diskStorage({
    destination(req, file, callback){
        callback(null, './uploads')
    },
    filename(req, file, callback){
        callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
    },
})

const upload = multer({ storage: Storage})
app.use('/image', express.static('./uploads'));



app.post('/api/members', (req, res) => {
    var body = req.body;
    console.log(body);

    var sql = 'INSERT INTO members VALUES(?, ?, ?, ?)';
    var params = [body.stu_id, body.id, body.password, body.username];
    console.log(sql);
    conn.query(sql, params, function(err){
        if(err) console.log('Insertion failed.. ' + err);
        else res.redirect('/api/members_info');
    })
});

app.post('/api/board/upload', (req, res) => {
    var body = req.body;
    console.log(body);

    var sql = 'INSERT INTO board VALUES(null, ?, ?, ?, ?)';
    var params = [body.stu_id, body.title, body.contents, Boolean(body.anony)];
    console.log(sql);
    conn.query(sql, params, function(err){
        if(err) console.log('Insertion board failed.. ' + err);
        else res.redirect('/api/board/upload');
    })
});

app.delete('api/jjim', (req,res) => {
    var body = req.body;
    var sql = 'DELETE FROM jjim WHERE stu_id=? and Gno=?';
    var params = [body.stu_id, body.gno];
    conn.query(sql, params, function(err){
        if(err) console.log('Delete from jjim failed...', +err);
        else res.redirect('api/jjim');
    })
})

app.get('/api/members', (req, res) => {
    //console.log(body);
    var sql = 'SELECT * FROM members WHERE mem_id = ? and mem_password = ?';
    var params = [req.query.id, req.query.password];
    console.log(sql);
    
    conn.query(sql,params, function (err, rows, fields){
        if(err) console.log('Login failed..' + err);
        else{
            console.log('sql 결과 : '+JSON.stringify(rows))
            res.send(rows);
        }
    })
})

app.get('/api/StuID', (req, res) => {
    //console.log(body);
    var sql = 'SELECT stu_id FROM members WHERE mem_id = ?';
    var params = [req.query.current_id];
    console.log(sql);
    
    conn.query(sql,params, function (err, rows, fields){
        if(err) console.log('load stu_id failed..' + err);
        else{
            console.log('sql 결과 : '+JSON.stringify(rows))
            res.send(rows);
        }
    })
})

app.get('/api/members_id', (req, res) => {
    //console.log(body);
    var sql = 'SELECT * FROM members WHERE mem_id = ?';
    var params = [req.query.id];
    console.log(sql);
    console.log(req.query);
    conn.query(sql,params, function (err, rows, fields){
        if(err) console.log('Confirm failed..' + err);
        else{
            console.log('sql 결과 : '+JSON.stringify(rows))
            if(rows) res.send(rows);
        }
    })
})

app.get('/api/members_password', (req, res) => {
    //console.log(body);
    var sql = 'SELECT * FROM members WHERE stu_id = ? and mem_id = ?';
    var params = [parseInt(req.query.stu_id), req.query.id];
    console.log(sql);
    console.log(params);
    console.log(req.query);
    conn.query(sql,params, function (err, rows, fields){
        if(err) console.log('Find failed..' + err);
        else{
            console.log('sql 결과 : '+JSON.stringify(rows))
            if(rows) res.send(rows);
        }
    })
})

app.put('/api/members/password', (req, res) => {
    //console.log(body);
    var sql = 'UPDATE members SET mem_password = ? WHERE stu_id = ?';
    var params = [req.query.stu_id, parseInt(req.query.stu_id)];
    console.log(sql);
    console.log(params);
    console.log(req.query);
    conn.query(sql,params, function (err, rows, fields){
        if(err) console.log('password update failed..' + err);
        else{
            console.log('sql 결과 : '+JSON.stringify(rows))
            if(rows) res.send(rows);
        }
    })
})

app.get('/api/members-studentID', (req, res) => {
    //console.log(body);
    var sql = 'SELECT * FROM members WHERE mem_id = ?';
    var params = [req.query.id];
    console.log(sql);
    console.log(req.query);
    conn.query(sql,params, function (err, rows, fields){
        if(err) console.log('Confirm failed..' + err);
        else{
            console.log('sql 결과 : '+JSON.stringify(rows))
            if(rows) res.send(rows);
        }
    })
})

app.post('/api/upload',upload.single('img'), (req, res) => {
    var body = req.body;
    console.log(body);

    var sql = 'INSERT INTO goods VALUES(null, ?, ?, ?, ?, ?, ?)';
    var image = '/image/' + req.file.filename;
    var params = [body.title, body.contents, body.price, body.stu_id, Boolean(body.state), image];
    console.log(sql);
    conn.query(sql, params, function(err){
        if(err) console.log('Insertion failed.. ' + err);
        
        //else res.send(rows);
    })
});


app.get('/api/goods', (req,res) => {
    var sql = 'SELECT * FROM goods';
    
    console.log(sql);
    console.log(req.query);
    conn.query(sql, function (err, rows, fields){
        if(err) console.log('Load goods failed..' + err);
        else{
            console.log('sql 결과 : '+JSON.stringify(rows))
            if(rows) res.send(rows);
        }
    })
})

app.get('/api/goods/detail', (req,res) => {
    var sql = 'SELECT * FROM goods WHERE Gno = ?';
    var params = [req.query.gno];
    console.log(sql);
    console.log(req.query);
    conn.query(sql,params,  function (err, rows, fields){
        if(err) console.log('Load goods failed..' + err);
        else{
            console.log('sql 결과 : '+JSON.stringify(rows))
            if(rows) res.send(rows);
        }
    })
})

app.get('/api/board', (req,res) => {
    var sql = 'SELECT * FROM board';
    console.log(sql);
    conn.query(sql,  function (err, rows, fields){
        if(err) console.log('Load board failed..' + err);
        else{
            console.log('sql 결과 : '+JSON.stringify(rows))
            if(rows) res.send(rows);
        }
    })
})

app.put('/api/goods', (req, res) => {
    //console.log(body);
    var sql = 'UPDATE goods SET state = ? WHERE Gno = ?';
    var params = [false, req.query.gno];
    console.log(sql);
    console.log(params);
    console.log(req.query);
    conn.query(sql,params, function (err, rows, fields){
        if(err) console.log('Goods state update failed..' + err);
        else{
            console.log('sql 결과 : '+JSON.stringify(rows))
            if(rows) res.send(rows);
        }
    })
})

app.post('/api/jjim', (req, res) => {
    //console.log(body);
    var body = req.body;
    var sql = 'INSERT INTO jjim VALUES (?, ?)';
    var params = [body.stu_id, body.gno];
    console.log(sql);
    console.log(params);
    console.log(req.query);
    conn.query(sql,params, function (err, rows, fields){
        if(err) console.log('Insert jjim failed..' + err);
        else{
            console.log('sql 결과 : '+JSON.stringify(rows))
            if(rows) res.send(rows);
        }
    })
})

app.listen(port, () => console.log(`Listening on port ${port}`));