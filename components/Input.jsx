import React from "react";
import { useContext } from "react";
import { BookContext } from "../context/BookContext";

const Input = ({ inputType, title, placeholder, handleClick }) => {
  const { currency } = useContext(BookContext);

  return (
    <div className="mt-10 w-full">
      <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-xl">
        {title}
      </p>
      {inputType === "number" ? (
        <div className="dark:bg-book-black-1 bg-white border dark:border-book-black-1 border-book-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-book-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
          <input
            type="number"
            className="flex w-full dark:bg-book-black-1 bg-white outline-none"
            placeholder={placeholder}
            onChange={handleClick}
          />
          <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-xl">
            {currency}
          </p>
        </div>
      ) : inputType === "textarea" ? (
        <textarea
          rows={10}
          className="dark:bg-book-black-1 bg-white border dark:border-book-black-1 border-book-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-book-gray-2 text-base mt-4 px-4 py-3"
          placeholder={placeholder}
          onChange={handleClick}
        />
      ) : (
        <input
          className="dark:bg-book-black-1 bg-white border dark:border-book-black-1 border-book-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-book-gray-2 text-base mt-4 px-4 py-3"
          placeholder={placeholder}
          onChange={handleClick}
        />
      )}
    </div>
  );
};

export default Input;
