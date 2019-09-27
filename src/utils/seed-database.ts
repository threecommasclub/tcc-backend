// Code that is used to seed the database.

import { createConnection, getConnectionOptions } from 'typeorm';
import { emojify } from 'node-emoji';

import { Company, User } from '../entities';
import { seedData as companySeedData } from '../seeders/company-seeder';
import { seedData as userSeedData } from '../seeders/user-seeder';

(async () => {
  console.log(emojify(':runner: Beginning DB seed task.'));

  // read connection options from .env
  const connectionOptions = await getConnectionOptions();

  const conn = await createConnection({
    ...connectionOptions,
    dropSchema: true,
  });
  console.log(emojify(':unlock:  DB connected.'));

  const companies = await Company.create(companySeedData);
  const users = await User.create(userSeedData);
  await Company.save(companies);
  await User.save(users);

  // Close connection
  await conn.close();
  console.log(emojify(':closed_lock_with_key:  DB connection closed.'));

  console.log(emojify(':trophy:  Finished DB seed task.'));
})();
