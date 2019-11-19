# graphql-project
入门graphql的小实践

## 项目使用技术栈
```javascript
server: 
koa + graphql + mongooes

client:
react hooks + ts + apollo-boots + @apollo/react-hooks + graphql
```

## 安装项目依赖

```javascript
server: 
mkdir server
cd server
npm init -y
yarn add koa koa-router koa2-cors graphql koa-graphql koa-mount mongoose

client:
npx create-react-app client --typescript
cd client
yarn add apollo-boost @apollo/react-hooks graphql
```
## Server端开发
* 创建server.js
```javascript
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
```
* 启动服务端
```bash
node server.js
```
访问 http://localhost:4000/graphql 可以看到graphiql可视化操作界面

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
          // return categories.find(item => item.id === parent.category)
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
      resolv(parent, args){
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
const conn = mongoose.createConnection('mongodb://localhost/graphql')

conn.on('open', () => {
  console.log('数据库连接成功！')
})

conn.on('error', (error) => {
  console.log(error)
})

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

