const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();
app.use(cors());
app.use(koaBody({ json: true }));

let foldersId = 1;
const folders = [
  {
    id: foldersId++,
    name: "Входящие",
    type: 'inbox',
  },
  {
    id: foldersId++,
    name: "Мои папки",
    type: 'userFolders',
  },
  {
    id: foldersId++,
    name: "Отправленные",
    type: 'sent',
  },
  {
    id: foldersId++,
    name: "Черновики",
    type: 'draft',
  },
  {
    id: foldersId++,
    name: "Удаленные",
    type: 'deleted',
  },
  {
    id: foldersId++,
    name: "Спам",
    type: 'spam',
  },
];

let userFoldersId = 1;
const userFolders = [
  {
    id: userFoldersId++,
    parentFolder: 'inbox',
    name: 'Папка 1',
    type: userFoldersId++,
  },
  {
    id: userFoldersId++,
    parentFolder: 'inbox',
    name: 'Папка 2',
    type: userFoldersId++,
  },
  {
    id: userFoldersId++,
    parentFolder: 'inbox',
    name: 'Папка 3',
    type: userFoldersId++,
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
  const body = userFolders.map(o => ({id: o.id, name: o.name, parentFolder: o.parentFolder, type: o.type}))
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
  
  userFolders.push({ ...ctx.request.body, id: userFoldersId++, type: userFoldersId++ });
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

// -------------- //
let messageId = 1;
const messages = [
  {
    id: messageId++,
    name: "Eliseo",
    email: "Eliseo@gardner.biz",
    message: "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium",
    type: "inbox",
    date: '2022-05-07',
    userFolder: 'Папка 1',
    isRead: true,
  },
  {
    id: messageId++,
    name: "Jayne Kuhic",
    email: "Jayne_Kuhic@sydney.com",
    message: "est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et",
    type: "inbox",
    date: '2022-05-05',
    userFolder: 'Папка 2',
    isRead: true,
  },
  {
    id: messageId++,
    name: "Nikita",
    email: "Nikita@garfield.biz",
    message: "quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\nomnis quibusdam delectus saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione",
    type: "draft",
    date: '2022-07-04',
    isRead: true,
  },
  {
    id: messageId++,
    name: "Lew",
    email: "Lew@alysha.tv",
    message: "non et atque\noccaecati deserunt quas accusantium unde odit nobis qui voluptatem\nquia voluptas consequuntur itaque dolor\net qui rerum deleniti ut occaecati",
    type: "draft",
    date: '2022-01-12',
    isRead: false,
  },
  {
    id: messageId++,
    name: "Hayden",
    email: "Hayden@althea.biz",
    message: "harum non quasi et ratione\ntempore iure ex voluptates in ratione\nharum architecto fugit inventore cupiditate\nvoluptates magni quo et",
    type: "draft",
    date: '2022-05-15',
    isRead: true,
  },
  {
    id: messageId++,
    name: "Presley Mueller",
    email: "Presley.Mueller@myrl.com",
    message: "doloribus at sed quis culpa deserunt consectetur qui praesentium\naccusamus fugiat dicta\nvoluptatem rerum ut voluptate autem\nvoluptatem repellendus aspernatur dolorem in",
    type: "draft",
    date: '2022-03-02',
    isRead: false,
  },
  {
    id: messageId++,
    name: "Dallas",
    email: "Dallas@ole.me",
    message: "maiores sed dolores similique labore et inventore et\nquasi temporibus esse sunt id et\neos voluptatem aliquam\naliquid ratione corporis molestiae mollitia quia et magnam dolor",
    type: "deleted",
    date: '2022-01-02',
    isRead: true,
  },
  {
    id: messageId++,
    name: "Mallory Kunze",
    email: "Mallory_Kunze@marie.org",
    message: "ut voluptatem corrupti velit\nad voluptatem maiores\net nisi velit vero accusamus maiores\nvoluptates quia aliquid ullam eaque",
    type: "deleted",
    date: '2021-11-02',
    isRead: false,
  },
  {
    id: messageId++,
    name: "Meghan Littel",
    email: "Meghan_Littel@rene.us",
    message: "sapiente assumenda molestiae atque\nadipisci laborum distinctio aperiam et ab ut omnis\net occaecati aspernatur odit sit rem expedita\nquas enim ipsam minus",
    type: "deleted",
    date: '2020-11-02',
    isRead: false,
  },
  {
    id: messageId++,
    name: "Carmen Keeling",
    email: "Carmen_Keeling@caroline.name",
    message: "voluptate iusto quis nobis reprehenderit ipsum amet nulla\nquia quas dolores velit et non\naut quia necessitatibus\nnostrum quaerat nulla et accusamus nisi facilis",
    type: "deleted",
    date: '2021-07-13',
    isRead: false,
  },
  {
    id: messageId++,
    name: "Veronica Goodwin",
    email: "Veronica_Goodwin@timmothy.net",
    message: "ut dolorum nostrum id quia aut est\nfuga est inventore vel eligendi explicabo quis consectetur\naut occaecati repellat id natus quo est\nut blanditiis quia ut vel ut maiores ea",
    type: "spam",
    date: '2021-09-13',
    isRead: true,
  },
  {
    id: messageId++,
    name: "Oswald Vandervort",
    email: "Oswald.Vandervort@leanne.org",
    message: "expedita maiores dignissimos facilis\nipsum est rem est fugit velit sequi\neum odio dolores dolor totam\noccaecati ratione eius rem velit",
    type: "spam",
    date: '2021-12-25',
    isRead: true,
  },
  {
    id: messageId++,
    name: "Kariane",
    email: "Kariane@jadyn.tv",
    message: "fuga eos qui dolor rerum\ninventore corporis exercitationem\ncorporis cupiditate et deserunt recusandae est sed quis culpa\neum maiores corporis et",
    type: "inbox",
    date: '2021-03-25',
    userFolder: 'Папка 3',
    isRead: true,
  },
  {
    id: messageId++,
    name: "Nathan",
    email: "Nathan@solon.io",
    message: "vel quae voluptas qui exercitationem\nvoluptatibus unde sed\nminima et qui ipsam aspernatur\nexpedita magnam laudantium et et quaerat ut qui dolorum",
    type: "inbox",
    date: '2022-03-17',
    isRead: false,
  },
  {
    id: messageId++,
    name: "Maynard Hodkiewicz",
    email: "Maynard.Hodkiewicz@roberta.com",
    message: "nihil ut voluptates blanditiis autem odio dicta rerum\nquisquam saepe et est\nsunt quasi nemo laudantium deserunt\nmolestias tempora quo quia",
    type: "inbox",
    date: '2021-07-17',
    isRead: false,
  },
  {
    id: messageId++,
    name: "Christine",
    email: "Christine@ayana.info",
    message: "iste ut laborum aliquid velit facere itaque\nquo ut soluta dicta voluptate\nerror tempore aut et\nsequi reiciendis dignissimos expedita consequuntur libero sed fugiat facilis",
    type: "inbox",
    date: '2021-10-05',
    isRead: false,
  },
  {
    id: messageId++,
    name: "Preston Hudson",
    email: "Preston_Hudson@blaise.tv",
    message: "consequatur necessitatibus totam sed sit dolorum\nrecusandae quae odio excepturi voluptatum harum voluptas\nquisquam sit ad eveniet delectus\ndoloribus odio qui non labore",
    type: "inbox",
    date: '2021-10-10',
    isRead: false,
  },
  {
    id: messageId++,
    name: "Vincenza Klocko",
    email: "Vincenza_Klocko@albertha.name",
    message: "veritatis voluptates necessitatibus maiores corrupti\nneque et exercitationem amet sit et\nullam velit sit magnam laborum\nmagni ut molestias",
    type: "sent",
    date: '2021-11-11',
    isRead: true,
  },
  {
    id: messageId++,
    name: "Madelynn Gorczany",
    email: "Madelynn.Gorczany@darion.biz",
    message: "doloribus est illo sed minima aperiam\nut dignissimos accusantium tempore atque et aut molestiae\nmagni ut accusamus voluptatem quos ut voluptates\nquisquam porro sed architecto ut",
    type: "inbox",
    date: '2021-06-30',
    isRead: false,
  },
  {
    id: messageId++,
    name: "Mariana Orn",
    email: "Mariana_Orn@preston.org",
    message: "qui harum consequatur fugiat\net eligendi perferendis at molestiae commodi ducimus\ndoloremque asperiores numquam qui\nut sit dignissimos reprehenderit tempore",
    type: "sent",
    date: '2021-08-30',
    isRead: true,
  },
]

router.get('/api/messages/:id', async (ctx, next) => {
  const id = Number(ctx.params.id);
  const index = messages.findIndex(o => o.id === id);
  if (index === -1) {
      const status = 404;
      return fortune(ctx, null, status);
  }
  const body = messages[index];
  return fortune(ctx, body);
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
server.listen(port);