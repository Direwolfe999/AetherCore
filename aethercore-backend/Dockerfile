# Use a modern Python base image
FROM python:3.11-slim as base

# Install curl and other dependencies for downloading Modular max
RUN apt-get update && apt-get install -y \
    curl \
    apt-transport-https \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Modular MAX CLI and Mojo
RUN curl https://get.modular.com | sh - && \
    modular auth --mut-token ... || echo "Modify this step for actual production auth" && \
    modular install mojo

ENV PATH="$PATH:/root/.modular/pkg/packages.modular.com_mojo/bin"

# Set up the Python working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything
COPY . .

# Compile the Mojo analyzer executable
# RUN mojo build engine/analyzer.mojo -o engine/analyzer
# (Assuming local testing builds it, or we compile it during docker build)

EXPOSE 8000

# Healthcheck configuration for Railway
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/health || exit 1

# Run the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]