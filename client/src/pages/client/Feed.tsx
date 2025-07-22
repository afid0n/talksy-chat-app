import Cards from "@/components/Cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Filter, TrendingUp, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";

const Feed = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => setShowFilters(!showFilters);
  const countries = [
    "Azerbaijan", "Bosnia and Herzegovinia", "United States", "Canada", "Mexico", "Brazil", "Argentina", "United Kingdom", "France", "Germany", "Italy",
    "Spain", "Portugal", "Netherlands", "Belgium", "Switzerland", "Austria", "Sweden", "Norway", "Denmark",
    "Turkey", "Russia", "Ukraine", "Poland", "Czech Republic", "Hungary", "Romania", "Greece", "Bulgaria"
  ];

  useEffect(() => {
    localStorage.setItem("location", "Baku");
    setLocation("Baku");
  }, []);

  return (
    <div className="px-2 sm:px-4 md:px-8 lg:px-20 py-8 sm:py-12 md:py-14">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Discover People</h1>
        <p>Find and connect with other users</p>
        <button>Create Group</button>

        <Tabs defaultValue="discover" className="w-full flex flex-col gap-5">
          <div className="w-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
            <TabsList className="bg-white dark:bg-zinc-900 flex gap-2">
              {[
                { value: "discover", icon: Globe, label: "Discover" },
                { value: "trending", icon: TrendingUp, label: "Trending" },
                { value: "nearby", icon: MapPin, label: "Nearby" },
              ].map(({ value, icon: Icon, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-gray-700 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 transition"
                >
                  <Icon size={16} />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="w-full flex gap-5">
            <input
              type="text"
              placeholder="Search for users..."
              className="w-4xl py-1.5 px-2 outline-0 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 rounded-sm shadow-sm"
            />
            <div className="flex-1 sm:w-auto">
              <button
                onClick={toggleFilters}
                className=" sm:w-auto bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-400 dark:hover:bg-yellow-800 dark:bg-yellow-900 transition flex items-center justify-center sm:justify-start gap-2"
              >
                <Filter className="w-5 h-5" />
                <span>More Filters</span>
              </button>
            </div>
          </div>

          <TabsContent value="discover">
            <Cards />
          </TabsContent>
          <TabsContent value="trending">
            <div>Trending...</div>
          </TabsContent>
          <TabsContent value="nearby">
            {location ? <Cards city={location} /> : <div>Detecting location...</div>}
          </TabsContent>
        </Tabs>

        {showFilters && (
          <div
            className=""
            onClick={toggleFilters}
          />
        )}

        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 z-50 shadow-xl transform transition-transform duration-300 ${showFilters ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="px-6 py-8 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Filters</h2>
              <button onClick={toggleFilters} className="text-gray-600 dark:text-gray-400 hover:text-yellow-500">
                <X className="w-6 h-6" />
              </button>
            </div>


            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Countries</h3>
              <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm">
                {countries.map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input type="checkbox" className="accent-yellow-500" />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-10">
              <button className="bg-yellow-500 hover:bg-yellow-400 dark:hover:bg-yellow-800 dark:bg-yellow-900 transition  text-white px-4 py-2 rounded ">
                Reset
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-400 dark:hover:bg-yellow-800 dark:bg-yellow-900 transition  text-white px-4 py-2 rounded ">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;





