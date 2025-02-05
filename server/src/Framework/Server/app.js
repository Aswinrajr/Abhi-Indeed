import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { UserRouter } from '../Routes/UserRoutes/userRoutes.js'
import { RecruiterRouter } from '../Routes/RecruiterRoutes/recruiterRoutes.js'
import { AdminRouter } from '../Routes/AdminRoutes/adminRoutes.js'
import { CompanyRouter } from '../Routes/CompanyRoutes/companyRoutes.js'
import connectDB from '../Database/mongoClient.js'
import cron from '../Services/cron-jobs.js'

import Session  from 'express-session';

import passport from '../Services/googleAuth.js'


dotenv.config()

const app=express()

const port=process.env.PORT ||3000


const allowedOrigins = [
  'https://workstation.today',
  'https://www.workstation.today',
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: 'GET,POST,PUT,DELETE'
}));

 app.use(cookieParser())
 app.use(
  Session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize())
app.use(passport.session())

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }))
 app.use(express.json())
 app.use(express.urlencoded({ extended: true }));

 app.use('/',UserRouter)
 app.use('/',RecruiterRouter)
 app.use('/',AdminRouter)
 app.use('/',CompanyRouter)

 connectDB().then(() => {
   app.listen(port, () => {
     console.log(`Server is running on http://localhost:${port}`);
   });
 }).catch(error => {
   console.error('Failed to connect to MongoDB', error);
 });