import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { sortList, getArrow } from "./utils";
import { API_URL, ASCENDING, DESCENDING, PRICE, RANGE } from "./constants";

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
  const [priceOrder, setPriceOrder] = useState(ASCENDING);
  const [rangeOrder, setRangeOrder] = useState(ASCENDING);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [activeCar, setActiveCar] = React.useState({});

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(API_URL);
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

  const handlePriceSort = (order) => {
    const newOrder = order === ASCENDING ? DESCENDING : ASCENDING;
    const result = sortList(newOrder, carList, PRICE);
    storeCars(result);
    setPriceOrder(newOrder);
  };

  const handleRangeSort = (order) => {
    const newOrder = order === ASCENDING ? DESCENDING : ASCENDING;
    const result = sortList(newOrder, carList, RANGE);
    storeCars(result);
    setRangeOrder(newOrder);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Auction Leap</title>
        <meta name="description" content="Top vehicle auction service" />
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
