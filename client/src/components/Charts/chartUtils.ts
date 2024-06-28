import { OrderDTO } from "../../types";
import { orderBy, take } from "lodash";

export const aggregateSales = (orders: OrderDTO[], key: 'shoe' | 'store') => {
  const sales: { [key: string]: number } = {};
  orders.forEach(order => {
    const id = key === 'shoe' ? order.shoe.model : order.shoe.store?.name!;
    if (!sales[id]) {
      sales[id] = 0;
    }
    sales[id] += order.quantitySold;
  });
  return sales;
};

export const getTopItems = (
  sales: { [key: string]: number },
  count: number,
  isTop: boolean = true
) => {

  const sortedItems = orderBy(Object.entries(sales), ([, value]) => value, isTop ? 'desc' : 'asc');
  return take(sortedItems, count)
  
};

export const getStoresWithMostItems = (orders: OrderDTO[], count: number, isTop: boolean = true) => {
  const storeItems: { [key: string]: Set<string> } = {};

  orders.forEach((order) => {
    const storeName = order.shoe.store?.name!;
    if (!storeItems[storeName]) {
      storeItems[storeName] = new Set();
    }
    storeItems[storeName].add(order.shoe.model);
  });

  const sortedStores = orderBy(
    Object.entries(storeItems),
    ([, models]) => models.size,
    isTop ? 'desc' : 'asc'
  );

  return take(sortedStores, count)
};

