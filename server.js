const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();
app.use(cors());
app.use(koaBody({ json: true }));

let nextId = 1;
const folders = [
  {
    id: nextId++,
    name: "Входящие",
    type: 'inbox',
  },
  {
    id: nextId++,
    name: "Мои папки",
    type: 'userFolders',
  },
  {
    id: nextId++,
    name: "Отправленные",
    type: 'sent',
  },
  {
    id: nextId++,
    name: "Черновики",
    type: 'draft',
  },
  {
    id: nextId++,
    name: "Удаленные",
    type: 'deleted',
  },
  {
    id: nextId++,
    name: "Спам",
    type: 'spam',
  },
];

const userFolders = [
  {
    id: nextId++,
    parentFolder: 'inbox',
    name: 'Папка 1'
  },
  {
    id: nextId++,
    parentFolder: 'inbox',
    name: 'Папка 2'
  },
  {
    id: nextId++,
    parentFolder: 'inbox',
    name: 'Папка 3'
  },
]

const router = new Router();

function fortune(ctx, body = null, status = 200) {
    return new Promise((resolve, reject) => {
      ctx.response.status = status;
      ctx.response.body = body;
      resolve();
    })
}

router.get('/api/folders', async (ctx, next) => {
    const body = folders.map(o => ({id: o.id, name: o.name, type: o.type}))
    return fortune(ctx, body);
});

router.get('/api/user-folders', async (ctx, next) => {
  const body = userFolders.map(o => ({id: o.id, name: o.name, parentFolder: o.parentFolder}))
  return fortune(ctx, body);
});

router.post('/api/user-folders', async (ctx, next) => {
  const id = ctx.request.body.id;
  if (id) {
      const index = userFolders.findIndex(o => o.id === id);
      if (index === -1) {
          const status = 404;
          return fortune(ctx, null, status);
      }
      userFolders[index] = ctx.request.body;
      return fortune(ctx, null, 204);
  }
  
  userFolders.push({ ...ctx.request.body, id: nextId++ });
  const status = 204;
  return fortune(ctx, null, status);
});

router.delete('/api/user-folders/:id', async (ctx, next) => {
  const id = Number(ctx.params.id);
  const index = userFolders.findIndex(o => o.id === id);
  if (index === -1) {
      const status = 404;
      return fortune(ctx, null, status);
  }
  userFolders.splice(index, 1);
  const status = 204;
  return fortune(ctx, null, status);
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
server.listen(port);