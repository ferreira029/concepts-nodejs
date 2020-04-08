const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid Id not is format UUID (Unique Universal Identify)" });
  }

  return next();
}

app.use('/repositories/:id', validateId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    like: 0
  };

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) return response.status(404).json({ error: "ID not found." });

  console.log(repositoryIndex);
  console.log(repositories[repositoryIndex].like);

  const repositoryUpdate = {
    id,
    title,
    url,
    techs,
    like: repositories[repositoryIndex].like
  };

  repositories[repositoryIndex] = repositoryUpdate;

  return response.json(repositoryUpdate);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) return response.status(404).json({ error: "ID not found." });

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) return response.status(404).json({ error: "ID not found." });

  const repository = repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    like: repositories[repositoryIndex].like + 1
  }

  return response.json(repository);
});

module.exports = app;
