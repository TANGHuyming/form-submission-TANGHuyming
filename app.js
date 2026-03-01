const express = require('express')
const path = require('path')
const {engine} = require('express-handlebars')
const multiparty = require('multiparty')
const fs = require('fs')

const app = express()
const PORT = 3000

// create uploads folder
const uploadDir = path.join(__dirname, 'public', 'uploads')
if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
    console.log('Folder created:', uploadDir)
}

// initialize engine in app
app.engine('hbs', engine({
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    defaultLayout: 'main',
    extname: '.hbs'
}))

// set engine and views directory
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'hbs')

// middleware to disable x-powered-by and serve static files
app.disable('x-powered-by')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.status(200)
    res.redirect('/register')
})

app.get('/register', (req, res) => {
    const context = {courses: ["Web Dev", "Data Science", "UX Design"]}

    res.status(200)
    res.render('register', context)
})

app.post('/register', (req, res) => {
    const form = new multiparty.Form()

    form.parse(req, (err, fields, files) => {
        if(err) {
            console.error('Form parsing error!', err)
            res.status(400)
            return res.render('profile', {isError: true, message: err.message})
        }

        const context = {form: fields, files}

        console.log(files)
        
        // check if there is a file or the file is an image
        if(!files.image || files.image.length === 0) {
            console.error('No file(s) selected')
            res.status(400)
            return res.render('profile', {isError: true, message: 'No file(s) selected'})
        }

        const file = files.image[0]
        const originalFileName = file.originalFilename
        const tempFilePath = file.path

        const allowedExtension = ['.jpg', '.jpeg', '.png']
        const fileExtension = path.extname(originalFileName).toLowerCase()

        // check if the file extension is allowed
        if(!allowedExtension.includes(fileExtension)) {
            console.error('Invalid file extension')
            fs.unlinkSync(tempFilePath)
            res.status(400)
            return res.render('profile', {isError: true, message: 'Invalid file extension'})
        }

        const timeStamp = Date.now()
        const newFileName = `${timeStamp}-${originalFileName}`
        const newFilePath = path.join(uploadDir, newFileName)

        try {
            fs.copyFileSync(tempFilePath, newFilePath)
            fs.unlinkSync(tempFilePath)

            context.form.image = newFileName

            res.status(200)
            res.render('profile', context)
        }
        catch(e) {
            console.error('File system error', e)
            fs.unlinkSync(tempFilePath)
            res.status(500)
            res.render('profile', {isError: true, message: err.message})
        }
    })
})

// catch-all route middleware
app.use((req, res) => {
    res.status(404)
    res.send('<p>404 - Route not found</p>')
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500)
    res.send('<p>500 - Internal Server Error</p>')
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))