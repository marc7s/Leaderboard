FROM node:22.23.4-bookworm

WORKDIR /usr/app

# Install dependencies. Installing also generates the database client, which needs the schema.
COPY package*.json prisma.config.ts /usr/app/
COPY prisma/ /usr/app/prisma/
RUN npm ci

# Copy rest of application and build it
COPY . /usr/app
RUN npm run build

ENV NODE_ENV=production

# The SQLite database is stored here. Mount a volume to keep it between containers.
VOLUME /usr/app/data

# Apply any new migrations, then start the server.
# Pass the settings at runtime, e.g. `docker run --env-file prod.env`.
CMD ["sh", "-c", "npx prisma migrate deploy && exec node dist/server.js"]
