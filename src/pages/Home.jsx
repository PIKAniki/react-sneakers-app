import { useContext } from "react";
import Card from "../components/Card/Card";
import AppContext from "../context";
import SimpleImageSlider from "react-simple-image-slider";

const images = [{ url: "img/slider1.jpg" }, { url: "img/slider1.jpg" }];

function Home({
  items,
  searchValue,
  setSearchValue,
  onChangeSearchInput,
  onAddToCart,
  onAddToFav,
  isLoading,
}) {
  const renderItems = () => {
    const filteredItems = items.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    return (isLoading ? [...Array(8)] : filteredItems).map((item, index) => (
      <Card
        key={index}
        onFavorite={(obj) => onAddToFav(obj)}
        onPlus={(obj) => onAddToCart(obj)}
        loading={isLoading}
        {...item}
      />
    ));
  };
  return (
    <>
      <div className="carousel mt-30 ml-40 d-flex align-center text-center">
        <a href="#">
          <SimpleImageSlider
            width={1000}
            height={300}
            images={images}
            showNavs={true}
            showBullets={false}
          />
        </a>
      </div>
      <div className="content p-40">
        <div className="d-flex align-center justify-between mb-40">
          <h1>
            {searchValue
              ? `Поиск по запросу: "${searchValue}"`
              : "Все кроссовки"}
          </h1>
          <div className="search-block d-flex">
            <img src="img/search.svg" alt="search"></img>
            {searchValue && (
              <img
                onClick={() => setSearchValue("")}
                src="img/btn-remove.svg"
                alt="remove"
                className="clear cu-p"
              />
            )}
            <input
              onChange={onChangeSearchInput}
              value={searchValue}
              placeholder="Поиск..."
            />
          </div>
        </div>

        <div className="sneakers d-flex flex-wrap">{renderItems()}</div>
      </div>
    </>
  );
}

export default Home;
