import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-dark text-white text-center py-3"
      style={{
        position: "fixed",
        bottom: "0",
        right: "0",
        left: "0",
        marginTop: "50px",
      }}
    >
      <div>&copy; {currentYear} ajogious. All rights reserved.</div>
    </footer>
  );
}

export default Footer;
