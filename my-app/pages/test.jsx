export default function Index() {
    return (

<div>
    
    <div className="relative overflow-hidden  bg-[url('/logo.jpg')] "
    >
      <div
        className="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"
        
      >
        <div className="flex justify-center items-center h-full">
          <div className="text-center text-white px-6 md:px-12">
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight mb-12">
              The best offer on the market <br /><span>for your business</span>
            </h1>
            <button
              type="button"
              className="inline-block px-7 py-3 border-2 border-white text-white font-medium text-sm leading-snug uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              Get started
            </button>
          </div>
        </div>
      </div>
    </div>
  
  
    </div>

);
}
