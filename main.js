const express = require('express')
const {auth, requiresAuth} = require('express-openid-connect')

if (require.main === module) {
  main()
}

async function main () {
  try {
    const router = express()

    router.use(auth({
      authRequired: false,
      auth0Logout: true,
      secret: process.env.AUTH0_SECRET,
      baseURL: process.env.AUTH0_BASE_URL,
      clientID: process.env.AUTH0_CLIENT_ID,
      issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    }))

    router.get('/', (req, res) => {
        res
        .type('text/html')
        .send(
        `<button><a href='/profile/'>ユーザー情報表示</a></button>
         <button><a href='/private/'>ログイン</a></button>`
        );
    })

    router.use('/private/', requiresAuth())

    router.get('/private/', (req, res) => {
        res
        .type('text/html')
        .send(
        ` <button><a href='/profile/'>ユーザー情報表示</a></button>
         <button><a href='/logout/'>ログアウト</a></button>`
        );
    })

    router.get('/profile', (req, res) => {
        if (req.oidc.isAuthenticated()) {
            return res.send(JSON.stringify(req.oidc.user));
        }else{
            return res.send('ログインしてないよ');
        }
      });

    router.listen(process.env.PORT, () => {
      console.info(`Listening on ${process.env.PORT}`)
    })
  } catch (err) {
    console.error(err)
  }
}