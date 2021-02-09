const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const mysql = require('mysql');

const app = express();

app.use(cors());
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'todo'
})

db.connect(err => {
    if (err) {
        return err
    } else {
        console.log('mySQL is connected!')
    }
})

app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks ORDER BY created DESC', (error, results) => {
        if (error) return res.json({ error: error });

        res.json(results)
    })
})


app.post('/tasks/add', (req, res) => {
    console.log(req.body);

    db.query('INSERT INTO tasks (description) VALUES (?)', [req.body.item], (err, results) => {
        if (err) {
            return res.json({ err: err });
        }

        db.query('SELECT LAST_INSERT_ID() FROM tasks', (error, results) => {
            if (error) return res.json({ error: error });

            res.json({
                id: results[0]['LAST_INSERT_ID()'],
                description: req.body.item
            })
        })
    })
})

app.post('/tasks/:id/update', (req, res) => {
    db.query('UPDATE tasks SET completed = ? WHERE id = ?', [req.body.completed, req.params.id], (error, results) => {
        if (error) return res.json({ error: error });
        res.json({})
    })
})

app.post('/tasks/:id/remove', (req,res) => {
    db.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (error, results) => {
        if (error) return res.json({ error: error });

        res.json({});
    })
})



app.listen(3000, () => {
    console.log('API up and running!')
})