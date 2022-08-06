import { useState, useEffect, useContext } from 'react';
import Image from 'next/dist/client/image';

import { useRouter } from 'next/dist/client/router';
import { BookContext } from '../context/BookContext';
import { BookCard, Loader, Button } from '../components';
import { shortenAddress } from '../utils/shortenAddress';
import images from '../assets';

const BookDetails = () => {
  const { currentAccount, currency } = useContext(BookContext);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [book, setBook] = useState({ image: '', tokenId: '', name: '', owner: '', price: '', seller: '' });

  useEffect(() => {
    if (!router.isReady) return;
    setBook(router.query);
    setIsLoading(false);
  }, [router.isReady]);

  if (isLoading) return <Loader />;
  return (
    <div className="relative flex justify-center md:flex-col min-h-screen">
      <div className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-book-black-1 border-book-gray-1">
        <div className="relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-557 ">
          <Image src={book.image || images[`book${book.i}`]} objectFit="cover" className=" rounded-xl shadow-lg" layout="fill" />
        </div>
      </div>

      <div className="flex-1 justify-start sm:px-4 p-12 sm:pb-4">
        <div className="flex flex-row sm:flex-col">
          <h2 className="font-poppins dark:text-white text-book-black-1 font-semibold text-2xl minlg:text-3xl">{book.name}</h2>
        </div>

        <div className="mt-10">
          <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-2xl minlg:text-2xl">Creator</p>
          <div className="flex flex-row items-center mt-3">
            <div className="relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
              <Image src={images.creator1} objectFit="cover" className="rounded-full" />
            </div>
            <p className="font-poppins dark:text-white text-book-black-1 text-sm minlg:text-lg font-semibold">{shortenAddress(book.seller)}</p>
          </div>
        </div>


        <div className="mt-10 flex flex-col">
          <div className="w-full border-b dark:border-book-black-1 border-book-gray-1 flex flex-row">
            <p className="font-poppins dark:text-white text-book-black-1 font-medium text-base mb-2">Details</p>
          </div>
          <div className="mt-3">
            <p className="font-poppins dark:text-white text-book-black-1 font-normal text-base">
              {book.description}
            </p>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col mt-10">
          {currentAccount === book.seller.toLowerCase()
            ? (
              <p className="font-poppins dark:text-white text-book-black-1 font-normal text-base border border-gray p-2">
                You cannot buy your own book
              </p>
            )
            : currentAccount === book.owner.toLowerCase()
              ? (
                <Button
                  btnName="List on Marketplace"
                  btnType="primary"
                  classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                  handleClick={() => router.push(`/resell-book?id=${book.tokenId}&tokenURI=${book.tokenURI}`)}
                />
              )
              : (
                <Button
                  btnName={`Buy for ${book.price} ${bookCurrency}`}
                  btnType="primary"
                  classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                  handleClick={() => { }}
                />
              )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;