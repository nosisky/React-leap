import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Modal from "react-modal";
import { sortList, getArrow } from "../utils/helpers";
import {
  API_URL,
  ASCENDING,
  DESCENDING,
  PRICE,
  RANGE,
} from "../utils/constants";
import Vehiclecard from "../components/VehicleCard";

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
            <Fragment key={car.id}>
              <Vehiclecard toggleModal={toggleModal} car={car} />
            </Fragment>
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
            <p>
              Range:{" "}
              {`${activeCar?.range?.unit.toUpperCase()} ${
                activeCar?.range?.distance
              }`}
            </p>
            <p>Price: ${activeCar?.price}</p>

            <p>
              Available colors:{" "}
              {activeCar?.colors?.map((color, i) => (
                <span key={i}>{color}, &nbsp;</span>
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
