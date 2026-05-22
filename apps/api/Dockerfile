FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN yarn workspaces focus @resume-signal/api --production

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps ./apps
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/api ./apps/api
EXPOSE 5000
CMD ["node", "apps/api/src/server.js"]
