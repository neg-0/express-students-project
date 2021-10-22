const express = require('express')
const app = express()
const port = 3000
const morgan = require('morgan')

const students = {}

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(morgan('dev'))

app.get('/students', (req, res) => {
    // GET /students - returns a list of all students
    // this endpoint, optionally, accepts query parameters
    // GET /students?search=<query> - returns a list of students filtered on name matching the given query
    res.send(students)
})

app.listen(port, () => {
    console.log(`Student project app listening at http://localhost:${port}`)
})

/*
GET /students/:studentId - returns details of a specific student by student id
GET /grades/:studentId - returns all grades for a given student by student id
POST /grades - records a new grade, returns success status in JSON response (meaning you do not need to actually store the grade in a database. You do need to validate that the user supplied at least a grade, and a studentId)
POST /register - creates a new user, returns success status in JSON response (meaning you do not need to actually store the user info in a database. You do need to validate that the user supplied username and email)
*/