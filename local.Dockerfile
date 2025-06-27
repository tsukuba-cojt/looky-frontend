FROM node:22-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN npm install -g @expo/ngrok

COPY . /app
WORKDIR /app

RUN pnpm install

EXPOSE 8081

ENTRYPOINT ["pnpm"]
CMD ["start"]