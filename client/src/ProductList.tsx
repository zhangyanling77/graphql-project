import React from 'react';
import { Product } from './types'

interface Props {
  products: Array<Product>;
  setProduct: any;
}
// 产品列表
function ProductList(props: Props){
  if(!props.products) return <p>暂无数据</p>
  return (
    <table className="table table-striped">
      <caption className="text-center">产品列表</caption>
      <thead>
        <tr>
          <td>名称</td>
          <td>分类</td>
        </tr>
      </thead>
      <tbody>
        {
          props.products.map((item: Product, index:number) => (
            <tr key={item.id} onClick={() => props.setProduct(item)}>
              <td>{item.name}</td>
              <td>{item.category!.name}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default ProductList
