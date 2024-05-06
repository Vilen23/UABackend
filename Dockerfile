FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./prisma .
RUN npx prisma generate
COPY . .


FROM node:20 AS final
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
EXPOSE 8000
CMD [ "node", "dist/index.js" ]