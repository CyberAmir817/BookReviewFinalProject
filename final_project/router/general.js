const express = require('express');
let books = require("./booksdb.js");
let { authenticated: regd_users, isValid, users} = require("./auth_users.js");
const public_users = express.Router();


//Register users by username and password
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password){
      if(!doesExist(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message:"User already exists"});
     }
    }  
  return res.status(404).json({message:"Unable to register user."});
  });
  

//Checks if username does exists
const doesExist = (username)=> {
    let userwithsamename = users.filter((user)=>{
      return user.username === username;
    });

    return userwithsamename.length > 0;
};

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res){
    //definition for book and isbn
    const isbn = req.params.isbn;
    let book;

    for(let key in books ){
      if(books[key].isbn === isbn) {
        book = books[key];
        break;
      }
    }

    if (book) {
        res.json(book);
    } else{
        res.status(404).json({message: "Book not found"})
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Allow name space in URL
  const author = decodeURIComponent(req.params.author);
  let book;
  //Sets 'author' as a key parameter
  for(let key in books){
    if(books[key].author === author){
       book = books[key];
       break;
    }
   }

   if (book){
       res.json(book);
   }  else{
        res.status(404).json({message: "Book not found"})
   }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = decodeURIComponent(req.params.title);
    let book;
    //Sets 'title' as a key parameter
    for(let key in books){
      if(books[key].title === title){
         book = books[key];
         break;
      }
    }

    if (book){
        res.json(book);
    }  else{
         res.status(404).json({message: "Book not found"})
    }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  const review = req.params.isbn;
  let book;

  for(let key in books ){
    if(books[key].isbn === review) {
      book = books[key];
      break;
    }
  }

  if (book) {
      res.json(book);
  } else{
      res.status(404).json({message: "Book not found"})
  }
});


module.exports.general = public_users;
