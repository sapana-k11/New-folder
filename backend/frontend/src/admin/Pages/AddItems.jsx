import { useState } from "react";
import Select from "react-select";
import { miscImages } from "../../assets/assets";
import axios from "axios";

function AddItems() {
  const url = "http://localhost:4000";
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    artist: "",
    price: "",
    releaseYear: "",
    duration: "",
    description: "",
    image: null,
  });

  const options = [
    { value: "hiphop", label: "Hiphop" },
    { value: "pop", label: "Pop" },
    { value: "electronic", label: "Electronic" },
    { value: "rock", label: "Rock" },
    { value: "metal", label: "Metal" },
    { value: "indie", label: "Indie" },
    { value: "classic", label: "Classic" },
    {value:"punk",label:"Punk"},
    {value:'songwriter',label:'Songwriter'}
  ];

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({
        ...data,
        image: file,
      });
      setImage(file); // Update image state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract the values of the selected genres
    const selectedGenres = selectedOptions.map((option) => option.value);

    const Data = {
      name: data.name,
      artist: data.artist,
      price: data.price,
      releaseYear: String(data.releaseYear),
      duration: data.duration,
      description: data.description,
      image: data.image,
      genres: selectedGenres, // Store the selected genre values
    };

    console.log(Data); // Log the entire data object including genres

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("artist", data.artist);
    formData.append("price", data.price);
    formData.append("releaseYear", data.releaseYear);
    formData.append("duration", data.duration);
    formData.append("description", data.description);
    formData.append("image", data.image);
    formData.append("genres", JSON.stringify(selectedGenres));

    try {
      const response = await axios.post(`${url}/api/products/add`, formData);
      if (response.data.message) {
        setData({
          name: "",
          artist: "",
          price: "",
          releaseYear: "",
          duration: "",
          description: "",
          image: null,
        });
        setImage(false);
        setSelectedOptions([]);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-transparent shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="mt-1 p-2 w-full border border-white bg-white rounded text-black placeholder-gray-400"
          />
        </div>

        {/* Artist */}
        <div>
          <label htmlFor="artist" className="block text-sm font-medium">
            Artist
          </label>
          <input
            type="text"
            name="artist"
            id="artist"
            value={data.artist}
            onChange={handleChange}
            placeholder="Enter artist name"
            className="mt-1 p-2 w-full border border-white bg-white rounded text-black placeholder-gray-400"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Price (Rs)
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={data.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="mt-1 p-2 w-full border border-white bg-white rounded text-black placeholder-gray-400"
          />
        </div>

        {/* Upload Image */}
        <div>
          <p className="text-sm font-medium">Upload Image</p>
          <label htmlFor="image" className="cursor-pointer">
            <img
              src={
                image ? URL.createObjectURL(data.image) : miscImages.uploadImage
              }
              alt="Upload area"
              className="w-32 h-32 object-cover border rounded"
            />
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Genre Multi-Select */}
        <div>
          <Select
            options={options}
            isMulti
            value={selectedOptions}
            onChange={setSelectedOptions}
            className="basic-multi-select text-black"
            classNamePrefix="select"
            placeholder="Select genres..."
          />
        </div>

        {/* Release Year */}
        <div>
          <label htmlFor="releaseYear" className="block text-sm font-medium">
            Release Year
          </label>
          <input
            type="number"
            name="releaseYear"
            id="releaseYear"
            min="1900"
            max="2099"
            value={data.releaseYear}
            onChange={handleChange}
            placeholder="Enter release year"
            className="mt-1 p-2 w-full border border-white bg-white rounded text-black placeholder-gray-400"
          />
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium">
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            id="duration"
            min="1"
            value={data.duration}
            onChange={handleChange}
            placeholder="Enter duration"
            className="mt-1 p-2 w-full border border-white bg-white rounded text-black placeholder-gray-400"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            maxLength={200}
            value={data.description}
            onChange={handleChange}
            placeholder="Enter description (max 200 words)"
            className="mt-1 p-2 w-full border border-white bg-white rounded text-black placeholder-gray-400 h-24 resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddItems;
