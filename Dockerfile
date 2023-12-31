
FROM nginx:latest


RUN apt-get update && \
    apt-get install -y git


RUN git clonehttps://github.com/stevenbachimont/myco2


EXPOSE 80