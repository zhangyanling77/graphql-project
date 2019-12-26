import React, { useState }  from 'react';
import { Product } from './types';
import { DELETE_PRODUCT, GET_PRODUCTS } from './query';
import { useMutation } from '@apollo/react-hooks';

interface Props {
  products: Array<Product>;
  setProduct: any;
}
// 产品列表
function ProductList(props: Props){
  let pageSize = 10;
  let [current, setCurrent] = useState<number>(0)
  let productsList = props.products
  let [currentList, setCurrentList] = useState<Array<Product>>(productsList.slice(current, pageSize))
  let paginationItems = [];
  let len = Math.ceil(props.products.length / pageSize)
  for(let i = 0; i < len; i++){
    paginationItems.push(i)
  }

  function changePage (item:number) {
    setCurrent(item)
    // 分页更换数据
    let start = item*pageSize >= 0 ? item*pageSize : 0;
    let end = start + pageSize
    let newTemp = productsList.slice(start, end)
    setCurrentList(newTemp)
    
  }
  
   // 删除商品 
  let [deleteProduct] = useMutation(DELETE_PRODUCT)
  const deleteItem = (item: Product) => {
    // console.log(item)
    deleteProduct({
      variables: {
        id: item.id
      },
      refetchQueries: [{
        query: GET_PRODUCTS
      }]
    })
  }
  return (
    <>
      <table className="table table-striped">
        <caption className="text-center"><b>产品列表</b></caption>
        <thead>
          <tr>
            <td>名称</td>
            <td>分类</td>
            <td>操作</td>
          </tr>
        </thead>
        <tbody>
          {
            props.products.map((item: Product, index:number) => (
              <tr key={item.id} onClick={() => props.setProduct(item)}>
                <td>{item.name}</td>
                <td>{item.category!.name}</td>
                <td><a href="#" style={{color: 'red'}} onClick={() => deleteItem(item)}>删除</a></td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <ul className="pagination">
        {
          paginationItems.map((item: number) => (
            <li key={item} 
              className={item===current?"page-item active":"page-item"}
              onClick={() => changePage(item)}
            >
              <a className="page-link" href="#" 
              >{item+1}</a>
            </li>
          ))
        }
      </ul>
    </>
  )
}

export default ProductList
