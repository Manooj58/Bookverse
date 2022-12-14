import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import images from '../assets';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="flexCenter flex-col border-t dark:border-book-black-1 border-book-gray-1 sm:py-8 py-16">
      <div className="flexCenter w-full mt-5 border-t dark:border-book-black-1 border-book-gray-1 sm:px-4 px-16">
        <div className="flexBetween flex-row w-full minmd:w-4/5 sm:flex-col mt-7">
          <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-base">Bookverse,  Inc. All right Reserved.</p>
          <div className="flex flex-row sm:mt-4">
            {[images.instagram, images.twitter, images.telegram, images.discord].map((image, index) => (
              <div className="mx-2 cursor-pointer" key={index}>
                <Image src={image} objectFit="contain" width={24} height={24} alt="social" className={theme === 'light' && 'filter invert'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
