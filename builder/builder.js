const fs = require("fs");
const path = require("path");
const envBuilder = require("./envBuilder");
const portalBuilder = require("./portalBuilder_v2");
const modelBuilder = require("./modelBuilder");
const seedBuilder = require("./seedBuilder");
const controllerBuilder = require("./controllerBuilder");
const scriptBuilder = require("./scriptBuilder");
const copyBuilder = require("./copyBuilder");
const config = require("../config.json");

console.log("BUILDER STARTS");
function createEnv() {
  console.log("CREATING ENV");
  if (config.env) envBuilder.generateEnv(config.env);
  console.log("DONE ENV");
}
function createPortals() {
  console.log("CREATING PORTALS");
  if (config.portals)
    portalBuilder.generatePortal(
      config.portals,
      config.env ? config.env : {},
      config.models,
      config.roles
    );
  console.log("DONE PORTALS");
}
function createModels() {
  console.log("CREATING MODELS");
  if (config.models) modelBuilder.generateModel(config.models);
  console.log("DONE MODELS");
}
function createSeeds() {
  console.log("CREATING SEEDS");
  if (config.models) seedBuilder.generateSeed(config.models);
  console.log("DONE SEEDS");
}

function createControllers() {
  console.log("CREATING CONTROLLERS");
  if (config.controllers)
    controllerBuilder.generateController(
      config.controllers,
      config.roles ? config.roles : {},
      config.models
    );
  console.log("DONE CONTROLLERS");

  setTimeout(createCopy, 1500);
}
function createCopy() {
  console.log("CREATING COPIES");
  if (config.env) copyBuilder.startCopy(config.copy);
  console.log("DONE COPEIS");
}

// async function createScripts() {
// 	console.log("CREATING SCRIPTS");
// 	if(config.controllers)
// 		await scriptBuilder.generateScript(config.controllers);
// 	console.log("DONE SCRIPTS");

// }

createEnv();
createPortals();
createModels();
createSeeds();
createControllers();

//createScripts();
