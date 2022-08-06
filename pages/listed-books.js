import { useState, useEffect, useContext } from 'react';
import { BookCard, Loader } from '../components';
import { BookContext } from '../context/BookContext';

const ListedBooks = () => {
  const { fetchMyBooksOrListedBooks } = useContext(BookContext);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyBooksOrListedBooks('fetchItemsListed')
      .then((items) => {
        setBooks(items);
        setIsLoading(false);
        console.log(items);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }
  if (!isLoading && books.length === 0) {
    return (
      <div className="flexCenter sm:p-4 p-16 min-h-screen">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold">No Books Listed for Sale.</h1>
      </div>
    );
  }
  return (
    <div className="flex justify-center sm:px-4 p-12 min-h-screen">
      <div className="w-full minmd:w-4/5">
        <div className="mt-4">
          <h2 className="font-poppins dark:text-white text-nft-black-1 text-2xl font-semibold mt-2 ml-4 sm:ml-2">Books listed for sale</h2>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {
              books.map((book) => <BookCard key={book.tokenId} book={book} />)
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListedBooks;