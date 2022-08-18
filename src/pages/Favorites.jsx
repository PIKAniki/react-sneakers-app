import { useContext } from "react";
import AppContext  from "../context";
import Card from "../components/Card/Card";

function Favorites() {

  const {favorites, onAddToFav, onAddToCart} = useContext(AppContext);
  
  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои закладки</h1>
      </div>

      <div className="sneakers d-flex flex-wrap">
        {favorites.map((item, index) => (
          <Card
            key={index}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
