var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
const fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var servicesRouter = require('./routes/services');
const blogRoutes = require('./routes/blogs');
var consultationRoutes = require('./routes/consultation');
const checkAppointmentRouter = require('./routes/checkAppointment');


dotenv.config();

var app = express();

// Inline Basic Auth middleware for admin access
const adminAuth = (req, res, next) => {
  const auth = {
    login: process.env.ADMIN_LOGIN,
    password: process.env.ADMIN_PASSWORD
  };

  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  if (login === auth.login && password === auth.password) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="Admin Panel"');
  res.status(401).send('Authentication required.');
};


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('MongoDB connection error:', err));



// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/services', servicesRouter);
app.use('/blogs', blogRoutes);
app.use('/consultation', consultationRoutes);
app.use('/check-appointment', checkAppointmentRouter);

// Serve admin dashboard
app.get('/admin', adminAuth, (req, res) => {
  const slotFile = path.join(__dirname, 'data/slots.json');
  const slots = JSON.parse(fs.readFileSync(slotFile, 'utf-8'));
  res.render('admin-dashboard', { slots });
});

// Add new slot
app.post('/admin/add-slot', adminAuth, (req, res) => {
  const { date, time } = req.body;
  const slotFile = path.join(__dirname, 'data/slots.json');
  let slots = JSON.parse(fs.readFileSync(slotFile, 'utf-8'));

  slots.push({ date, time });
  fs.writeFileSync(slotFile, JSON.stringify(slots, null, 2));
  res.redirect('/admin');
});

// Delete slot
app.post('/admin/delete-slot', adminAuth, (req, res) => {
  const { date, time } = req.body;
  const slotFile = path.join(__dirname, 'data/slots.json');
  let slots = JSON.parse(fs.readFileSync(slotFile, 'utf-8'));

  slots = slots.filter(slot => !(slot.date === date && slot.time === time));
  fs.writeFileSync(slotFile, JSON.stringify(slots, null, 2));
  res.redirect('/admin');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;