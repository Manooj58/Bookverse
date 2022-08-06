import { useState, useEffect, useContext } from 'react';
import Image from 'next/dist/client/image';

import { useRouter } from 'next/dist/client/router';
import { BookContext } from '../context/BookContext';
import { BookCard, Loader, Button,Modal } from '../components';
import { shortenAddress } from '../utils/shortenAddress';
import images from '../assets';

const PaymentBodyCmp = ({ book, currency }) => (
    <div className="flex flex-col">
      <div className="flexBetween">
        <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-base minlg:text-xl">Item</p>
        <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-base minlg:text-xl">Subtotal</p>
      </div>
      <div className="flexBetweenStart my-5">
        <div className="flex-1 flexStartCenter">
          <div className="relative w-28 h-28">
            <Image src={book.image || images[`book${book.i}`]} layout="fill" objectFit="cover" />
          </div>
          <div className="flexCenterStart flex-col ml-5">
            <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-sm minlg:text-xl">{shortenAddress(book.seller)}</p>
            <p className="font-poppins dark:text-white text-book-black-1 text-sm minlg:text-xl font-normal">{book.name}</p>
          </div>
        </div>
        <div>
          <p className="font-poppins dark:text-white text-book-black-1 text-sm minlg:text-xl font-normal">{book.price} <span className="font-semibold">{currency}</span></p>
        </div>
      </div>
      <div className="flexBetween mt-10">
        <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-base minlg:text-xl">Total</p>
        <p className="font-poppins dark:text-white text-book-black-1 text-base minlg:text-xl font-normal">{book.price} <span className="font-semibold">{currency}</span></p>
      </div>
    </div>
  );

const BookDetails = () => {
  const { currentAccount, currency, buyBook } = useContext(BookContext);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [book, setBook] = useState({ image: '', pdf: '', tokenId: '', name: '', owner: '', price: '', seller: '' });
  const [paymentModal, setPaymentModal] = useState(false);
  const [successModal,setSuccessModal] = useState(false);

  const checkout = async () => {
    await buyBook(book);
    setPaymentModal(false);
    setSuccessModal(true);
  }
  useEffect(() => {
    if (!router.isReady) return;
    console.log(router.query);
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
                <>
                  <Button
                    btnName="List on Marketplace"
                    btnType="primary"
                    classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                    handleClick={() => router.push(`/resell-book?id=${book.tokenId}&tokenURI=${book.tokenURI}`)}
                  />
                  <Button
                      btnName="Read Book"
                      btnType="primary"
                      classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                      handleClick={() => location.href = `${book.pdf}`}
                    />
                </>
              )
              : (
                <Button
                  btnName={`Buy for ${book.price} ${currency}`}
                  btnType="primary"
                  classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                  handleClick={() => { setPaymentModal(true); }}
                />
              )}
        </div>
      </div>
      {paymentModal && (
      <Modal
        header="Check Out"
        body={<PaymentBodyCmp book={book} bookCurrency={currency} />}
        footer={(
          <div className="flex flex-row sm:flex-col ">
            <Button
              btnName="Checkout"
              classStyles="mr-5 sm:mr-0 rounded-xl"
              handleClick={checkout}
            />
            <Button
              btnName="Cancel"
              classStyles="rounded-xl"
              handleClick={() => { setPaymentModal(false); }}
            />
          </div>
        )}
        handleClose={() => { setPaymentModal(false); }}
      />
      )}
      { successModal
      && (
      <Modal
        header="Payment Successful"
        body={(
          <div className="flexCenter flex-col text-center" onClick={() => setSuccessModal(false)}>
            <div className="relative w-52 h-52">
              <Image src={book.image || images[`book${book.i}`]} objectFit="cover" layout="fill" />
            </div>
            <p className="font-poppins dark:text-white text-book-black-1 text-sm minlg:text-xl font-normal mt-10"> You successfully purchased <span className="font-semibold">{book.name}</span> from <span className="font-semibold">{shortenAddress(book.seller)}</span>.</p>
          </div>
          )}
        footer={(
          <div className="flexCentre flex-col ">
            <Button
              btnName="Check it out"
              classStyles="sm:mb-5 sm:mr-0 rounded-xl"
              handleClick={() => { router.push('/my-books'); }}
            />
          </div>
        )}
        handleClose={() => { setSuccessModal(false); }}
      />
      )}
    </div>
  );
};

export default BookDetails;