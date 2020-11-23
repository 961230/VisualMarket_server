const express = require('express');
const bodyParser = require('body-parser');
const { connect } = require('./config/database');
const app = express();
const port = process.env.PORT || 5000;
var db_config = require('./config/database');
var conn = db_config.init();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));

app.get('/api/users', (req, res) => {
    var sql = 'SELECT * FROM users WHERE uname = "sunho"';
    conn.query(sql, function(err, rows, fields){
        if(err) console.log('query is not excuted.' + err);
        else{
                res.send(rows);
        }
    })
})

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

app.listen(port, () => console.log(`Listening on port ${port}`));