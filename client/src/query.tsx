import { gql } from 'apollo-boost'

export const GET_PRODUCTS = gql`
  query{
    getProducts{
      id,
      name,
      category{
        id,
        name,
        products{
          id,
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
      id,
      name,
      products{
        id,
        name
      }
    }
    getProducts{
      id,
      name,
      category{
        id,
        name,
        products{
          id,
          name
        }
      }
    }
  }
`;

// 添加产品
export const ADD_PRODUTC = gql`
  mutation($name:String!, $categoryId:String!){
    addProduct(name: $name, categoryId: $categoryId){
      id,
      name,
      category{
        id,
        name
      }
    }
  }
`;