import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { useMap } from 'react-use';

const { Dragger } = Upload;

interface InscribeFilesProps {
  onNext?: () => void;
  onChange?: (files: any[]) => void;
}
export const InscribeFiles = ({ onChange }: InscribeFilesProps) => {
  const [files, setFiles] = useState<any[]>([]);
  const [originFiles, setOriginFiles] = useState<any[]>([]);
  const filesChange: UploadProps['onChange'] = ({ file, fileList }) => {
    console.log(file, fileList);
    const originFiles = fileList.map((f) => f.originFileObj);
    onChange?.(originFiles);
    setOriginFiles(originFiles);
    setFiles([]);
  }
  return (
    <div>
      <div className='mb-4 text-center'>
        <p>Upload your files to begin</p>
      </div>
      <div className='mb-4'>
        <Dragger multiple fileList={files} onChange={filesChange} showUploadList={false}>
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>
            Drag and drop your files here, or click to select files
          </p>
          <p className='ant-upload-hint'>
            .jpg, .webp, .png, .gif, .txt, .mp3, .mp4(h264) + more!
          </p>
        </Dragger>
      </div>
      {/* <div className='w-full mx-auto'>
        <Button type="primary" size='large' className='w-full'  disabled={!originFiles.length} onClick={onNext}>
          Next
        </Button>
      </div> */}
    </div>
  );
};
