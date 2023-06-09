const express = require('express')

const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
var cors = require('cors')
const helmet = require('helmet')
const dotenv = require('dotenv')
const morgan = require('morgan')
dotenv.config()

const sequelize = require('./database/database')
const rootDir = require('./util/path')

const userRoute = require('./routes/routes')
const expenseRoute = require('./routes/expense')
const purchaseRoute = require('./routes/purchase')
const premiumRoute = require('./routes/premium')
const forgetPasswordRoute = require('./routes/forgetPassword')

const User = require('./modals/userModal')
const Expense = require('./modals/expenseModal')
const Order = require('./modals/orderModal')
const Forgotpassword = require('./modals/forgetPasswordModal');
const DownloadUrl = require('./modals/fileURL')

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname, 'public')));

const logStream = fs.createWriteStream(path.join(__dirname,'access.log'), { flags : 'a'})
app.use(cors())
app.use(helmet())
app.use(morgan('combined',{ stream : logStream}))

app.use(userRoute)
app.use(forgetPasswordRoute)
app.use(expenseRoute)
app.use(purchaseRoute)
app.use(premiumRoute)

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Forgotpassword)
Forgotpassword.belongsTo(User)

User.hasMany(DownloadUrl)
DownloadUrl.belongsTo(User)

sequelize
.sync()
.then( result =>{
    app.listen(process.env.PORT || 8000 , () =>{
        console.log('Server listening on port 8000')
    })

})