FROM node:18

RUN mkdir -p /usr/app
WORKDIR /usr/app

# Install dependencies
COPY package*.json /usr/app/
RUN npm install

# Copy rest of application
COPY . /usr/app