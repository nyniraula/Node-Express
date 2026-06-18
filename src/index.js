import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

const users = [
  { id: 1, name: "Alice Mercer", age: 28 },
  { id: 2, name: "James Okafor", age: 34 },
  { id: 3, name: "Priya Nair", age: 22 },
  { id: 4, name: "Carlos Vega", age: 41 },
  { id: 5, name: "Sophie Blanchard", age: 19 },
  { id: 6, name: "Ethan Rowan", age: 27 },
  { id: 7, name: "Yuna Choi", age: 31 },
  { id: 8, name: "Marcus Hill", age: 25 },
  { id: 9, name: "Leila Nazari", age: 38 },
  { id: 10, name: "Tom Whitfield", age: 45 },
];

app.get("/", (req, res) => {
  res.send("Nothing to see here");
});

app.get("/users", (req, res) => {
  res.send(users);
});

app.get("/user/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);

  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Bad Request. Invalid Id." });
  }

  const findUser = users.find((el) => el.id == parsedId);

  if (!findUser) return res.sendStatus(404);

  return res.send(findUser);
});

app.listen(PORT, () => {
  console.log(
    `${new Date().toISOString()}: Server Started, Running on PORT ${PORT}`,
  );
});
