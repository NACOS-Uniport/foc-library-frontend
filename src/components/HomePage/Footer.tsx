const Footer = () => {
  return (
    <footer className="bg-green-700 py-4 text-center mt-5">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-white">
          © {new Date().getFullYear()} E-Library. All rights reserved.
        </p>
        <p className="text-white">Contact Support: focuniport@gmail.com</p>
      </div>
    </footer>
  );
};

export default Footer;
