import { Button } from 'antd';
import { requstAvailableUtxos } from '@/api';
export default function Test() {
  const testHandler = async () => {
    const data = await requstAvailableUtxos({
      address: 'tb1prcc8rp5wn0y9vp434kchl3aag8r8hz699006ufvczwnneuqx0wdsfmvq4y',
      ticker: 'test3',
    });
    console.log(data);
  };
  return <Button onClick={testHandler}>Test</Button>;
}
