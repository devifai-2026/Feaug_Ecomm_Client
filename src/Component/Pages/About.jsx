import React, { useEffect } from "react";
import topBanner from "../../assets/About/topBanner.png";
import bottomBanner from "../../assets/About/bottomBanner.jpg";
import { RxDividerVertical } from "react-icons/rx";
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div 
        className="mt-8 md:mt-16 space-y-8 md:space-y-16 text-center max-w-2xl mx-auto"
        data-aos="fade-up"
      >
        <h2 className="uppercase tracking-[0.3rem] text-center text-[#C19A6B] text-sm md:text-base">
          About Us
        </h2>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider leading-tight">
          Craftsmanship Meets Timeless Elegance
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          We are not just a jewelry brand; we are the storytellers of your most
          cherished moments, the keepers of your milestones, and the creators of
          enduring beauty. Welcome to Axels, where exquisite craftsmanship meets
          timeless elegance.
        </p>
      </div>

      {/* Top Banner Image */}
      <div 
        className="max-w-full mx-auto mt-8 md:mt-16"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <img 
          className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] object-cover" 
          src={topBanner} 
          alt="About us banner" 
        />
      </div>

      {/* Content */}
      <div className="max-w-full lg:max-w-[90%] mx-auto mt-8 md:mt-10">
        {/* Our Journey */}
        <div 
          className="flex flex-col lg:flex-row justify-between relative gap-8 lg:gap-0"
          data-aos="fade-up"
        >
          <div className="lg:flex-1 lg:sticky lg:top-20 self-start h-fit">
            <h2 className="text-2xl sm:text-3xl md:text-4xl">Our Journey</h2>
          </div>
          <div className="lg:flex-1 space-y-4 lg:pl-8">
            <p className="text-sm sm:text-base leading-relaxed">
              The journey of Axels is a tale of relentless passion and
              unwavering dedication. It began with a vision—a vision to redefine
              luxury, to make it more than just a material possession, but a
              tangible expression of the heart's deepest emotions.Founded by a
              team of artisans, designers, and dreamers, Axels came to life as a
              response to the impersonal nature of mass-produced jewelry. We
              recognized the need for jewelry that tells a story, jewelry that
              becomes a part of your life's narrative, jewelry that carries your
              memories and milestones.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              From our humble beginnings, we embarked on a path of discovery,
              craftsmanship, and creativity. Our ateliers became the canvas
              where ideas turned into reality, where raw materials transformed
              into treasures, and where every piece was imbued with a touch of
              artistry.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              As we grew, so did our commitment to the art of fine jewelry. Each
              creation that left our workshop was a testament to our dedication
              to excellence. We knew that our pieces were not mere adornments
              but symbols of love, commitment, and personal identity.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              Over the years, Axels has become a name synonymous with grace and
              sophistication. Our jewelry has graced the most intimate moments
              in people's lives—engagements, weddings, anniversaries, and more.
              We've celebrated with you as you marked achievements, milestones,
              and personal victories.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              Our journey has been a constant evolution, fueled by the stories
              you've shared with us. Your trust and loyalty have been our
              guiding stars, inspiring us to continually push the boundaries of
              creativity and craftsmanship.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              Today, as we look back on our journey, we remain humbled by the
              love and support we've received from our valued customers. But we
              also look forward with boundless enthusiasm, as we continue to
              explore new horizons and create jewelry that is not just beautiful
              but meaningful.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              As Axels continues to evolve, we invite you to be a part of our
              journey. Explore our collections, share in our passion for
              artistry, and let us be a part of your life's most beautiful
              moments. With Axels, your journey meets our craftsmanship, and
              together, we create stories that last a lifetime.Thank you for
              being a part of the Axels story—a story that weaves together love,
              art, and timeless elegance.
            </p>
          </div>
        </div>

        <div className="mt-8 md:mt-16 mb-8 md:mb-16">
          <hr />
        </div>

        {/* Craftsmanship */}
        <div 
          className="flex flex-col lg:flex-row justify-between relative gap-8 lg:gap-0"
          data-aos="fade-up"
        >
          <div className="lg:flex-1 lg:sticky lg:top-20 self-start h-fit">
            <h2 className="text-2xl sm:text-3xl md:text-4xl">Craftmanship</h2>
          </div>
          <div className="lg:flex-1 space-y-6 lg:pl-8">
            <p className="text-sm sm:text-base leading-relaxed">
              At Axels, craftsmanship is not just a skill; it's an art form. We
              believe that every piece of jewelry should be a masterpiece,
              meticulously crafted to stand the test of time and capture the
              essence of its wearer. Our commitment to excellence in
              craftsmanship is at the heart of everything we do.
            </p>
            <div>
              <h2 className="text-base sm:text-lg font-semibold">‍The Artisans:</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                Our artisans are the true guardians of our craft. With years of
                experience and a profound passion for their work, they bring
                each design to life with precision and artistry. From the moment
                a concept takes shape to the final finishing touches, our
                artisans pour their heart and soul into every piece. Their
                attention to detail ensures that every facet of a diamond
                sparkles brilliantly, and every curve of a metal setting is
                flawless.
              </p>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold">
                ‍Uncompromising Quality:
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                We source only the finest materials to create our jewelry. From
                the ethically-sourced diamonds and gemstones to the high-quality
                metals, we spare no effort in ensuring that each component meets
                the highest standards of quality. Our commitment to ethical
                sourcing and sustainability extends to every facet of our
                creations, so you can wear our jewelry with pride, knowing it
                aligns with your values.
              </p>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold">
                ‍Time-Honored Techniques:
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                While we embrace innovation and contemporary design, we also
                hold onto time-honored jewelry-making techniques. Our ateliers
                blend modern technology with traditional craftsmanship,
                resulting in pieces that marry the best of both worlds. It's
                this blend of old and new that gives our jewelry a timeless
                quality, making it relevant and cherished for generations.
              </p>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold">
                ‍Customization and Personalization:
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                We understand that jewelry is an intimate form of
                self-expression. That's why we offer customization and
                personalization options, allowing you to create a piece that is
                uniquely yours. Whether it's engraving a special date, selecting
                your preferred metal, or choosing a specific gemstone, our
                artisans are here to bring your vision to life.
              </p>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold">‍Quality Assurance:</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                Before each piece leaves our workshop, it undergoes rigorous
                quality control. We ensure that it not only meets our exacting
                standards but also exceeds your expectations. Our dedication to
                quality assurance means that when you wear Axels jewelry, you
                wear the mark of craftsmanship at its finest.At Axels, we
                believe that craftsmanship is not just a process; it's a labor
                of love. We are proud to share our artistry with you, to be a
                part of your life's most significant moments, and to create
                jewelry that embodies the spirit of elegance and enduring
                beauty. Explore our collections, and experience the
                craftsmanship that defines Axels.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-16 mb-8 md:mb-16">
          <hr />
        </div>

        {/* Bottom Banner */}
        <div data-aos="fade-up">
          <img
            className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] object-cover"
            src={bottomBanner}
            alt="Craftsmanship showcase"
          />
        </div>

        {/* Company Values */}
        <div 
          className="flex flex-col lg:flex-row justify-between relative mt-8 md:mt-16 gap-8 lg:gap-0"
          data-aos="fade-up"
        >
          <div className="lg:flex-1 lg:sticky lg:top-20 self-start h-fit">
            <h2 className="text-2xl sm:text-3xl md:text-4xl">Company Values</h2>
          </div>
          <div className="lg:flex-1 space-y-6 lg:pl-8">
            {[
              {
                title: "Excellence",
                content: "Our artisans are the true guardians of our craft. With years of experience and a profound passion for their work, they bring each design to life with precision and artistry. From the moment a concept takes shape to the final finishing touches, our artisans pour their heart and soul into every piece."
              },
              {
                title: "Integrity",
                content: "Integrity is the cornerstone of our business. We operate with transparency, honesty, and fairness in all our interactions—with our customers, partners, and within our team. Trust is the bedrock of our relationships."
              },
              {
                title: "Artistry",
                content: "We celebrate the artistry of fine jewelry. Our creations are not just accessories; they are works of art that embody creativity and passion. We believe that every piece should tell a unique story."
              },
              {
                title: "Customer-Centric",
                content: "Our customers are at the heart of everything we do. We listen to your needs, understand your desires, and strive to exceed your expectations. Your satisfaction is our ultimate goal."
              },
              {
                title: "Ethical Sourcing",
                content: "We are committed to responsible and ethical sourcing of materials. Our dedication to sustainability and ethical practices ensures that our jewelry not only reflects beauty but also respect for our planet and its people."
              },
              {
                title: "Personalization",
                content: "We understand that jewelry is deeply personal. We embrace customization and personalization, allowing you to create pieces that reflect your individuality and commemorate your most cherished moments."
              }
            ].map((value, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="flex items-center">
                  <RxDividerVertical className="text-xl sm:text-2xl text-[#C19A6B] font-bold" />
                  <h2 className="text-base sm:text-lg font-semibold">{value.title}</h2>
                </div>
                <p className="pl-4 sm:pl-6 text-sm sm:text-base leading-relaxed mt-2">
                  {value.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 md:mt-16 mb-8 md:mb-16">
          <hr />
        </div>

        {/* CTA Section */}
        <div 
          className="flex flex-col justify-center space-y-4 md:space-y-5 mx-auto text-center"
          data-aos="zoom-in"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            Let's Work with Us!
          </h2>
          <button className="relative uppercase border border-black px-4 sm:px-5 py-3 sm:py-4 w-full sm:w-[80%] md:w-[60%] lg:w-[20%] mx-auto font-semibold overflow-hidden group text-sm sm:text-base">
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
              Work with Us
            </span>
            <span className="absolute inset-0 bg-[#C19A6B] transform origin-bottom scale-y-0 transition-transform duration-300 group-hover:scale-y-100"></span>
          </button>
        </div>

        <div className="mt-8 md:mt-16 mb-8 md:mb-16">
          <hr />
        </div>
      </div>
    </div>
  );
};

export default About;