import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()
const db = new sqlite3.Database(':memory:')

// Create an in memory table to use
db.run(`CREATE TABLE todo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL)`)

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

app.get('/', function (req, res) {
    //You will need to do a SQL select here
    //You will need to update the code below!
    console.log('GET called')
    const local = { tasks: [] };
    db.each('SELECT id, task FROM todo', function (err, row) {
        if (err) {
            console.log(err);
        } else {
            local.tasks.push({ id: row.id, task: row.task });
        }
    }, function (err, numrows) {
        if (!err) {
            res.render('index', local);
        } else {
            console.log(err);
        }
    })

})

app.post('/', function (req, res) {
    console.log('adding todo item');
    
    const stmt = db.prepare('INSERT INTO todo (task) VALUES (?)');
    stmt.run(req.body.todo, function(err) {
        if (err) {
            console.log(err);
        }
        stmt.finalize();
        res.redirect('/'); 
    })

})

app.post('/delete', function (req, res) {
    console.log('deleting todo item');
    
    const stmt = db.prepare('DELETE FROM todo WHERE id = ?');
    stmt.run(req.body.id, function(err) {
        if (err) {
            console.log(err);
        }
        stmt.finalize();
        res.redirect('/'); 
    })
})

// Start the web server
app.listen(3000, function () {
    console.log('Listening on port 3000...')
})