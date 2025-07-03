import PropTypes from "prop-types";
function Card({
  _id,
  name,
  artist,
  image,
  price,
  description,
  genre,
  releaseYear,
  duration,
  rating,
  numberOfRatings,
}) {
  return (
    <div
      className="hover:shadow-2xl bg-[#ffffff] rounded-2xl cursor-pointer flex flex-col gap-1.5 w-80 px-4 py-1 items-center border-2 border-gray-200 transition-transform duration-200 ease-in-out hover:scale-105"
      key={_id}
    >
      <img src={image} alt={name} className="size-50 object-cover" />
      <h2 className="text-3xl text-gray-800 text-center">{name}</h2>
      <h3 className="text-xl text-gray-500">{artist}</h3>
      <p className="w-2xs">{description}</p>
      <p>Genre: {genre[0] + ", " + genre[1]}</p>
      <p>Release Date: {releaseYear}</p>
      <p className="">Duration: {duration} mins</p>
      <p>
        Rating: ⭐{rating} ({numberOfRatings} reviews)
      </p>
      <p>Price: Rs {price}</p>
    </div>
  );
}

Card.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string,
  genre: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of strings
  releaseYear: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  numberOfRatings: PropTypes.number.isRequired,
};

export default Card;
