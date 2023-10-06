const express = require("express");
const mysql = require("mysql");
require("./mongoose.js");

const Comment = require("./comment.js");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "users-database",
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("mysql database connected");
  }
});
//Create a new user
app.post("/users", (req, res) => {
  const { firstName, lastName, email } = req.body;

  const insertUserQuery = `
  INSERT INTO users (id, firstName, lastName, email) VALUES (NULL,?, ?, ?);
`;

  db.query(
    insertUserQuery,
    [firstName, lastName, email],

    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//Get all users
app.get("/users", (req, res) => {
  const getQuery = `SELECT * FROM users`;
  db.query(getQuery, [], (err, results) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.status(200).json(results);
  });
});

//Update user
app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).send("must provide data to be updated!");
  }

  const updateQuery = `
  UPDATE users SET firstName = ?, lastName = ?, email = ?
  WHERE id = ?
`;
  db.query(updateQuery, [firstName, lastName, email, id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

//Delete user
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM users WHERE id=?`;
  db.query(deleteQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

//Create new comment
app.post("/comments", async (req, res) => {
  const comment = new Comment({ ...req.body });
  try {
    await comment.save();
    res.status(201).send(comment);
  } catch (e) {
    res.status(500).send(e);
  }
});
//get the user by id
app.get("/users/:id", (req, res) => {
  const Id = req.params.id;

  const getUser = `
    SELECT * FROM users WHERE id = ?
  `;

 db.query(getUser, [Id], (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      res.send(results[0]);
    });

});

app.listen(port, () => {
  console.log("server is up at port " + port);
});
