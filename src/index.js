import express from "express";
import { readFile, writeFile } from "node:fs/promises";

const readDB = async () => {
  const rawData = await readFile("./users.json", "utf-8");
  const data = JSON.parse(rawData);
  return data;
};

const writeDB = async (data) => {
  await writeFile("./users.json", JSON.stringify(data, null, 2));
};

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

//base route
app.get("/", (request, response) => {
  response.send("The base rotue");
});

//users route
app.get("/users", async (request, response) => {
  const users = await readDB();

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

//post route
app.post("/users", async (request, response) => {
  const userData = request.body;

  const newUser = { id: users.length + 1, ...userData };

  const users = await readDB();
  users.push(newUser);
  writeDB(users);

  response.status(201).send(users);
});

//put request
app.put("/user/:id", async (request, response) => {
  const parsedId = parseInt(request.params.id);
  const data = request.body;

  //handle invalid ID
  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const users = await readDB();

  const findUserIdx = users.findIndex((user) => user.id === parsedId);

  if (findUserIdx < 0) {
    return response.sendStatus(404);
  }

  users[findUserIdx] = data;
  await writeDB(users);

  console.log(users);
  return response.send(users);
});

app.patch("/user/:id", async (request, response) => {
  const body = request.body;
  const parsedId = parseInt(request.params.id);

  if (isNaN(parsedId)) return response.sendStatus(400);

  const users = await readDB();

  const userIdx = users.findIndex((user) => user.id === parsedId);

  if (userIdx === -1) return response.sendStatus(404);

  users[userIdx] = { ...users[userIdx], ...body };

  await writeDB(users);

  return response.send(users[userIdx]);
});

//user/id route
app.get("/user/:id", async (request, response) => {
  const parsedId = parseInt(request.params.id);

  //handle invalid ID
  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const users = await readDB();

  const findUser = users.find((el) => el.id === parsedId);

  //handle id out of range
  if (!findUser) {
    return response.sendStatus(404);
  }

  return response.send(findUser);
});

app.delete("/user/:id", async (request, response) => {
  const parsedId = parseInt(request.params.id);

  if (isNaN(parsedId)) return response.sendStatus(400);

  const users = await readDB();

  const userIdx = users.findIndex((user) => user.id === parsedId);

  if (userIdx === -1) return response.sendStatus(404);

  //remove that idx record
  users.splice(userIdx, 1);

  await writeDB(users);

  return response.send(users);
});

app.listen(PORT, () => {
  console.log(
    `LOG: ${new Date().toISOString()} >> Sever Started. Running at Port ${PORT}. Link: http://localhost:3000/`,
  );
});
