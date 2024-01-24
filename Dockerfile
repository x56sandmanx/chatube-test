FROM node:alpine as build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm clean-install
RUN npm install react-scripts -g
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
