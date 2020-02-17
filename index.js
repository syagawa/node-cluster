const cluster = require("cluster");
const express = require("express");
const numCpus = require("os").cpus().length;
const fs = require("fs");
const d = new Date().getTime();
console.log("in first", numCpus, d);

if(cluster.isMaster){
  console.log("in isMaster");
  for(let i = 0; i < numCpus; i++){
    cluster.fork();
  }
}else{
  const id = cluster.worker.process.pid;
        console.log("in fork", id);
  const app = express();
  app.get("/", function(req, res){
    let counter = Number(fs.readFileSync("counter", "utf8"));
    counter++;
    fs.writeFileSync("counter", counter);
    res.send("Hello World " + id + " count: " + counter);
  });

  app.listen(3001);
}

