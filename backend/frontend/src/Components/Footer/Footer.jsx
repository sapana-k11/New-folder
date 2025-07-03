import { miscImages } from "../../assets/assets";

function Footer() {
  return (
    <footer className="bg-[#1f4959] text-white mt-auto px-10 py-5">
      <div className="flex justify-between items-center flex-col sm:flex-row">
        <div className="flex flex-col gap-5">
          <span>Our Socials</span>
          <div className="flex gap-5">
            <img src={miscImages.facebookIcon} alt="facebook" />
            <img src={miscImages.xIcon} className="w-13" alt="X" />
            <img
              src={miscImages.instagramIcon}
              className="w-13"
              alt="Instagram"
            />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <span>Get our App in Mobile</span>
          <div className="flex gap-5">
            <img src={miscImages.playstore} className="w-40" alt="Play Store" />
            <img src={miscImages.appStore} className="w-40" alt="App Store" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
