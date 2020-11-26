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

const upload = multer({ dest: 'uploads/'})
app.use('image', express.static('./uploads'));

app.get('/api/user', (req, res) => {
    res.send([
        {
            'id' : 1,
            'userID' : 'seho100',
            'userPassword' : 'sop8377',
            'email' : 'seho4815@naver.com'
        },
        {
            'id' : 2,
            'userID' : 'sunho100',
            'userPassword' : 'sop8377',
            'email' : 'suno100@naver.com'
        },
        {
            'id' : 3,
            'userID' : 'sungho100',
            'userPassword' : 'sop8377',
            'email' : 'sungho100@naver.com'
        }
    ]);
});

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
        else res.send(rows);
    })
});


app.listen(port, () => console.log(`Listening on port ${port}`));