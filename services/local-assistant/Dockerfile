# File path: Dockerfile

FROM python:3.9

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the code
COPY . .

# Run the Flask server
CMD ["python", "local_assistant_server.py"]
