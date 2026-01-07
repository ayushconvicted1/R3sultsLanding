import Link from "next/link";
import LogoSvg from "./images/Logo";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
          <div>
            <LogoSvg height={30} width={100} color="white" />
            <p className="text-slate-400 text-sm leading-relaxed mt-4">
              R3sults is an end-to-end Disaster Management platform that saves
              lives through real-time intelligence, proactive alerts, and
              immediate response coordination.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/#team"
                  className="hover:text-white transition-colors"
                >
                  Team
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Connect</h5>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg
                  width="15"
                  height="27"
                  viewBox="0 0 15 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.30117 26.9382C4.29666 26.8251 4.28762 26.712 4.28762 26.5968C4.28762 22.7394 4.28762 18.8821 4.28762 15.0269V14.6572H0V9.86706H4.28536C4.28536 9.73225 4.28536 9.63005 4.28536 9.52785C4.28988 8.27541 4.25825 7.01861 4.31247 5.76834C4.37798 4.25931 4.84108 2.8764 5.948 1.7479C6.79061 0.891188 7.8388 0.4063 9.02479 0.160594C9.98713 -0.035101 10.963 -0.0111827 11.9367 0.0236074C12.7273 0.0518745 13.518 0.11928 14.3064 0.169291C14.3674 0.17364 14.4306 0.191035 14.5052 0.204082V4.47458C14.4103 4.47458 14.3154 4.47458 14.2205 4.47458C13.2469 4.48762 12.271 4.47458 11.2996 4.52241C10.1498 4.57895 9.50144 5.1943 9.45174 6.30759C9.40204 7.46219 9.43367 8.62113 9.43141 9.77791C9.43141 9.79313 9.4427 9.80835 9.46303 9.85401H14.3448C14.1302 11.4652 13.9178 13.0395 13.7055 14.6442H9.44948C9.44044 14.7464 9.42689 14.8225 9.42689 14.8964C9.42689 18.8495 9.42689 22.8025 9.42689 26.7555C9.42689 26.8164 9.43593 26.8773 9.44044 26.9382H4.30343H4.30117Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg
                  width="27"
                  height="27"
                  viewBox="0 0 27 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M26.9926 13.4666C26.9926 15.9388 27.0027 18.4118 26.9901 20.884C26.974 23.8328 25.0315 26.2156 22.1587 26.8136C21.7496 26.8988 21.322 26.9291 20.9036 26.93C15.9694 26.9376 11.0351 26.9426 6.10085 26.9325C3.1268 26.9266 0.725462 24.9833 0.12576 22.1104C0.0422567 21.7123 0.0110485 21.2965 0.0102051 20.8891C8.351e-05 15.9439 -0.00497727 10.9986 0.00683121 6.05426C0.0135789 3.11226 1.97041 0.7202 4.83903 0.123028C5.24811 0.0386814 5.67575 0.00831669 6.0941 0.00747323C11.0284 -0.000117943 15.9635 -0.0034918 20.8977 0.00494284C23.8709 0.0100036 26.2723 1.94997 26.8703 4.82786C26.9639 5.27659 26.9858 5.7464 26.9875 6.20693C26.9985 8.62682 26.9926 11.0467 26.9926 13.4666ZM13.4921 22.1914C18.3252 22.1939 22.2405 18.2904 22.2397 13.4683C22.2397 8.65887 18.3395 4.76039 13.52 4.75027C8.68522 4.74014 4.76396 8.6361 4.75637 13.4565C4.74962 18.2769 8.66161 22.188 13.4921 22.1914ZM24.2741 4.48457C24.2724 3.45977 23.4526 2.64076 22.4286 2.64161C21.4055 2.64161 20.5831 3.4623 20.5814 4.48457C20.5797 5.5001 21.4114 6.33007 22.4286 6.33007C23.45 6.33007 24.2758 5.50432 24.2741 4.48542V4.48457Z"
                    fill="currentColor"
                  />
                  <path
                    d="M18.4491 13.4742C18.4457 16.2053 16.2409 18.4051 13.5039 18.4093C10.7567 18.4127 8.546 16.1986 8.55275 13.4506C8.56034 10.7211 10.7719 8.52726 13.5123 8.53401C16.2502 8.53992 18.4525 10.7439 18.4491 13.475V13.4742Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h5 className="font-semibold mb-4">
              Subscribe to our newsletter
            </h5>
            <NewsletterForm />
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          © 2026 R3sults. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

