FROM node:20-alpine

RUN apk add --no-cache bash curl nginx

WORKDIR /app

COPY engine-api ./engine-api
COPY engine-core ./engine-core
COPY engine-ai ./engine-ai
COPY engine-data ./engine-data
COPY engine-intelligence ./engine-intelligence
COPY engine-trust ./engine-trust
COPY engine-optimization ./engine-optimization
COPY engine-distributed ./engine-distributed
COPY run-engine-services.sh run-api-with-engines.sh ./

RUN printf '#!/bin/bash\necho "NEXUS-ENGINE Platform Preview"\necho "ERL-4 Deployment Mode"\n./run-engine-services.sh\nsleep 10\n./run-api-with-engines.sh\n' > /app/start.sh && chmod +x /app/start.sh /app/run-engine-services.sh /app/run-api-with-engines.sh

EXPOSE 10021

CMD ["/app/start.sh"]
