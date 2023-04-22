import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

const people = [
  {
    id: 1,
    name: "BNB",
    imageUrl:
      "data:image/png;base64,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",
  },
  {
    id: 2,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 3,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 4,
    name: "BNB",
    imageUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAANlBMVEXwuQv////ywir99uD77sL202b55KPxvRr33IX++/D32Hb0y0j44JT1z1fzxjn+++/88tH66bOGc1PrAAAG7ElEQVR4nO2d6ZqkKgyGexA3XMq6/5s9lXY8IgQNS1lMiu/f9FjK68MSkhh+/qRV30s5jkpN0zTPQrTtz1+1rRDDME1KqXGUsu8TP/gn8f3+eZC+b5q6FuKHrHmu66apqkQNKCD/q+/HcRjoAKaGIQlOAQFJOcQg6Jqm5/NZQMJBoD/5jGyahGiaAhLyo3HcF7pcYL4XRMr0XSoFTAH5p0GqapreDbGprv2W+28EaZr3zVWY/DrYl4H0fa/UnRCblKJuJb8KpKrE+6dcl4SoSKP+i0CW5d4xjqCIZSkgm5rmoxD/63Im/hKQcfw0wK5xLCA5YYBOUb4AJJdhrutkyLMHWZZEzx4GKbsu2ZrqXBqZg4CZmOCpbbuNz6qq6wQ3hFs6TEjWIH2fBMPcFCV6O0Kge60Ccq3Pg8Rvz4dhwaeXpkmw2VTqu0BiV3QhpMQY/uq1A++6WBRkhWcLEjci27brKI6o2GUFWU3YgsQ8wM+BDuM+/FnT9BUgTfhAByMXbe/j0XXOVICYGLfxPJ4ggYvVbuRa2iKOzl4XPuyFYA8S2K+cE+6yHDNunBeGTvmj/v44ggSOu2mye83joTDL0xEVDM0Iadt2fzX8QKJsxeNYPm2YgBDUfi3krkU8eO9c/EB8OlbbWhkQW6+Rcp6N/5om694r+ONhTb2QQ0tvhz4HcwN5Puk/rmsYYshKBjnjxp82y8XyNQoxTcc/tdu66mdNbpYKNxBq1s/RNlyWM6PmaLlc2CLgO9KWS7o1OQwFJGOQqqL8xGHk4l1aYekwDqMK3cvQzeL1ObxAaKu6YwuIrBy/qwpiVYEJhty46xybFRrK+np5gdDMHRvEYeT+1Twf23digjnMYhrIOtw5gdCGug1iNQw+bDN+s5nFiJFrdkjDLKaDrMOdEwh1J3JcCq0RvppgiFHVddZyO89ws+cTAdcnbSoI9EtOINTLdRAjxKEvaRcrWXtcVy1bRO9e1JbVNS8Qez3zAsEsF6c1adiGCHgICOwT+YD0Pe1iHOTgWjJkWpMQ6nVcqm1QQ0BgAuYDIiX1Yj28vYEIwyd+VFVtFsxFqFdrxA7i4xJ+3YANiE8G5m7b0UDW5tT1ZajXAoE4F71dYMrzAfFNPFmd73QQkgwQ/4+gXhRsQEI+yFNqmxjTgzRNiHv+RVFAcgOJq3WQHiRML3uRDQh99cSQ3wmCuACcel3JBoQ+Y0sJ2wzzYa7MaC8hbgPYudCt3xcFGxC6VvvVcr5D+l8MRFU5A3aJ8umZgzjCoGE1QBAjt233WxUQGggI2S1gyTXnQt3z+r6+gESBgOgJs85kmjAvCicQnwXxEoQ27E+9w2Egnit71iA+viMb5DfMZD7v1InVmREU8B2jfi0fEC/rN3MQqi/eCQL/NEs8QcDCIeOma4JENMhr5mADQnc+nICAdGuSBrLHuaJBvLwomYPQPY0XIDCtbsOYAqJfEw3i5TItIPeA0MMKlyB78jAFRN9XRoN4xUcyB6E7+XIG8YohZg4SF57OBSQ6zp4RCP07Bcd+RN8VhoEcLLUQkHn+zUVhAxKd5rT7Gv1BLD/jJ/O1cgEJSQW0frPu1f1AwM9oJQ7enNOYJQh1Aj5uxJGSuXXtYzQOg/VFj5nqQQWB7sgJJDyl3FnlhL5n37GQSp+35cZnB0Iz5R3OKqwKmB/Ims6MiAayujZ5gdCGuzMAgvka0bMr0ADVZXWCK62t4gVCHe5H29uAcX5ycdIwZ6VoJNTr0FYghRsIfcN7EgBBMvg2cKRh8+zIZ/ZLzNy6cAHJFMTvw3xYhtE2IDcBcMfXh+gt/CpZRFYYyBrEt7gvGon2eRsIiH8li72b8wPpe9/sZ2TYbyBwgiDKpDX0CALWgW+ew8Gpxg8krAS2AKvKBoHPCXtzEl2j1ggIsncn6fCFNkeQ4EJh+7g3vCi7Wbzvxy2Q0GOY3lDxLD8QGZ7avTYL8WvBvl6fqg+/oBu5toyZhifIH3qBFFswG/t4GtVZdYJLWU9gC7LHymPk79fyk12MgC9ImjMV3g1ySwVmUBYgKYp7W0VsNz0eCTBurFKeCUiKAvhIlZNEh6beXMk/C5BUk/BhO4wVfQoQ9n4KCFmfB0l2tI0QEDVIeGjqp87o+TxIwuOfhEh21NBnz7H6NAibI9IYgeSFUs5DXJXL0XXlzNBd9kfsN6tt20Tn6jIBYXNkMyMQNseaMwL5VdwxR/7Saw0UEFzJDswkyLdgwXeCgO7oYBfFEAvIrTAn2ZoFhD/Iu2DAC0ZdyQsIpudzSuVChI/0vWeqAoKqqsJqRO4I4f2pgLgFOHXtEwKBXJumSYCwqoA41PdSjqNSr1lgGHQ/PJSPnOdpUkpBiZ1kAJvYgPwHBPaUJSvmxqQAAAAASUVORK5CYII=",
  },
  {
    id: 5,
    name: "BNB",
    imageUrl:
      "data:image/png;base64,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",
  },
  {
    id: 6,
    name: "BNB",
    imageUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAANlBMVEXwuQv////ywir99uD77sL202b55KPxvRr33IX++/D32Hb0y0j44JT1z1fzxjn+++/88tH66bOGc1PrAAAG7ElEQVR4nO2d6ZqkKgyGexA3XMq6/5s9lXY8IgQNS1lMiu/f9FjK68MSkhh+/qRV30s5jkpN0zTPQrTtz1+1rRDDME1KqXGUsu8TP/gn8f3+eZC+b5q6FuKHrHmu66apqkQNKCD/q+/HcRjoAKaGIQlOAQFJOcQg6Jqm5/NZQMJBoD/5jGyahGiaAhLyo3HcF7pcYL4XRMr0XSoFTAH5p0GqapreDbGprv2W+28EaZr3zVWY/DrYl4H0fa/UnRCblKJuJb8KpKrE+6dcl4SoSKP+i0CW5d4xjqCIZSkgm5rmoxD/63Im/hKQcfw0wK5xLCA5YYBOUb4AJJdhrutkyLMHWZZEzx4GKbsu2ZrqXBqZg4CZmOCpbbuNz6qq6wQ3hFs6TEjWIH2fBMPcFCV6O0Kge60Ccq3Pg8Rvz4dhwaeXpkmw2VTqu0BiV3QhpMQY/uq1A++6WBRkhWcLEjci27brKI6o2GUFWU3YgsQ8wM+BDuM+/FnT9BUgTfhAByMXbe/j0XXOVICYGLfxPJ4ggYvVbuRa2iKOzl4XPuyFYA8S2K+cE+6yHDNunBeGTvmj/v44ggSOu2mye83joTDL0xEVDM0Iadt2fzX8QKJsxeNYPm2YgBDUfi3krkU8eO9c/EB8OlbbWhkQW6+Rcp6N/5om694r+ONhTb2QQ0tvhz4HcwN5Puk/rmsYYshKBjnjxp82y8XyNQoxTcc/tdu66mdNbpYKNxBq1s/RNlyWM6PmaLlc2CLgO9KWS7o1OQwFJGOQqqL8xGHk4l1aYekwDqMK3cvQzeL1ObxAaKu6YwuIrBy/qwpiVYEJhty46xybFRrK+np5gdDMHRvEYeT+1Twf23digjnMYhrIOtw5gdCGug1iNQw+bDN+s5nFiJFrdkjDLKaDrMOdEwh1J3JcCq0RvppgiFHVddZyO89ws+cTAdcnbSoI9EtOINTLdRAjxKEvaRcrWXtcVy1bRO9e1JbVNS8Qez3zAsEsF6c1adiGCHgICOwT+YD0Pe1iHOTgWjJkWpMQ6nVcqm1QQ0BgAuYDIiX1Yj28vYEIwyd+VFVtFsxFqFdrxA7i4xJ+3YANiE8G5m7b0UDW5tT1ZajXAoE4F71dYMrzAfFNPFmd73QQkgwQ/4+gXhRsQEI+yFNqmxjTgzRNiHv+RVFAcgOJq3WQHiRML3uRDQh99cSQ3wmCuACcel3JBoQ+Y0sJ2wzzYa7MaC8hbgPYudCt3xcFGxC6VvvVcr5D+l8MRFU5A3aJ8umZgzjCoGE1QBAjt233WxUQGggI2S1gyTXnQt3z+r6+gESBgOgJs85kmjAvCicQnwXxEoQ27E+9w2Egnit71iA+viMb5DfMZD7v1InVmREU8B2jfi0fEC/rN3MQqi/eCQL/NEs8QcDCIeOma4JENMhr5mADQnc+nICAdGuSBrLHuaJBvLwomYPQPY0XIDCtbsOYAqJfEw3i5TItIPeA0MMKlyB78jAFRN9XRoN4xUcyB6E7+XIG8YohZg4SF57OBSQ6zp4RCP07Bcd+RN8VhoEcLLUQkHn+zUVhAxKd5rT7Gv1BLD/jJ/O1cgEJSQW0frPu1f1AwM9oJQ7enNOYJQh1Aj5uxJGSuXXtYzQOg/VFj5nqQQWB7sgJJDyl3FnlhL5n37GQSp+35cZnB0Iz5R3OKqwKmB/Ims6MiAayujZ5gdCGuzMAgvka0bMr0ADVZXWCK62t4gVCHe5H29uAcX5ycdIwZ6VoJNTr0FYghRsIfcN7EgBBMvg2cKRh8+zIZ/ZLzNy6cAHJFMTvw3xYhtE2IDcBcMfXh+gt/CpZRFYYyBrEt7gvGon2eRsIiH8li72b8wPpe9/sZ2TYbyBwgiDKpDX0CALWgW+ew8Gpxg8krAS2AKvKBoHPCXtzEl2j1ggIsncn6fCFNkeQ4EJh+7g3vCi7Wbzvxy2Q0GOY3lDxLD8QGZ7avTYL8WvBvl6fqg+/oBu5toyZhifIH3qBFFswG/t4GtVZdYJLWU9gC7LHymPk79fyk12MgC9ImjMV3g1ySwVmUBYgKYp7W0VsNz0eCTBurFKeCUiKAvhIlZNEh6beXMk/C5BUk/BhO4wVfQoQ9n4KCFmfB0l2tI0QEDVIeGjqp87o+TxIwuOfhEh21NBnz7H6NAibI9IYgeSFUs5DXJXL0XXlzNBd9kfsN6tt20Tn6jIBYXNkMyMQNseaMwL5VdwxR/7Saw0UEFzJDswkyLdgwXeCgO7oYBfFEAvIrTAn2ZoFhD/Iu2DAC0ZdyQsIpudzSuVChI/0vWeqAoKqqsJqRO4I4f2pgLgFOHXtEwKBXJumSYCwqoA41PdSjqNSr1lgGHQ/PJSPnOdpUkpBiZ1kAJvYgPwHBPaUJSvmxqQAAAAASUVORK5CYII=",
  },
  // More users...
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function Example() {
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });
  const [open, setOpen] = useState(true);

  return (
    <div className="overflow-hidden bg-gray-800 py-16 px-8 h-screen">
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold  text-gray-900"
                      >
                        Tokens
                      </Dialog.Title>
                      <Combobox
                        as="div"
                        value={selectedPerson}
                        onChange={setSelectedPerson}
                      >
                        <div className="relative mt-2  ">
                          <Combobox.Input
                            className=" rounded-md border-0 bg-white py-1.5 pl-2 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={(person) => person?.name}
                          />
                          <Combobox.Button className="absolute inset-y-0  pl-64 flex items-center rounded-r-md px-2 focus:outline-none">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-900"
                              aria-hidden="true"
                            />
                          </Combobox.Button>

                          {filteredPeople.length > 0 && (
                            <Combobox.Options className="relative z-10 mt-1 max-h-36  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {filteredPeople.map((person) => (
                                <Combobox.Option
                                  key={person.id}
                                  value={person}
                                  className={({ active }) =>
                                    classNames(
                                      "relative cursor-default select-none py-2 pl-4 pr-12",
                                      active
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-900"
                                    )
                                  }
                                >
                                  {({ active, selected }) => (
                                    <>
                                      <div className="flex items-center">
                                        <img
                                          src={person.imageUrl}
                                          alt=""
                                          className="h-6 w-6 flex-shrink-0 rounded-full"
                                        />
                                        <span
                                          className={classNames(
                                            "ml-3 truncate ",
                                            selected && "font-semibold"
                                          )}
                                        >
                                          {person.name}
                                        </span>
                                      </div>

                                      {selected && (
                                        <span
                                          className={classNames(
                                            "absolute inset-y-0 right-0 flex items-center pr-4",
                                            active
                                              ? "text-white"
                                              : "text-indigo-600"
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Combobox.Option>
                              ))}
                            </Combobox.Options>
                          )}
                        </div>
                      </Combobox>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => setOpen(false)}
                    >
                      Confirm
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
