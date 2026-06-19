import express from "express";

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

const PORT = process.env.PORT || 3000;

const app = express();

//base route
app.get("/", (request, response) => {
  response.send("The base rotue");
});

//users route
app.get("/users", (request, response) => {
  const { filter: qfilter, value } = request.query;

  //check if query params arent there
  if (!(qfilter && value && qfilter in users)) {
    return response.send(users);
  }

  //when filter and value are present and correct
  if (qfilter && value) {
    return response.send(
      users.filter((user) => {
        return user[qfilter].toLowerCase().startsWith(value.toLowerCase());
      }),
    );
  }
});

//user/id route
app.get("/user/:id", (request, response) => {
  const parsedId = parseInt(request.params.id);

  //handle invalid ID
  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const findUser = users.find((el) => el.id === parsedId);

  //handle id out of range
  if (!findUser) {
    return response.sendStatus(404);
  }

  return response.send(findUser);
});

app.listen(PORT, () => {
  console.log(
    `LOG: ${new Date().toISOString()} >> Sever Started. Running at Port ${PORT}`,
  );
});
