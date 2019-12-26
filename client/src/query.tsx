// import { gql } from 'apollo-boost'
import gql from 'graphql-tag'

export const GET_PRODUCTS = gql`
  query{
    getProducts{
      id
      name
      category{
        id
        name
        products{
          id
          name
        }
      }
    }
  }
`;

// 查询所有的上屏分类和产品
export const CATEGORIES_PRODUCTS = gql`
  query{
    getCategories{
      id
      name
      products{
        id
        name
      }
    }
    getProducts{
      id,
      name
      category{
        id
        name
        products{
          id
          name
        }
      }
    }
  }
`;

// 添加产品
export const ADD_PRODUCT = gql`
  mutation($name:String!, $categoryId:String!){
    addProduct(name: $name, category: $categoryId){
      id
      name
      category{
        id
        name
      }
    }
  }
`;

// 修改产品
// export const UPDATE_PRODUCT = gql`
//   mutation($Id: String!, $name: String, $categoryId: String){
//     updateProduct(id: $Id, name: $name, category: $categoryId){
//       id
//       name
//       category{
//         id
//         name
//       }
//     }
//   }
// `;

// 删除产品
export const DELETE_PRODUCT = gql`
  mutation($id: String!){
    deleteProduct(id: $id){
      id,
      name
    }
  }
`;
