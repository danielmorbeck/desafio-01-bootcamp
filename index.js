const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let numberOfRequest = 0;

function checkProjectExist(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

function logRequests(req, res, next) {
  numberOfRequest++;

  console.log(`Número de requisições: ${numberOfRequest}`);

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.put("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);
  projects.splice(projectIndex);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);
  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
