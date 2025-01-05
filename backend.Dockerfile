FROM python:3.13.1-alpine

ENV PORT=5000
# database hostname
ENV DB_HOST='postgres'

WORKDIR /backend
COPY ./backend/app.py ./
COPY ./backend/requirements.txt ./

RUN pip install -r requirements.txt

CMD [ "python", "app.py" ]

