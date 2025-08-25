const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

function initDb() {
  const dbFile = process.env.DATABASE_FILE || path.join(__dirname, '..', 'data', 'db.sqlite');
  const dir = path.dirname(dbFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const { PrismaClient } = require('./generated/prisma');
  const prisma = new PrismaClient();
  module.exports = prisma;
}

module.exports = { initDb };
