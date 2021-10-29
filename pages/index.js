import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
Modal.setAppElement("#__next");

const Home = () => {
  const [carList, storeCars] = useState([]);
  const [priceOrder, setPriceOrder] = useState("ASC");
  const [rangeOrder, setRangeOrder] = useState("ASC");
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [activeCar, setActiveCar] = React.useState({});

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        "https://6157228e8f7ea600179850e4.mockapi.io/api/vehicles"
      );
      storeCars(data);
    })();
  }, []);

  const toggleModal = (carId) => {
    const carDetails = carList.find((car) => car.id === carId);
    console.log(carDetails);
    setActiveCar(carDetails);
    if (modalIsOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const getPrice = (price) => {
    const newPrice = price.split(" ")[0];

    return parseInt(newPrice, 10);
  };
  const sortList = (order = "ASC", lists, field) => {
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

  const handlePriceSort = (order) => {
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    const result = sortList(newOrder, carList, "price");
    storeCars(result);
    setPriceOrder(newOrder);
  };

  const handleRangeSort = (order) => {
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    const result = sortList(newOrder, carList, "range");
    storeCars(result);
    setRangeOrder(newOrder);
  };

  const getArrow = (order) => {
    return order === "ASC" ? "↑" : "↓";
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Auction Leap</title>
        <meta name="description" content="Top vehicle auctions ervice" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p>
          Sort:{" "}
          <button onClick={() => handlePriceSort(priceOrder)}>
            Price {getArrow(priceOrder)}
          </button>{" "}
          <button onClick={() => handleRangeSort(rangeOrder)}>
            Range {getArrow(rangeOrder)}
          </button>
        </p>
        <div className={styles.grid}>
          {carList.map((car) => (
            <div
              key={car.id}
              onClick={() => toggleModal(car.id)}
              className={styles.card}
            >
              <img
                className={styles.photo}
                src={car.photo}
                alt={`${car.make} ${car.model}`}
              />
              <p>Make: {car.make}</p>
              <p>Model: {car.model}</p>
              <p>Price: ${car.price}</p>
            </div>
          ))}
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={toggleModal}
          style={customStyles}
          contentLabel="Car details"
        >
          <button onClick={toggleModal}>close</button>
          <div className={styles.card}>
            {console.log(activeCar)}
            <p>
              Range:{" "}
              {`${activeCar?.range?.unit.toUpperCase()} ${
                activeCar?.range?.distance
              }`}
            </p>
            <p>Price: ${activeCar?.price}</p>

            <p>
              Available colors:{" "}
              {activeCar?.colors?.map((color) => (
                <span>{color}, &nbsp;</span>
              ))}
            </p>
          </div>
        </Modal>
      </main>

      <footer className={styles.footer}>
        <span>
          Made by <span className={styles.logo}>Dealwap</span>
        </span>
      </footer>
    </div>
  );
};

export default Home;
