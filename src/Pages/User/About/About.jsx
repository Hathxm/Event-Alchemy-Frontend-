import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
    return (
        <div className="w-full">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-muted  py-1 text-sm font-bold">About Us</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Elevating Your Events with Expertise</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    At Event Experts, we are dedicated to transforming your events into unforgettable experiences. With
                    years of industry expertise and a passion for excellence, we provide comprehensive event planning and
                    venue management services to ensure your vision comes to life.
                  </p>
                </div>
                <img
                  src="https://event-alchemy.s3.eu-north-1.amazonaws.com/Static_Medias/aboutevents.avif"
                  width="550"
                  height="310"
                  alt="Event Planning"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                />
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                <img
                  src="https://event-alchemy.s3.eu-north-1.amazonaws.com/Static_Medias/aboutvenue.png"
                  width="550"
                  height="310"
                  alt="Venue Selection"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                />
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-muted  py-1 text-sm font-bold">Venue Selection</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Discover the Perfect Venue for Your Event
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our platform offers a diverse range of venues, from elegant ballrooms to modern event spaces, to
                    accommodate events of all sizes and styles. Our experienced team will work with you to understand your
                    unique requirements and help you find the perfect venue that aligns with your vision and budget.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-muted py-1 text-sm font-bold">Event Services</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Elevate Your Event with Our Curated Services
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our platform connects you with a wide range of high-quality vendors and service providers, including
                    catering, entertainment, decor, and more. Our team carefully vets each vendor to ensure they meet our
                    standards of excellence, so you can trust that your event will be executed flawlessly.
                  </p>
                </div>
                <img
                  src="https://event-alchemy.s3.eu-north-1.amazonaws.com/Static_Medias/aboutservices.jpg"
                  width="550"
                  height="310"
                  alt="Event Services"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                />
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                <img
                  src="https://event-alchemy.s3.eu-north-1.amazonaws.com/Static_Medias/abouttime.webp"
                  width="550"
                  height="310"
                  alt="Event Planning Process"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                />
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-muted  py-1 text-sm font-bold">Event Planning Process</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Seamless Event Planning from Start to Finish
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our event planning process is designed to ensure a stress-free experience for our clients. From initial
                    consultation to the day of your event, our dedicated team will guide you through every step, providing
                    personalized recommendations, coordinating with vendors, and ensuring your vision is brought to life
                    with precision and attention to detail.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-muted  py-1 text-sm font-bold">Why Choose Us</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Experience the Difference with Event Experts
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    At Event Experts, we are committed to delivering exceptional experiences for our clients. Our team of
                    seasoned event professionals, curated vendor network, and attention to detail set us apart, ensuring
                    your event is executed flawlessly and exceeds your expectations. Trust us to make your event planning
                    journey seamless and memorable.
                  </p>
                </div>
                <img
                  src="https://event-alchemy.s3.eu-north-1.amazonaws.com/Static_Medias/aboutexperts.jpg"
                  width="550"
                  height="310"
                  alt="Why Choose Us"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                />
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-bold">Ready to Get Started?</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Book Your Event with Event Experts</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our team is here to guide you through the entire event planning process, from venue selection to vendor
                    coordination. Get in touch with us today to start planning your unforgettable event.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center bg-background rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Book Now
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      )
    }


export default About
