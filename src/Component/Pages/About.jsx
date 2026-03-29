import React from "react";
import { useNavigate } from "react-router-dom";
import topBanner from "../../assets/About/topBanner.png";
import bottomBanner from "../../assets/About/bottomBanner.jpg";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      title: "Excellence",
      content:
        "Our artisans are the true guardians of our craft. With years of experience and a profound passion for their work, they bring each design to life with precision and artistry.",
    },
    {
      title: "Integrity",
      content:
        "Integrity is the cornerstone of our business. We operate with transparency, honesty, and fairness in all our interactions—with our customers, partners, and within our team.",
    },
    {
      title: "Artistry",
      content:
        "We celebrate the artistry of fine jewelry. Our creations are not just accessories; they are works of art that embody creativity and passion.",
    },
    {
      title: "Customer-Centric",
      content:
        "Our customers are at the heart of everything we do. We listen to your needs, understand your desires, and strive to exceed your expectations.",
    },
    {
      title: "Ethical Sourcing",
      content:
        "We are committed to responsible and ethical sourcing of materials. Our dedication to sustainability and ethical practices ensures that our jewelry reflects beauty and respect.",
    },
    {
      title: "Personalization",
      content:
        "We embrace customization and personalization, allowing you to create pieces that reflect your individuality and commemorate your most cherished moments.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="uppercase tracking-[0.35rem] text-[#C19A6B] text-xs font-light mb-6">
            About Us
          </p>
          <div className="w-12 h-[1px] bg-[#C19A6B] mx-auto mb-10"></div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide leading-tight text-gray-900">
            Craftsmanship Meets
            <br />
            Timeless Elegance
          </h1>
          <p className="mt-8 text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-light">
            We are not just a jewelry brand; we are the storytellers of your most
            cherished moments, the keepers of your milestones, and the creators
            of enduring beauty.
          </p>
        </div>
      </section>

      {/* Top Banner - Full Bleed */}
      <section className="relative w-full">
        <img
          className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] object-cover"
          src={topBanner}
          alt="About us banner"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </section>

      {/* Our Story - 2 Column Layout */}
      <section className="py-20 md:py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left - Text */}
          <div className="lg:w-3/5 space-y-6">
            <p className="uppercase tracking-[0.35rem] text-[#C19A6B] text-xs font-light">
              Our Journey
            </p>
            <div className="w-12 h-[1px] bg-[#C19A6B] mb-4"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-gray-900">
              A Legacy of Passion
            </h2>
            <div className="space-y-5 text-gray-500 text-sm sm:text-base leading-relaxed font-light">
              <p>
                The journey of Axels is a tale of relentless passion and
                unwavering dedication. It began with a vision—a vision to
                redefine luxury, to make it more than just a material possession,
                but a tangible expression of the heart's deepest emotions.
              </p>
              <p>
                Founded by a team of artisans, designers, and dreamers, Axels
                came to life as a response to the impersonal nature of
                mass-produced jewelry. We recognized the need for jewelry that
                tells a story, jewelry that becomes a part of your life's
                narrative.
              </p>
              <p>
                From our humble beginnings, we embarked on a path of discovery,
                craftsmanship, and creativity. Our ateliers became the canvas
                where ideas turned into reality, where raw materials transformed
                into treasures, and where every piece was imbued with a touch of
                artistry.
              </p>
              <p>
                Over the years, Axels has become a name synonymous with grace and
                sophistication. Our jewelry has graced the most intimate moments
                in people's lives—engagements, weddings, anniversaries, and more.
              </p>
              <p>
                Today, as we look back on our journey, we remain humbled by the
                love and support we've received. We continue to explore new
                horizons and create jewelry that is not just beautiful but
                meaningful.
              </p>
            </div>
          </div>

          {/* Right - Decorative */}
          <div className="lg:w-2/5 flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              <div className="w-full aspect-[3/4] bg-stone-100 border border-stone-200"></div>
              <div className="absolute -top-4 -left-4 w-full aspect-[3/4] border border-[#C19A6B]/40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8">
                  <p className="text-6xl md:text-7xl font-light text-[#C19A6B]/30">
                    Est.
                  </p>
                  <p className="text-5xl md:text-6xl font-light text-[#C19A6B]/50 mt-1">
                    2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="bg-stone-50 py-20 md:py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[0.35rem] text-[#C19A6B] text-xs font-light mb-6">
              Our Craft
            </p>
            <div className="w-12 h-[1px] bg-[#C19A6B] mx-auto mb-10"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-gray-900">
              The Art of Fine Jewelry
            </h2>
            <p className="mt-6 text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
              At Axels, craftsmanship is not just a skill; it's an art form. We
              believe that every piece of jewelry should be a masterpiece,
              meticulously crafted to stand the test of time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {[
              {
                title: "The Artisans",
                text: "Our artisans are the true guardians of our craft. With years of experience and a profound passion for their work, they bring each design to life with precision and artistry. Their attention to detail ensures that every facet sparkles brilliantly.",
              },
              {
                title: "Uncompromising Quality",
                text: "We source only the finest materials. From ethically-sourced diamonds and gemstones to high-quality metals, we spare no effort in ensuring that each component meets the highest standards of quality.",
              },
              {
                title: "Time-Honored Techniques",
                text: "While we embrace innovation and contemporary design, we also hold onto time-honored jewelry-making techniques. This blend of old and new gives our jewelry a timeless quality, cherished for generations.",
              },
              {
                title: "Customization",
                text: "We offer customization and personalization options, allowing you to create a piece that is uniquely yours. Whether it's engraving a special date or choosing a specific gemstone, our artisans bring your vision to life.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group p-8 bg-white border border-stone-200 hover:border-[#C19A6B]/40 transition-colors duration-500"
              >
                <div className="w-8 h-[1px] bg-[#C19A6B] mb-6 group-hover:w-12 transition-all duration-500"></div>
                <h3 className="text-lg font-light tracking-wide text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Banner - Full Bleed with Overlay */}
      <section className="relative w-full">
        <img
          className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] object-cover"
          src={bottomBanner}
          alt="Craftsmanship showcase"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-center px-6">
            <p className="text-white/80 uppercase tracking-[0.4rem] text-xs font-light mb-4">
              Quality Assurance
            </p>
            <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-light tracking-wide">
              Crafted to Perfection
            </h3>
          </div>
        </div>
      </section>

      {/* Values Section - Grid */}
      <section className="py-20 md:py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[0.35rem] text-[#C19A6B] text-xs font-light mb-6">
              What We Stand For
            </p>
            <div className="w-12 h-[1px] bg-[#C19A6B] mx-auto mb-10"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-gray-900">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {values.map((value, index) => (
              <div
                key={index}
                className="group text-center px-6 py-10 border border-transparent hover:border-stone-200 transition-all duration-500"
              >
                <div className="w-10 h-10 mx-auto mb-6 border border-[#C19A6B]/40 rounded-full flex items-center justify-center">
                  <span className="text-[#C19A6B] text-sm font-light">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-base font-light tracking-wider uppercase text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">
                  {value.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-6 sm:px-8 lg:px-12 bg-stone-50">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-[1px] bg-[#C19A6B] mx-auto mb-10"></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-gray-900">
            Let's Create Together
          </h2>
          <p className="mt-6 text-gray-500 text-sm sm:text-base font-light leading-relaxed">
            Ready to bring your vision to life? We'd love to hear from you.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="mt-10 uppercase tracking-[0.2rem] text-xs font-light px-12 py-4 bg-[#C19A6B] text-white hover:bg-[#a8845a] transition-colors duration-500"
          >
            Get in Touch
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
