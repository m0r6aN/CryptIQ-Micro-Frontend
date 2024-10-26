FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

COPY ./app.py /app/app.py

RUN pip install fastapi pydantic requests

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5011"]
