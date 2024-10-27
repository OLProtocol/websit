import { useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import version from '@/assets/version.txt?raw';
import { useAppVersion } from '@/swr';

export const UpdateVersionModal = () => {
  // console.log('version', version);
  const [open, setOpen] = useState(false);
  const { resp } = useAppVersion();
  const timer = useRef<any>();
  const showModal = () => {
    setOpen(true);
  };
  const refresh = () => {
    setOpen(false);
    window.location.reload();
  };
  const checkVersion = () => {
    // console.log('appVersion', appVersion);
    // console.log('version', version);
    if (resp && resp > version) {
      showModal();
    }
  };
  const hideModal = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      checkVersion();
    }, 1000 * 60 * 5);
    setOpen(false);
  };
  useEffect(() => {
    checkVersion();
  }, [resp]);
  return (
    <Modal
      title='有新版本，是否更新'
      open={open}
      centered
      onOk={refresh}
      onCancel={hideModal}
      okText='立即更新'
      cancelText='取消'></Modal>
  );
};
