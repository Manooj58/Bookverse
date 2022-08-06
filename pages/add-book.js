import React, { useState, useMemo, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { Button, Input } from '../components';
import images from '../assets';
import { BookContext } from '../context/BookContext';

const AddBook = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [pdfUrl, setpdfUrl] = useState(null);
  const [formInput, setFormInput] = useState({ price: '', name: '', description: '' });
  const { theme } = useTheme();
  const {uploadToIPFS,createBook} = useContext(BookContext);
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFile) => {
    // upload image to the blockchain (ipfs)
    const url = await uploadToIPFS(acceptedFile[0]);
    console.log(url);

    if (acceptedFile[0].type.match('image.*')) {
      setFileUrl(url);
    } else {
      setpdfUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/*,.pdf',
    maxSize: 5000000,
  });

  const fileStyle = useMemo(() => (
    `dark:bg-book-black-1 bg-white border dark:border-white border-book-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed
    ${isDragActive && 'border-file-active'}
    ${isDragAccept && 'border-file-accept'}
    ${isDragReject && 'border-file-reject'}
    `
  ), [isDragActive, isDragAccept, isDragReject]);

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-book-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
          Add New Book
        </h1>
        <Input inputType="input" title="Name" placeholder="Item Name" handleClick={(e) => { setFormInput({ ...formInput, name: e.target.value }); }} />
        <Input inputType="textarea" title="Description" placeholder="Book Description" handleClick={(e) => { setFormInput({ ...formInput, description: e.target.value }); }} />
        <Input inputType="number" title="Price" placeholder="Book Price" handleClick={(e) => { setFormInput({ ...formInput, price: e.target.value }); }} />
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-xl">Book Cover</p>
          <div className="mt-4">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-xl">JPG, PNG, GIF, SVG, WEBM.</p>
                {/* <div className="my-12 w-full flex justify-center">
                  <Image src={images.upload} width={100} height={100} objectFit="contain" alt="file upload" className={theme === 'light' && 'filter invert'} />
                </div> */}
                {/* <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-sm">Drag and Drop File</p>
                <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-sm">or Browse media on your device </p> */}
              </div>
            </div>
            {fileUrl && (
              <aside>
                <div>
                  <img src={fileUrl} alt="asset_file" />
                </div>
              </aside>
            )}
          </div>
        </div>
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-xl">Upload Book PDF</p>
          <div className="mt-4">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-xl">Upload PDF.</p>
                {/* <div className="my-12 w-full flex justify-center">
                  <Image src={images.upload} width={100} height={100} objectFit="contain" alt="file upload" className={theme === 'light' && 'filter invert'} />
                </div> */}
                {/* <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-sm">Drag and Drop File</p>
                <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-sm">or Browse media on your device </p> */}
              </div>
            </div>
            {pdfUrl && (
              <aside>
                <div>
                  <img src={pdfUrl} alt="asset_file" />
                </div>
              </aside>
            )}
          </div>
        </div>
        <div className="mt-7 w-full flex justify-end">
          <Button btnName="Create Book" className="rounded-xl" handleClick={() => createBook(formInput,fileUrl,pdfUrl, router)} />
        </div>
      </div>
    </div>
  );
};

export default AddBook;
