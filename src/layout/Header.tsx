import { Divider } from '@chakra-ui/react';
import { UnisatConnectButton } from '@/components/UnisatConnectButton';
import { LinkBox, LinkOverlay } from '@chakra-ui/react';

export const Header = () => {
  return (
    <header className='w-full h-16 bg-gray-300 sticky top-0 z-10'>
      <div className='flex h-full items-center px-4'>
        <div className='flex-1 flex h-full items-center py-4'>
          <div className='mr-8'>Logo</div>
          {/* <LinkBox>
            <LinkOverlay href='/#/'>
              Home
            </LinkOverlay>
          </LinkBox> */}
          {/* <Divider orientation='vertical' className='mx-4' /> */}
          <LinkBox>
            <LinkOverlay href='/#/inscribe'>
              Inscribe
            </LinkOverlay>
          </LinkBox>
          <Divider orientation='vertical' className='mx-4' />
          <LinkBox>
            <LinkOverlay href='/#/ord2'>
              Ord2
            </LinkOverlay>
          </LinkBox>
        </div>
        <div className='flex justify-center'>
          <UnisatConnectButton />
        </div>
      </div>
    </header>
  );
};
