import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-gray-400 py-10 px-6 md:px-24">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Left: Logo/Brand */}
        <div className="text-white text-2xl font-bold">♻️ ZeroWaste</div>

        {/* Center: Navigation Links */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-300 justify-center">
          <a href="/" className="hover:text-white transition">Home</a>
          <a href="/about" className="hover:text-white transition">About</a>
          <a href="/vendors" className="hover:text-white transition">Vendors</a>
          <a href="/contact" className="hover:text-white transition">Contact</a>
        </div>

        {/* Right: Social Icons */}
        <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs mt-8 text-gray-500">
        © {new Date().getFullYear()} ZeroWaste. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
