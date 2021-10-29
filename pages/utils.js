export const getPrice = (price) => {
  const newPrice = price.split(" ")[0];

  return parseInt(newPrice, 10);
};

export const sortList = (order = "ASC", lists, field) => {
  switch (field) {
    case "range":
      return lists.sort((a, b) =>
        order === "ASC"
          ? a.range.distance - b.range.distance
          : b.range.distance - a.range.distance
      );
    case "price":
      return lists.sort((a, b) =>
        order === "ASC"
          ? getPrice(a.price) - getPrice(b.price)
          : getPrice(b.price) - getPrice(a.price)
      );
  }
};

export const getArrow = (order) => {
  return order === "ASC" ? "↑" : "↓";
};
