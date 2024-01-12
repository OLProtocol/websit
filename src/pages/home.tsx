import HomeBannerImage from '@/assets/images/home_banner.jpg';

export default function Home() {
  return (
    <div className="min-h-full bg-gray-900">
      <div className='max-w-3xl mx-auto pt-4'>
        <div className='rounded-2xl overflow-hidden'>
          <img src={HomeBannerImage} alt='banner' className='w-full' />
        </div>
      </div>
    </div>
  );
}
