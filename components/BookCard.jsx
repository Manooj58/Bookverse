import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import images from '../assets';

const BookCard = ({ book }) => (
  <Link href={{ pathname: '/book-details', query: { book } }}>
    <div className="flex-1 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-237 dark:bg-book-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md">
      <div className="relative w-full h-52 sm:h-26 xs:h-56 mind:h-60 minlg:h-300 rounded-2xl overflow-hidden">
        <Image src={book.image || images[`book${book.i}`]} layout="fill" objectFit="cover" alt={`book${book.i}`} />
      </div>
      <div className="mt-3 flex flex-col">
        <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-sm minlg:text-xl">{book.name}</p>
        <div className="flexBetween mt-3 minlg:mt-3 flex-row xs:flex-col xs:items-start xs:mt-3">
          <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-xs minlg:text-lg">{book.price} <span className="normal">ETH</span></p>
          <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-xs minlg:text-lg">{book.seller}</p>
        </div>
      </div>
    </div>
  </Link>
);

export default BookCard;