import { cleanEnv, port, str, host } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    MONGO_USER: str(),
    PORT: port(),
    REDIS_HOST: host(),
  });
}

export default validateEnv;
