# graphql-project
入门graphql的小实践

## 项目使用技术栈
```javascript
server: 
koa + graphql + mongooes

client:
react hooks + ts + apollo-boost + @apollo/react-hooks + graphql
```
```javascript
模块名	含义

https://www.apollographql.com/docs/react/get-started/

apollo-boost	Package containing everything you need to set up Apollo Client
@apollo/react-hooks	React hooks based view layer integration
graphql	Also parses your GraphQL queries
```
* 看到一篇不错的文章（关于react+apollo+graphql的）https://segmentfault.com/a/1190000019443585

## 安装项目依赖

```javascript
server: 
mkdir server
cd server
npm init -y
yarn add koa koa-router koa2-cors graphql koa-graphql koa-mount mongoose koa-logger

client:
npx create-react-app client --typescript
cd client
yarn add apollo-boost @apollo/react-hooks graphql
```
注意：如果你需要使用组件的方式来查询和更新model，那么你可以安装 react-apollo

## Server端开发
* 创建server.js
```javascript
  const Koa = require('koa')
  // const mount = require('koa-mount')
  const graphqlHTTP = require('koa-graphql')
  const Router = require('koa-router')
  const cors = require('koa2-cors') // 解决跨域
  const logger = require('koa-logger')
  const myGraphQLSchema = require('./schema')

  const app = new Koa()
  const router = new Router()

  app.use(logger())

  app.use(cors({
    origin: 'http://localhost:3000', // 来源
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'] // 允许的方法名
  }))

  // app.use(mount('/graphql', graphqlHTTP({
  //   schema: myGraphQLSchema,
  //   graphiql: true // 开启graphiql可视化操作ide
  // })))

  router.all('/graphql', graphqlHTTP({
    schema: myGraphQLSchema,
    graphiql: true
  }))

  app.use(router.routes()).use(router.allowedMethods())


  app.listen(4000, () => {
    console.log('server started on 4000')
  })

```
* 启动服务端
```bash
nodemon server.js
```
访问 http://localhost:4000/graphql 可以看到graphiql可视化操作界面
（graphiql：一个交互式的运行于浏览器中的 GraphQL IDE）

* 创建schema.js
```javascript
const graphql = require('graphql')
const { CategoryModel, ProductModel } = require('./model.js')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
}  = graphql

// 商品分类查询对象
const Category = new GraphQLObjectType({
  name: 'Category',
  fields: () => (
    {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      products: {
        type: new GraphQLList(Product),
        resolve(parent){
          return ProductModel.find({ category: parent.id })
        }
      }
    }
  )
})

const Product = new GraphQLObjectType({
  name: 'Product',
  fields: () => (
    {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      category: {
        type: Category,
        resolve(parent){
          return CategoryModel.findById(parent.category)
        }
      }
    }
  )
})

// 根查询对象
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    getCategory: { // 子查询
      type: Category,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parent, args){
        return CategoryModel.findById(args.id)
      }
    },
    getCategories: {
      type: new GraphQLList(Category),
      args: {},
      resolve(parent, args){
        return CategoryModel.find()
      }
    },
    getProduct: {
      type: Product,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parent, args){
        return ProductModel.findById(args.id)
      }
    },
    getProducts: {
      type: new GraphQLList(Product),
      args: {},
      resolve(parent, args){
        return ProductModel.find()
      }
    }
  }
})

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    addCategory: {
      type: Category,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parent, args){
        return CategoryModel.create(args)
      }
    },
    addProduct: {
      type: Product,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        },
        category: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parent, args){
        return ProductModel.create(args)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})
```
* 创建model.js 操作数据库
首先启动数据库服务，并连接到本地数据库
```bash
cd C:\Program Files\MongoDB\Server\4.2\bin
mongod --dbpath=./data
```

```javascript
let mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema
const conn = mongoose.createConnection('mongodb://localhost/graphql',{ useNewUrlParser: true, useUnifiedTopology: true })

conn.on('open', () => console.log('数据库连接成功！'))

conn.on('error', (error) => console.log(error))

// 用于定义表结构
const CategorySchema = new Schema({
  name: String
})
// 增删改查
const CategoryModel = conn.model('Category', CategorySchema)

const ProductSchema = new Schema({
  name: String,
  category: {
    type: ObjectId, // 外键
    ref: 'Category'  
  }
})

const ProductModel = conn.model('Product', ProductSchema)

module.exports = {
  CategoryModel,
  ProductModel
}
```

## Client端开发
* 启动项目 
```bash
yarn start
```

* 使用cra生成项目结构，安装完需要的依赖，删除src下所有的文件

* 创建src/index.tsx
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks'
import App from './App'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)

```

## 其他模块
未完待续...

## 构建部署
```bash
yarn build
or
npm run build
```
* 得到build目录，即为打包好的文件
* 本地验证：
```bash
yarn global add serve
serve -s build
```
* 访问 http://localhost:5000 可验证打包内容是否正确
