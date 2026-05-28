import "./Stars.css";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function StarRating({ value, onChange }: Props) {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (star: number, half: boolean) => {
    const newValue = half ? star - 0.5 : star;
    onChange(newValue);
  };

  return (
    <div className="stars-container">
      {stars.map((star) => (
        <div key={star} className="star-wrapper">
          <span
            className={`star ${value >= star - 0.5 ? "filled" : ""}`}
            onClick={() => handleClick(star, true)}
          >
            ★
          </span>
          <span
            className={`star ${value >= star ? "filled" : ""}`}
            onClick={() => handleClick(star, false)}
          >
            ★
          </span>
        </div>
      ))}
    </div>
  );
}
