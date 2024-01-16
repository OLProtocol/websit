import Home01Image from '@/assets/images/home_01.png';
import Home02Image from '@/assets/images/home_02.png';
import Home03Image from '@/assets/images/home_03.png';
import Home04Image from '@/assets/images/home_04.png';
import Home05Image from '@/assets/images/home_05.png';
import Home06Image from '@/assets/images/home_06.png';
import Home07Image from '@/assets/images/home_07.png';

export default function Home() {
  return (
    <div className="min-h-full bg-gray-900">
       {/* <div className='max-w-4xl mx-auto pt-4'> */}
      <div className='max-w-4xl mx-auto pt-4'>
        <div className='rounded-2xl overflow-hidden'>
          <img src={Home01Image} alt='banner' className='w-full' />
        </div>
      </div>

      <div className='max-w-4xl mx-auto pt-4'>
        <div className='rounded-2xl overflow-hidden'>
          <img src={Home02Image} alt='banner' className='w-full' />
        </div>
      </div>

      <div className='max-w-4xl mx-auto pt-4'>
        <div className='rounded-2xl overflow-hidden'>
          <img src={Home03Image} alt='banner' className='w-full' />
        </div>
      </div>

      <div className='max-w-4xl mx-auto pt-4'>
        <div className='rounded-2xl overflow-hidden'>
          <img src={Home04Image} alt='banner' className='w-full' />
        </div>
      </div>

      <div className='max-w-4xl mx-auto pt-4'>
        <div className='rounded-2xl overflow-hidden'>
          <img src={Home05Image} alt='banner' className='w-full' />
        </div>
      </div>

      <div className='max-w-4xl mx-auto pt-4'>
        <div className='rounded-2xl overflow-hidden'>
          <img src={Home06Image} alt='banner' className='w-full' />
        </div>
      </div>

      <div className='max-w-4xl mx-auto pt-4'>
        <div className='rounded-2xl overflow-hidden'>
          <img src={Home07Image} alt='banner' className='w-full' />
        </div>
      </div>
    </div>
  );
}
