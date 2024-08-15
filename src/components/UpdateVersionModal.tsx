import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Space } from 'antd';
import version from '@/assets/version.txt?raw';
import { useAppVersion } from '@/api';

export const UpdateVersionModal = () => {
  // console.log('version', version);
  const [open, setOpen] = useState(false);
  const { data: appVersion } = useAppVersion();
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
    if (appVersion && appVersion > version) {
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
  }, [appVersion]);
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
