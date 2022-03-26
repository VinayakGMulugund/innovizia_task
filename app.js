const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = 5000

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.listen(port, ()=> {
    console.log(`listening on port ${port}`)
})

//mysql
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "new_password",
    database: "zomato"
})

con.connect((err)=> {
    if(err) console.log(err);
    console.log("connected")
})


//get all items
app.get('/', (req,res)=>{
    con.query('select * from items', (err,result)=> {
        if(err) console.log(err)
        else res.send(result)
    })
})

//get item by no. or id
app.get('/:id', (req,res)=>{
    con.query('select * from items where no=?', [req.params.id], (err,result)=> {
        if(err) console.log(err)
        else res.send(result)
    })
})



//update or change an item
app.put('/', (req,res)=>{
    const {name, price, type, rating, no} = req.body
    con.query('update items set name = ? where no = ?', [name ,no], (err,result)=> {
        if(err) console.log(err)
        else res.send(`data updatred for ${name}`)
    })
})



//delete an item from the database using no.
app.delete('/:id', (req,res)=>{
    con.query('delete from items where no=?', [req.params.id], (err,result)=> {
        if(err) console.log(err)
        else res.send(`deleted item with id: ${req.params.id}`)
    })
})




//insert an item into database
app.post('/', (req,res)=>{
    const params = req.body
    con.query('insert into items set ?', params, (err,result)=> {
        if(err) console.log(err)
        else res.send(`data inserted`)
    })
})


//customize order 

app.post('/customize', (req,res)=>{
    const {no} = req.body;
    var hasTopping =false
    var toppings = ''
    con.query('select hasToppings from items where no=?', no, (err,result)=>{
        if(err) console.log(err)
        else hasTopping = result;

        if(hasTopping==false) res.send('no toppings available for this item')
        else {
            con.query('select * from toppings', (err,ress)=>{
                if(err) console.log(err)
                res.send(`toppings available are ${JSON.stringify(ress)}`)
            })
        }
    })
})

//add topping
app.post('/customize-add', (req,res)=> {
    const id = req.body
    con.query('select name from toppings where id=?', id, (err,result)=>{
        if(err) console.log(err)
        res.send(`${JSON.stringify(result)} added`)
    })
})
