// a top seller is a person whith a high sum of all Book they've listed
export const getCreators = (books) => {
    const creators = books.reduce((creatorObject, book) => {
      (creatorObject[book.seller] = creatorObject[book.seller] || []).push(book);
  
      return creatorObject;
    }, {});
  
    return Object.entries(creators).map((creator) => {
      const seller = creator[0];
      const sum = creator[1].map((item) => Number(item.price)).reduce((prev, curr) => prev + curr, 0);
  
      return ({ seller, sum });
    });
  };
  
  
  