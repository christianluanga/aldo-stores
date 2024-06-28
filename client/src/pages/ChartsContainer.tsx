import React from 'react';
import { BarChart, DoughnutChart, PieChart} from '../components/Charts/'
/** import { orders } from './dataset' 
 * Uncomment this to use static data to see the charts if not enough
 * transaction have't been made.
*/
import { useQuery } from '@apollo/client';
import { OrderDTO } from '../types';
import { GET_ORDER_HISTORY } from '../graphql';

const ChartsContainer: React.FC = () => {
  const { loading, error, data } = useQuery<{ orders: OrderDTO[] }>(GET_ORDER_HISTORY, {
    fetchPolicy: 'no-cache'
  });

  if (loading) return <p>Loading Stores...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const orders = data?.orders as OrderDTO[]
  
  return (
    <div className="container mx-auto">
      <p className='text-lg pb-16 pt-8 text-center text-gray-600 max-w-screen-md mx-auto'>
      Experiment with adjusting the number of items included in the dataset for any chart, 
      and observe how the chart dynamically responds to the changes. By increasing or 
      decreasing the dataset size, you can see real-time updates in the chart's visual 
      representation, providing immediate feedback on data variations and trends.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-8">
        <DoughnutChart orders={orders} />
        <BarChart orders={orders} />
      </div>
      <PieChart orders={orders} />
    </div>
  );
};

export default ChartsContainer;
