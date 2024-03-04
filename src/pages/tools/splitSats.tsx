import { Input } from 'antd';
import { useState } from 'react';
const { Search } = Input;
export default function SplitSats() {
  const [sat, setSat] = useState('');
  const doCheck = async () => {
    console.log(sat);
  };
  return (
    <div className='max-w-xl mx-auto'>
      <div className='flex justify-center mb-12 py-2'>
        <Search
          allowClear
          placeholder='Sats'
          size='large'
          value={sat}
          onChange={(e) => setSat(e.target.value)}
          onSearch={doCheck}
        />
      </div>
    </div>
  );
}
