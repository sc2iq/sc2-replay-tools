# base node image
FROM node:20-slim AS base

# Work around Debian GPG key expiration issues
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    openssl && \
    rm -rf /var/lib/apt/lists/*

# Install all node_modules, including dev dependencies
FROM base AS deps

WORKDIR /myapp

ADD package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit || npm install --prefer-offline --no-audit

# Setup production node_modules
FROM base AS production-deps

ENV NODE_ENV="production"

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json ./
RUN npm prune --production

# Build the app
FROM base AS build

# Override NODE_ENV for build stage to ensure dev dependencies work
ENV NODE_ENV="development"

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

COPY --from=production-deps /myapp/node_modules /myapp/node_modules

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/start.sh /myapp/start.sh

ENV PORT="8080"
ENV NODE_ENV="production"

WORKDIR /myapp

USER node

ENTRYPOINT [ "sh", "./start.sh" ]
