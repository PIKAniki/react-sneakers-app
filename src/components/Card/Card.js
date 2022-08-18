import { useContext, useState } from "react";
import ContentLoader from "react-content-loader";
import AppContext from "../../context";
import styles from "./Card.module.css";

function Card({
  id,
  title,
  imageUrl,
  price,
  onFavorite,
  onPlus,
  loading = false,
}) {
  const { isItemAdded } = useContext(AppContext);
  const { isFavAdded } = useContext(AppContext);
  const itemObj = { id, title, imageUrl, price, parentId: id };

  const handleClick = () => {
    onPlus(itemObj);
  };

  const favClick = () => {
    onFavorite(itemObj);
  };

  return (
    <div className={styles.card}>
      {loading ? (
        <ContentLoader
          speed={2}
          width={150}
          height={187}
          viewBox="0 0 150 187"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="10" ry="10" width="150" height="90" />
          <rect x="0" y="106" rx="3" ry="3" width="150" height="15" />
          <rect x="0" y="125" rx="5" ry="5" width="93" height="15" />
          <rect x="0" y="162" rx="8" ry="8" width="80" height="24" />
          <rect x="118" y="154" rx="8" ry="8" width="32" height="32" />
        </ContentLoader>
      ) : (
        <>
          {onFavorite && (
            <div className={styles.favorite} onClick={favClick}>
              <img
                src={
                  isFavAdded(id)
                    ? "img/heart-liked.svg"
                    : "img/heart-unliked.svg"
                }
                alt="heart"
              ></img>
            </div>
          )}
          <img width={133} height={112} src={imageUrl} alt="Sneaker"></img>
          <h5>{title}</h5>
          <div className="d-flex justify-between align-center">
            <div className="d-flex flex-column">
              <span>Цена:</span>
              <b>{price} руб.</b>
            </div>
            {onPlus && (
              <img
                className={styles.plus}
                onClick={handleClick}
                src={
                  isItemAdded(id) ? "img/btn-checked.svg" : "img/btn-plus.svg"
                }
                alt="Plus"
              ></img>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Card;
