FROM node:22

RUN mkdir -p /usr/app
WORKDIR /usr/app

# Install dependencies. Installing also generates the database client, which needs the schema.
COPY package*.json prisma.config.ts /usr/app/
COPY prisma/ /usr/app/prisma/
RUN npm install

# Copy rest of application
COPY . /usr/app

# The SQLite database is stored here. Mount a volume to keep it between containers.
VOLUME /usr/app/data
