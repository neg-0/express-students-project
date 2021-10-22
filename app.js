const express = require('express')
const app = express()
const port = 3000
const morgan = require('morgan')
const students = require('./students.json')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(morgan('dev'))

app.get('/students', (req, res) => {
    // GET /students - returns a list of all students
    // this endpoint, optionally, accepts query parameters
    // GET /students?search=<query> - returns a list of students filtered on name matching the given query
    if (req.query.search) {
        let name = req.query.search.toLowerCase()
        let ret = students.filter(student => student.name[0].toLowerCase().includes(name) || student.name[1].toLowerCase().includes(name))
        res.send(ret)
    } else { res.send(students) }
})

app.get('/students/:studentId', (req, res) => {
    // GET /students/:studentId - returns details of a specific student by student id
    res.send(students.find(student => student.id === parseInt(req.params.studentId)))
})

app.get('/grades/:studentId', (req, res) => {
    // GET /grades/:studentId - returns all grades for a given student by student id
    res.send(students.find(student => student.id === parseInt(req.params.studentId)).grades)
})

app.post('/grades', (req, res) => {
    // POST /grades - records a new grade, returns success status in JSON response (meaning you do not need to actually store the grade in a database. You do need to validate that the user supplied at least a grade, and a studentId)
    let studentId = +req.body.studentId
    let grade = JSON.parse(req.body.grade)

    if (!studentId || !grade) {
        res.status(400)
        res.json("Error 400: Must include studentId and grade")
        return
    }

    let studentIndex = students.findIndex((student) => student.id === studentId)

    if (studentIndex === -1) {
        res.status(400)
        res.json("Error 400: Student not found")
        return
    }

    students[studentIndex].grades = Object.assign(students[studentIndex].grades ?? {}, grade)

    res.status(200)
    res.json(students[studentIndex].grades)

})

app.post('/register', (req, res) => {
    // POST /register - creates a new user, returns success status in JSON response
    // (meaning you do not need to actually store the user info in a database. You do need
    // to validate that the user supplied username and email)

    let username = req.body.username
    let email = req.body.email
    let id = Math.max(...students.map(student => student.id)) + 1

    if (!username || !email) {
        res.status(400)
        res.json("Error 400: Must include username and email")
        return
    }

    let newStudent = { id, username, email }

    students.push(newStudent)

    res.status(200)
    res.json(newStudent)
})

app.listen(port, () => {
    console.log(`Student project app listening at http://localhost:${port}`)
})