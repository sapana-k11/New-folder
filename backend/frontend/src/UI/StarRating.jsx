import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const StarRating = ({ maxStars = 5, onChange }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    setRating(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="flex space-x-1">
      {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={faStar}
          className={`w-6 h-6 cursor-pointer transition ${
            (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
          }`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => handleClick(star)}
        />
      ))}
    </div>
  );
};

// Correct PropTypes
StarRating.propTypes = {
  maxStars: PropTypes.number, // Should be number, not string
  onChange: PropTypes.func,
};

export default StarRating;
