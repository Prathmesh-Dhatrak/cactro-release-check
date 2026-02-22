FROM node:20-alpine
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Expose dev server port
EXPOSE 5173

# Start Vite dev server (accessible from host)
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]
