export function Contactinfoperson() {
  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Contact us
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-200">
          Fill out the form and send it, we will reply to you as soon as
          possible!
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-2 ">
        <div>
          <label
            htmlFor="first-name"
            className="mt-2.5 block text-sm font-semibold leading-6 text-white"
          >
            First name
          </label>
          <div className="mt-1">
            <input
              type="text"
              placeholder="First name"
              name="First name"
              required
              className="focus:outline-none focus:ring relative w-full block  px-3.5 py-2 text-sm text-gray-600 placeholder-gray-400 bg-white border-0 rounded shadow outline-none sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="last-name"
            className="mt-2.5 block text-sm font-semibold leading-6 text-white"
          >
            Last name
          </label>
          <div className="mt-1">
            <input
              type="text"
              placeholder="Last name"
              name="Last name"
              className=" focus:outline-none focus:ring relative w-full block  px-3.5 py-2 text-sm text-gray-600 placeholder-gray-400 bg-white border-0 rounded shadow outline-none sm:text-sm sm:leading-6"
              required
            />
          </div>
        </div>
      </div>
      <div className="sm:col-span-2">
        <label
          htmlFor="email"
          className="mt-2.5 block text-sm font-semibold leading-6 text-white"
        >
          Email
        </label>
        <div className="mt-1">
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="focus:outline-none focus:ring relative w-full block  px-3.5 py-2 text-sm text-gray-600 placeholder-gray-400 bg-white border-0 rounded shadow outline-none sm:text-sm sm:leading-6"
            required
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label
          htmlFor="message"
          className="mt-2.5 block text-sm font-semibold leading-6 text-white"
        >
          Message
        </label>
        <div className="mt-1">
          <textarea
            placeholder="Your message"
            name="message"
            id="message"
            rows={4}
            className="focus:outline-none focus:ring relative w-full block  px-3.5 py-2 text-sm text-gray-600 placeholder-gray-400 bg-white border-0 rounded shadow outline-none sm:text-sm sm:leading-6"
            defaultValue={""}
            required
          />
        </div>
      </div>
    </>
  );
}
