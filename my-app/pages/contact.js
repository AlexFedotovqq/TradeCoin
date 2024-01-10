import "./_app.js";
import { useEffect } from "react";
import ContactForm from "./ContactForm";

function Contact() {
  useEffect(() => {
    if (document) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href =
        "https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css";

      document.head.appendChild(stylesheet);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="py-6">
          <ContactForm />
        </div>
      </header>
    </div>
  );
}

export default Contact;
