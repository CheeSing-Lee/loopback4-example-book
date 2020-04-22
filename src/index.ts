import {ExpressServer} from './server';

export {ExpressServer};

export async function main() {
  const express = new ExpressServer();
  await express.boot();
  await express.start();
  console.log(`Server is running at ${express.lbApp.restServer.config.path}`);
}
