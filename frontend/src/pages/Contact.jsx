import React, { useState } from "react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Message sent successfully!");
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* HEADER */}
      <section className="max-w-7xl mx-auto mt-6 rounded-xl bg-blue-900 py-10 text-center text-blue-200">
        <h1 className="text-2xl font-bold">CONTACT US</h1>
      </section>

      {/* INFO CARDS */}
      <section className="max-w-7xl mx-auto px-6 py-6 grid md:grid-cols-3 gap-6">

        <div className="bg-white shadow p-6 text-center rounded-lg">
          <div className="text-3xl mb-3">📍</div>
          <h3 className="text-xl font-bold text-blue-900">Office Address</h3>
          <p className="text-sm text-gray-600">
            Noran Girls Hostel, SKIT<br />
            Jagatpura, Jaipur<br />
            Rajasthan – 302017
          </p>
        </div>

        <div className="bg-white shadow p-6 text-center rounded-lg">
          <div className="text-3xl mb-3">✉️</div>
          <h3 className="text-xl font-bold text-blue-900">Email</h3>
          <p className="text-sm text-gray-600">
            khushbusuwalka2006@gmail.com<br />
            kanishkajoshi206@gmail.com
          </p>
        </div>

        <div className="bg-white shadow p-6 text-center rounded-lg">
          <div className="text-3xl mb-3">📞</div>
          <h3 className="text-xl font-bold text-blue-900">Contact</h3>
          <p className="text-sm text-gray-600">
            +91 9929823850<br />
            +91 7300427924
          </p>
        </div>

      </section>

      {/* MAP + FORM */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-stretch">

        {/* MAP */}
        <div className="relative min-h-[400px] rounded-lg overflow-hidden shadow md:h-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.5285360648286!2d75.8666069!3d26.8231367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db770070b115f%3A0x6f306afd08a3e737!2sSKIT%20Jaipur!5e0!3m2!1sen!2sin"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
          ></iframe>
        </div>

        {/* FORM */}
        <div className="bg-white shadow p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-6">Contact Form</h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" className="input" />

            <input name="email" value={form.email} onChange={handleChange} placeholder="Your Email" className="input" />

            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="input" />

            <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="input" />

            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" className="input" />

            <button className="bg-blue-900 text-white px-6 py-3 rounded-lg">
              Send Message
            </button>

          </form>
        </div>

      </section>

    </div>
  );
}

export default Contact;
