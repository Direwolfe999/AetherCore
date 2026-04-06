# Use a modern Python base image
FROM python:3.11-slim as base

# Install curl and required dependencies
RUN apt-get update && apt-get install -y \
    curl \
    apt-transport-https \
    gnupg \
  ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Modular tooling if available in build environment
RUN curl -s https://get.modular.com | sh || true

ENV PATH="$PATH:/root/.modular/pkg/packages.modular.com_mojo/bin"

# Set up the Python working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything
COPY . .

# Compile the Mojo analyzer executable when Mojo is available.
RUN if command -v mojo >/dev/null 2>&1; then \
      mojo build engine/analyzer.mojo -o engine/analyzer && chmod +x engine/analyzer; \
    else \
      echo "Mojo compiler not found; runtime will use fallback analysis"; \
    fi

EXPOSE 8000

# Healthcheck configuration for Railway
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/health || exit 1

# Run the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]