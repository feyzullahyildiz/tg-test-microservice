FROM node:18-slim


ADD package.json package.json
ADD yarn.lock yarn.lock

RUN yarn
ADD . .

CMD [ "node", "send.js" ]