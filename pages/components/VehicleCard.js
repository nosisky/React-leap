import styles from "../../styles/Home.module.css";

const Vehiclecard = ({ car, toggleModal }) => {
  return (
    <>
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
    </>
  );
};

export default Vehiclecard;
