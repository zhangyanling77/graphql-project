const Koa = require('koa')
const mount = require('koa-mount')
const graphqlHTTP = require('koa-graphql')
const cors = require('koa2-cors') // 解决跨域
const myGraphQLSchema = require('./schema.js')

const app = new Koa()

app.use(cors({
  origin: 'http://localhost:3000', // 来源
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'] // 允许的方法名
}))

app.use(mount('/graphql', graphqlHTTP({
  schema: myGraphQLSchema,
  graphiql: true // 开启graphiql可视化操作ide
})))


app.listen(4000, () => {
  console.log('server started on 4000')
})
