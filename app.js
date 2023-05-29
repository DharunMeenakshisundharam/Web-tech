const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql');
const path = require('path');



const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where the uploaded files should be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename for the uploaded file
  }
});

const upload = multer({ storage: storage });

const conn = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Dracarys@27',
  database: 'web'
});

conn.connect((err) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the database');
  }
});
// inital start==============================================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'log.html'));
});
// upload image===============================================================
app.post('/purcase', upload.single('animal-image'), (req, res) => {
  const { fname, phone, animaltype, arr } = req.body;
  const animalImage = req.file;

  if (!animalImage) {
    res.status(400).send('No image file provided');
    return;
  }

  const imageData = animalImage.path;

  const query = 'INSERT INTO purcase (name, phone, type, images, area) VALUES (?, ?, ?, ?, ?)';

  conn.query(query, [fname, phone, animaltype, imageData, arr], (error, results) => {
    if (error) {
      console.error('Database error', error);
      res.status(500).send('Error occurred during image upload');
    } else {
      console.log('Image inserted');
      res.sendFile(path.join(__dirname, 'home.html'));
    }
  });
});

//login check and release to home page
app.post('/login', (req, res) => {


  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  console.log(password);
  
  const query = 'SELECT * FROM signup WHERE email = ? AND password = ?';
  const values = [username, password];

  conn.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing the query:', err);
      return;
    }
    if (results.length > 0) {
      console.log('Login successful');
      res.sendFile(path.join(__dirname, 'home.html'));
    } else {
      res.send('Email or password is incorrect');
    }
  });

});

// go to signup page
app.post('/signup', (req, res) => {
    
  res.sendFile(path.join(__dirname, 'signup.html'));
  

});


// signup check in  to go  for home page
app.post('/home', (req, res) => {

  

  const{username,password,cpassword}=req.body;
  
  function checkUser(username) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM signup WHERE email = ?';
      conn.query(query, [username], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            resolve({ isNewUser: false, user: results[0] });
          } else {
            resolve({ isNewUser: true });
          }
        }
      });
    });
  }



// Regular expression pattern to validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  
  // Usage example
  if(emailRegex.test(username))
  {
  checkUser(username)
    .then((result) => {
      if (result.isNewUser)
       {
        if(password==cpassword)
        {
          if(password.length>=8)
          {

            console.log('User is new');
            const query='insert into signup(email,password,cpassword) value(?,?,?);';
             conn.query(query,[username,password,cpassword],(error,results)=>{
            if(error){
                console.error('database eror', error);
            }
            else{
                console.log("inserted")
                res.sendFile(path.join(__dirname, 'home.html'));
                
            }
        })
          }
          else{
            res.send('password must contains atleast 8 characters');
          }
          
        }
        else{
          res.send('please check both password are correct');
        }
        

      } else {
        res.send('Email id is already used');
      }
    })
    .catch((err) => {
      console.error('Error:', err);
    });
  }
  else{
    res.send('Invalid Email id');
  }


    
    
});


//cat============================
app.get('/cat', (req, res) => {
  res.sendFile(path.join(__dirname, 'cat.html'));
});

//cow============================
app.get('/cow', (req, res) => {
  res.sendFile(path.join(__dirname, 'cow.html'));
});



app.get('/birds', (req, res) => {
  res.sendFile(path.join(__dirname, 'birds.html'));
});


app.get('/fish', (req, res) => {
  res.sendFile(path.join(__dirname, 'fish.html'));
});


app.get('/goat', (req, res) => {
  res.sendFile(path.join(__dirname, 'goat.html'));
});


app.get('/dog', (req, res) => {
  res.sendFile(path.join(__dirname, 'dog.html'));
});


app.get('/new', (req, res) => {
  res.sendFile(path.join(__dirname, 'purcase.html'));
});


//return home=====================================
app.get('/gohome', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});






































app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
