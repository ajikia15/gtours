export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 rounded-lg my-4 px-16">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        {/* Left side - Logo and testimonial */}
        <div className="md:w-1/4">
          <h2 className="text-3xl font-bold mb-3">LOGO</h2>
          <p className="text-gray-300 text-sm">
            ლორემ იფსუმ კაკადემის ჩაკეტილი მოსაზრება სოფლისთან
          </p>
        </div>

        {/* Right side - Three columns of links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-6 lg:gap-12 xl:gap-18 ">
          {/* Column 1 */}
          <div>
            <h3 className="font-semibold text-lg mb-4">კონტაქტი</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  ლორემ იფსუმ დოლორ სით
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  ლორემ იფსუმ დოლორ სით
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  ლორემ იფსუმ დოლორ სით
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  ლორემ იფსუმ დოლორ სით
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-semibold text-lg mb-4">სოციალური მედია</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  ლორემ იფსუმ დოლორ სით
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  ლორემ იფსუმ დოლორ სით
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  ლორემ იფსუმ დოლორ სით
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  ლორემ იფსუმ დოლორ სით
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-semibold text-lg mb-4">პვარტნიორები</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  ლორემ იფსუმ დოლორ სით
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  ლორემ იფსუმ დოლორ სით
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  ლორემ იფსუმ დოლორ სით
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  ლორემ იფსუმ დოლორ სით
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
