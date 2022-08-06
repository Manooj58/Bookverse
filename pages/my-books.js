import { useState, useEffect, useContext } from 'react';
import Image from 'next/dist/client/image';

import { BookContext } from '../context/BookContext';
import { BookCard, Loader, Banner } from '../components';
import { shortenAddress } from '../utils/shortenAddress';
import images from '../assets';

const MyBooks = () => {
  const { fetchMyBooksOrListedBooks, currentAccount } = useContext(BookContext);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }
  return (
    <div className="w-full flex justify-start items-center flex-col min-h-screen">
      <div className="w-full flexCenter flex-col">
        <Banner
          banner="Heading Here"
          childStyles="text-center mb-4"
          parentStyles="h-80 justify-center"
        />

        <div className="flexCenter flex-col -mt-20 z-0">
          <div className="flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 bg-book-black-2 rounded-full">
            <Image src={images.creator1} className="rounded-full object-cover" objectFit="cover" />
          </div>
          <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-2xl mt-6">{shortenAddress(currentAccount)}</p>
        </div>
      </div>

      {(!isLoading && !books.length) ? (
        <div className="flexCenter sm:p-4 p-16">
          <h1 className="font-poppins dark:text-white text-book-black-1 text-3xl font-extrabold">No Book owned</h1>
        </div>
      ) : (
        <div className="sm:px-4 p-12 w-full minmd:w-4/5 flexCenter flex-col">
          <div className="flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8">
            SearchBar
          </div>
          <div className="mt-3 w-full flex flex-wrap">
            {books.map((book) => <BookCard key={`book-${book.tokenId}`} book={book} onProfilePage />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooks;