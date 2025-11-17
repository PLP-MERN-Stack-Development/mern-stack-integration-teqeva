const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-12 shadow-inner">
      <div className="container mx-auto text-center">
        <p className="text-sm mb-2">
          &copy; {new Date().getFullYear()} MERN Blog Application. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 text-xs">
          <a href="#" className="hover:text-indigo-400 transition">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-indigo-400 transition">Terms of Service</a>
        </div>
        <p className="text-xs mt-2 text-gray-500">
          Built with MongoDB, Express.js, React, and Node.js
        </p>
      </div>
    </footer>
  );
};

export default Footer;