// Set test database URL - use a separate test database
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST || 'postgresql://postgres:postgres@localhost:5432/totem_care_test?schema=public';
process.env.NODE_ENV = 'test';
