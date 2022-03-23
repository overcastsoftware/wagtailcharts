# Use an official Python runtime as a parent image
FROM python:3.8-bullseye
LABEL maintainer="hello@wagtail.org"

# Set environment varibles
ENV PYTHONUNBUFFERED 1

# Install libenchant and create the requirements folder.
RUN apt-get update -y \
    && apt-get install -y libenchant-2-dev postgresql-client \
    && mkdir -p /code/requirements

# Install the wagtailcharts_demo project's dependencies into the image.
COPY ./wagtailcharts_demo/requirements.txt /code/requirements.txt
RUN --mount=type=cache,target=/root/.cache/pip pip install --upgrade pip \
    && pip install -r /code/requirements.txt

# Install wagtailcharts from the host. This folder will be overwritten by a volume mount during run time (so that code
# changes show up immediately), but it also needs to be copied into the image now so that wagtailcharts can be pip install'd.
RUN mkdir /code/wagtailcharts
COPY ./wagtailcharts /code/wagtailcharts/wagtailcharts
COPY ./setup.py /code/wagtailcharts/
COPY ./README.md /code/wagtailcharts/

RUN cd /code/wagtailcharts/ \
    && pip install -e .