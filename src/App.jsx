import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Drawer from "./components/Drawer/Drawer";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AppContext from "./context";
import Orders from "./pages/Orders";

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [cartOpened, setCartOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cartResponse, favResponse, itemsResponse] = await Promise.all([
          axios.get("https://62faa12affd7197707f069e5.mockapi.io/cart"),
          axios.get("https://62faa12affd7197707f069e5.mockapi.io/Favorites"),
          axios.get("https://62faa12affd7197707f069e5.mockapi.io/Items"),
        ]);

        setIsLoading(false);

        setCartItems(cartResponse.data);
        setFavorites(favResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert("Ошибка при запросе данных");
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find(
        (item) => Number(item.parentId) === Number(obj.id)
      );
      if (findItem) {
        setCartItems((prev) =>
          prev.filter((item) => Number(item.parentId) !== Number(obj.id))
        );
        await axios.delete(
          `https://62faa12affd7197707f069e5.mockapi.io/cart/${findItem.id}`
        );
      } else {
        setCartItems((prev) => [...prev, obj]);
        const { data } = await axios.post(
          "https://62faa12affd7197707f069e5.mockapi.io/cart",
          obj
        );
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.parentId === data.parentId) {
              return {
                ...item,
                id: data.id,
              };
            }
            return item;
          })
        );
      }
    } catch (error) {
      alert("Не удалось добавить товар");
      console.log(error);
    }
  };

  const onAddToFav = async (obj) => {
    try {
      const findFav = favorites.find(
        (favObj) => Number(favObj.parentId) === Number(obj.id)
      );
      if (findFav) {
        setFavorites((prev) =>
          prev.filter((item) => Number(item.parentId) !== Number(obj.id))
        );
        axios.delete(
          `https://62faa12affd7197707f069e5.mockapi.io/Favorites/${findFav.id}`
        );
      } else {
        setFavorites((prev) => [...prev, obj]);
        const { data } = await axios.post(
          "https://62faa12affd7197707f069e5.mockapi.io/Favorites",
          obj
        );
        setFavorites((prev) => prev.map((item) => {
          if (item.parentId === data.parentId) {
            return {
              ...item,
              id: data.id
            }
          }
          return item
        }))
      }
    } catch (error) {
      alert("Не удалось добавить в избранные");
      console.log(error);
    }
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://62faa12affd7197707f069e5.mockapi.io/cart/${id}`);
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(id))
      );
    } catch (error) {
      alert("При удалении произошла ошибка");
      console.log(error);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };
  const isFavAdded = (id) => {
    return favorites.some((favObj) => Number(favObj.parentId) === Number(id));
  };
  cartOpened
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "auto");
  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFav,
        isFavAdded,
        onAddToCart,
        setCartOpened,
        setCartItems,
      }}
    >
      <div className="wrapper clear">
        <Drawer
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
          opened={cartOpened}
        />

        <Header onClickCart={() => setCartOpened(true)} />

        <Routes>
          <Route
            path=""
            exact
            element={
              <Home
                items={items}
                cartItems={cartItems}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFav={onAddToFav}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
              />
            }
          />
          <Route path="favorites" exact element={<Favorites />} />
          <Route path="orders" exact element={<Orders />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
