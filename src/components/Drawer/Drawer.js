import axios from "axios";
import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import Info from "../Info";
import styles from "./Drawer.module.css";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onClose, onRemove, items = [], opened }) {
  const { cartItems, setCartItems, totalPrice } = useCart();
  const [orderId, setOrderId] = useState(null);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "https://62faa12affd7197707f069e5.mockapi.io/orders",
        {
          items: cartItems,
        }
      );
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete(
          "https://62faa12affd7197707f069e5.mockapi.io/cart/" + item.id
        );
        await delay(1000);
      }
      setOrderId(data.id);
      setIsOrderComplete(true);
      setCartItems([]);
      // axios.delete(`https://62faa12affd7197707f069e5.mockapi.io/cart/${id}`);
    } catch (error) {
      alert("Не удалось оформить заказ");
      console.log(error);
    }
    setIsLoading(false);
  };
  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
      <div className={styles.drawer}>
        <h2 className="d-flex justify-between mb-30">
          Корзина
          <img
            onClick={onClose}
            className="remove-btn"
            src="img/btn-remove.svg"
            alt="close"
          />
        </h2>

        {items.length > 0 ? (
          <div className="d-flex flex-column flex">
            <div className="items flex">
              {items.map((obj) => (
                <div
                  key={obj.id}
                  className="cartItem d-flex align-center mb-20"
                >
                  <div
                    style={{ backgroundImage: `url(${obj.imageUrl})` }}
                    className="cartItemImg"
                  ></div>
                  <div className="mr-20 flex">
                    <p className="mb-5">{obj.title}</p>
                    <b>{obj.price} руб.</b>
                  </div>
                  <img
                    onClick={() => onRemove(obj.id)}
                    className="remove-btn"
                    src="img/btn-remove.svg"
                    alt="remove"
                  />
                </div>
              ))}
            </div>
            <div className="cartTotalBlock">
              <ul>
                <li>
                  <span>Стоимость:</span>
                  <div></div>
                  <b>{totalPrice} руб. </b>
                </li>
                <li>
                  <span>Доставка &#40;5%&#41;: </span>
                  <div></div>
                  <b>{Math.round((totalPrice / 100) * 5)} руб. </b>
                </li>
                <li>
                  <span>Итого: </span>
                  <div></div>
                  <b>{Math.round((totalPrice / 100) * 5) + totalPrice} руб. </b>
                </li>
              </ul>
              <button
                disabled={isLoading}
                onClick={onClickOrder}
                className="greenButton"
              >
                Оформить заказ <img src="img/arrow.svg" alt="arrow" />
              </button>
            </div>
          </div>
        ) : (
          <Info
            title={isOrderComplete ? "Заказ оформлен!" : "Корзина пустая"}
            description={
              isOrderComplete
                ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ"
            }
            image={
              isOrderComplete
                ? "img/complete-order.jpg"
                : "img/empty-cart.jpg"
            }
          />
        )}
      </div>
    </div>
  );
}

export default Drawer;
