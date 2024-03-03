export default function ExchangeButton({
  isLoading,
  setIsLoading,
  swap,
  loadingText,
}) {
  return (
    <button
      type="submit"
      onClick={async () => {
        setIsLoading(true);
        try {
          await swap();
        } catch (error) {
          console.error("Error during swap:", error);
        } finally {
          setIsLoading(false);
        }
      }}
      className={`relative mt-4 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2 ${
        isLoading ? "pointer-events-none" : ""
      }`}
    >
      {isLoading ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <span className="button__text">{loadingText || "Exchange"}</span>
      )}

      <>
        <svg
          className="button__svg"
          role="presentational"
          viewBox="0 0 600 600"
        >
          <svg
            className="button__svg"
            role="presentational"
            viewBox="0 0 600 600"
          >
            <defs>
              <clipPath id="myClip">
                <rect x="0" y="0" width="100%" height="50%" />
              </clipPath>
            </defs>
            <g clipPath="url(#myClip)">
              <g id="money">
                <path
                  d="M441.9,116.54h-162c-4.66,0-8.49,4.34-8.62,9.83l.85,278.17,178.37,2V126.37C450.38,120.89,446.56,116.52,441.9,116.54Z"
                  fill="#699e64"
                  stroke="#323c44"
                  strokeMiterlimit="10"
                  strokeWidth="14"
                />
                <path
                  d="M424.73,165.49c-10-2.53-17.38-12-17.68-24H316.44c-.09,11.58-7,21.53-16.62,23.94-3.24.92-5.54,4.29-5.62,8.21V376.54H430.1V173.71C430.15,169.83,427.93,166.43,424.73,165.49Z"
                  fill="#699e64"
                  stroke="#323c44"
                  strokeMiterlimit="10"
                  strokeWidth="14"
                />
              </g>
              <g id="creditcard">
                <path
                  d="M372.12,181.59H210.9c-4.64,0-8.45,4.34-8.58,9.83l.85,278.17,177.49,2V191.42C380.55,185.94,376.75,181.57,372.12,181.59Z"
                  fill="#a76fe2"
                  stroke="#323c44"
                  strokeMiterlimit="10"
                  strokeWidth="14"
                />
                <path
                  d="M347.55,261.85H332.22c-3.73,0-6.76-3.58-6.76-8v-35.2c0-4.42,3-8,6.76-8h15.33c3.73,0,6.76,3.58,6.76,8v35.2C354.31,258.27,351.28,261.85,347.55,261.85Z"
                  fill="#ffdc67"
                />
                <path d="M249.73,183.76h28.85v274.8H249.73Z" fill="#323c44" />
              </g>
            </g>
            <g id="wallet">
              <path
                d="M478,288.23h-337A28.93,28.93,0,0,0,112,317.14V546.2a29,29,0,0,0,28.94,28.95H478a29,29,0,0,0,28.95-28.94h0v-229A29,29,0,0,0,478,288.23Z"
                fill="#a4bdc1"
                stroke="#323c44"
                strokeMiterlimit="10"
                strokeWidth="14"
              />
              <path
                d="M512.83,382.71H416.71a28.93,28.93,0,0,0-28.95,28.94h0V467.8a29,29,0,0,0,28.95,28.95h96.12a19.31,19.31,0,0,0,19.3-19.3V402a19.3,19.3,0,0,0-19.3-19.3Z"
                fill="#a4bdc1"
                stroke="#323c44"
                strokeMiterlimit="10"
                strokeWidth="14"
              />
              <path
                d="M451.46,435.79v7.88a14.48,14.48,0,1,1-29,0v-7.9a14.48,14.48,0,0,1,29,0Z"
                fill="#a4bdc1"
                stroke="#323c44"
                strokeMiterlimit="10"
                strokeWidth="14"
              />
              <path
                d="M147.87,541.93V320.84c-.05-13.2,8.25-21.51,21.62-24.27a42.71,42.71,0,0,1,7.14-1.32l-29.36-.63a67.77,67.77,0,0,0-9.13.45c-13.37,2.75-20.32,12.57-20.27,25.77l.38,221.24c-1.57,15.44,8.15,27.08,25.34,26.1l33-.19c-15.9,0-28.78-10.58-28.76-25.93Z"
                fill="#7b8f91"
              />
              <path
                d="M148.16,343.22a20.11,20.11,0,0,1-20.24-20c0-10.45,10.07-20.31,20.29-20.29h.3c10.46,0,20,9.92,20,20.3A19.81,19.81,0,0,1,148.16,343.22Z"
                fill="#a4bdc1"
                stroke="#323c44"
                strokeMiterlimit="10"
                strokeWidth="14"
              />
              <path
                d="M168.38,522.28a10,10,0,1,1,9.91-10A9.91,9.91,0,0,1,168.38,522.28Z"
                fill="#7b8f91"
              />
            </g>
          </svg>
        </svg>
      </>
    </button>
  );
}
