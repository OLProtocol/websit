import { Outlet, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import {Header } from '@/layout/Header';
export default function Root() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
