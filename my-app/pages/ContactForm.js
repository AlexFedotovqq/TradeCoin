import React, { useState } from "react";

const FORM_ENDPOINT =
  "https://public.herotofu.com/v1/a14d1cd0-afde-11ee-870a-ff8e0d81300a";

const ContactForm = () => {
  const [status, setStatus] = useState();
  const [agreedToPublication, setAgreedToPublication] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();

    const injectedData = {
      DYNAMIC_DATA_EXAMPLE: 123,
    };
    const inputs = e.target.elements;
    const data = {};

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].name) {
        data[inputs[i].name] = inputs[i].value;
      }
    }

    Object.assign(data, injectedData);

    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 422) {
          Object.keys(injectedData).forEach((key) => {
            const el = document.createElement("input");
            el.type = "hidden";
            el.name = key;
            el.value = injectedData[key];

            e.target.appendChild(el);
          });

          e.target.setAttribute("target", "_blank");
          e.target.submit();

          throw new Error("Please finish the captcha challenge");
        }

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }

        return response.json();
      })
      .then(() => setStatus("We'll be in touch soon."))
      .catch((err) => setStatus(err.toString()));
  };
  const handleAgreementChange = () => {
    setAgreedToPublication(!agreedToPublication);
  };
  if (status) {
    return (
      <>
        <main className="relative isolate min-h-full">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Thank you!
            </h1>
            <p className="mt-4 text-base text-white/70 sm:mt-6">{status}</p>
            <div className="mt-10 flex justify-center">
              <a
                href="/"
                className="text-sm font-semibold leading-7 text-white"
              >
                <span aria-hidden="true">&larr;</span> Back to home
              </a>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <form
      action={FORM_ENDPOINT}
      onSubmit={handleSubmit}
      method="POST"
      className="mx-auto py-16 max-w-xl sm: p-3"
    >
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
      <div className="mt-8">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={agreedToPublication}
            onChange={handleAgreementChange}
            className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
          />
          <span className="ml-2 text-sm text-gray-200">
            I give permission to post my message, including my first and last
            name, on the website or social networks.
          </span>
        </label>
      </div>
      <div className="mt-8">
        <button
          type="submit"
          disabled={!agreedToPublication}
          className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Send a message
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
