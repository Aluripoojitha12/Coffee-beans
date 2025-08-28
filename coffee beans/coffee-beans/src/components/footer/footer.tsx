import React from "react";
import footerBg from "../../assets/footer1.jpg";

const Footer: React.FC = () => {
  return (
    <section
      className="footer-section"
      style={
        {
          "--footer-bg": `url(${footerBg})`,
        } as React.CSSProperties
      }
    >
      <div className="footer-inner">
        <div className="footer-card">
          <h2 className="footer-title">The Flavor Of Coffee</h2>
          <p className="footer-subtitle">That Brings Life To Your Body</p>

          <div className="footer-grid">
            <div>
              <h3 className="footer-heading">Contacts</h3>
              <p>123 Coffee Street, Chicago</p>
              <p>+1 212 456 7890</p>
              <p>shop@coffeebeans.com</p>
            </div>

            <div>
              <h3 className="footer-heading">Information</h3>
              <ul>
                <li>About Us</li>
                <li>Shop</li>
                <li>Our Process</li>
                <li>Gift Packs</li>
              </ul>
            </div>

            <div>
              <h3 className="footer-heading">Support</h3>
              <ul>
                <li>FAQ</li>
                <li>Shipping</li>
                <li>Returns</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Coffee Beans. All Rights Reserved.</p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
