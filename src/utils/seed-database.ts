// Code that is used to seed the database.

import { createConnection } from 'typeorm';

import { Company } from '../entities';
import { seedData } from '../constants/seed-data';

(async () => {
  console.log('Beginning DB seed task.');

  const conn = await createConnection();
  console.log('DB connected.');

  const companies = await Company.create(seedData);
  await Company.save(companies);

  // Close connection
  await conn.close();
  console.log('DB connection closed.');

  console.log('Finished DB seed task.');
})();
