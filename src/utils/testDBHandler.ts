import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

class TestDBHandler {
  private mongod: MongoMemoryServer;

  constructor() {
    this.mongod = new MongoMemoryServer();
  }

  /**
   * Connect to the in-memory database.
   */
  async connect() {
    const uri = await this.mongod.getConnectionString();

    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    };

    await mongoose.connect(uri, mongooseOpts);
  }

  /**
   * Drop database, close the connection and stop mongod.
   */
  async closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await this.mongod.stop();
  }

  /**
   * Remove all the data for all db collections.
   */
  async clearDatabase() {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }

  async run() {
    /**
     * Connect to a new in-memory database before running any tests.
     */
    beforeAll(async () => {
      await this.connect();
    });

    /**
     * Clear all test data after every test.
     */
    afterEach(async () => {
      await this.clearDatabase();
    });

    /**
     * Remove and close the db and server.
     */
    afterAll(async () => {
      await this.closeDatabase();
    });
  }
}

export default new TestDBHandler();
