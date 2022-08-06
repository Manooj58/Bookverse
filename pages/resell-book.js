import { useState, useEffect, useContext } from 'react';
import Image from 'next/dist/client/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import { BookContext } from '../context/BookContext';
import { Input, Loader, Banner, Button } from '../components';

const ResellBook = () => {
  const { createSale } = useContext(BookContext);
  const router = useRouter();
  const { id, tokenURI } = router.query;
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchBook = async () => {
    const { data } = await axios.get(tokenURI);
    setPrice(data.price);
    setImage(data.image);
    console.log(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (tokenURI) fetchBook();
  }, [tokenURI]);

  const resell = async () => {
    await createSale(tokenURI, price, true, id);
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl">Resell Book</h1>

        <Input
          inputType="number"
          title="Price"
          placeholder="Asset Price"
          handleClick={(e) => setPrice(e.target.value)}
        />

        {image && <img className="rounded mt-4" width="350" src={image} />}

        <div className="mt-7 w-full flex justify-end">
          <Button
            btnName="List Book"
            btnType="primary"
            classStyles="rounded-xl"
            handleClick={resell}
          />
        </div>
      </div>
    </div>
  );
};

export default ResellBook;