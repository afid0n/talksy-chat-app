import Cards from "@/components/Cards";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { loginSuccess } from "@/redux/userSlice";
import { getAll } from "@/services/commonRequest";
import type { RootState } from "@/redux/store/store";
import type { User } from "@/types/User";
import {
  Globe,
  Search,
  Filter,
  MapPin,
  X,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import instance from "@/services/instance";

const Feed = () => {
  const user = useSelector((state: RootState) => state.user);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedCountries, setTempSelectedCountries] = useState<string[]>([]);
  const [appliedCountries, setAppliedCountries] = useState<string[]>([]);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await instance.get("/users/me", { withCredentials: true });
        dispatch(loginSuccess(data));
      } catch (error) {
        console.log("Not logged in", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAll<User[]>("/users");
        setUsers(res);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Shared interests users filtered from all users except current user
  const sharedInterestUsers = useMemo(() => {
    if (!user.interests?.length) return [];
    return users.filter(u => {
      if (u.id === user.id) return false;
      return u.interests?.some(interest => user.interests?.includes(interest));
    });
  }, [users, user.interests]);

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleCheckboxChange = (country: string) => {
    setTempSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(item => item !== country)
        : [...prev, country]
    );
  };

  const handleReset = () => {
    setTempSelectedCountries([]);
    setAppliedCountries([]);
    setShowFilters(false);
  };

  const handleApply = () => {
    setAppliedCountries(tempSelectedCountries);
    setShowFilters(false);
  };

  const countries = [
    "Azerbaijan", "Bosnia and Herzegovina", "United States", "Canada", "Mexico",
    "Brazil", "Argentina", "United Kingdom", "France", "Germany", "Italy",
    "Spain", "Portugal", "Netherlands", "Belgium", "Switzerland", "Austria",
    "Sweden", "Norway", "Denmark", "Turkey", "Russia", "Ukraine", "Poland",
    "Czech Republic", "Hungary", "Romania", "Greece", "Bulgaria"
  ];

  const tabs = [
    { value: "discover", icon: Globe, label: "Discover" },
    { value: "nearby", icon: MapPin, label: "Nearby" },
    { value: "interests", icon: Filter, label: "Shared Interests" },
  ];

  return (
    <div className="relative px-2 sm:px-4 md:px-8 lg:px-20 py-8 sm:py-12 md:py-14">
      {showFilters && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          className="fixed inset-0 z-40"
          onClick={toggleFilters}
        />
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Discover People</h1>
        <p className="mt-3">Find and connect with other users</p>

        <Tabs defaultValue="discover" className="w-full flex flex-col gap-5 mt-5">
          <div className="w-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
            <TabsList className="bg-white dark:bg-zinc-900 flex gap-2">
              {tabs.map(({ value, icon: Icon, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
                    data-[state=active]:bg-yellow-500 data-[state=active]:text-white
                    text-gray-700 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 transition"
                >
                  <Icon size={16} />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="w-full flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search for users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md bg-white dark:bg-zinc-900
                  text-gray-800 dark:text-white border border-gray-300 dark:border-zinc-700
                  focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <button
              onClick={toggleFilters}
              className="bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-400
                dark:hover:bg-yellow-800 dark:bg-yellow-900 transition flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span>More Filters</span>
            </button>
          </div>

          {/* Discover Tab */}
          <TabsContent value="discover">
            {loading ? (
              <div>Loading users...</div>
            ) : user?.id ? (
              <Cards
                users={users}
                searchQuery={searchQuery}
                countriesFilter={appliedCountries}
                currentUserId={user.id}
              />
            ) : null}
          </TabsContent>

          {/* Nearby Tab */}
          <TabsContent value="nearby">
            {loading ? (
              <div>Loading users...</div>
            ) : user?.id && user?.location?.country ? (
              (() => {
                const userCountry = user.location.country;
                const nearbyUsers = users.filter(
                  (u) =>
                    u.id !== user.id &&
                    u.location?.country?.toLowerCase() === userCountry.toLowerCase()
                );

                return nearbyUsers.length > 0 ? (
                  <Cards
                    users={nearbyUsers}
                    city={userCountry}
                    searchQuery={searchQuery}
                    countriesFilter={appliedCountries}
                    currentUserId={user.id}
                  />
                ) : (
                  <div>No nearby people found in {userCountry}.</div>
                );
              })()
            ) : (
              <div>Detecting location...</div>
            )}
          </TabsContent>

          {/* Shared Interests Tab */}
          <TabsContent value="interests">
            {loading ? (
              <div>Loading users...</div>
            ) : user?.id && sharedInterestUsers.length > 0 ? (
              <Cards
                users={sharedInterestUsers}
                searchQuery={searchQuery}
                countriesFilter={appliedCountries}
                currentUserId={user.id}
                highlightInterests={user.interests}
              />
            ) : (
              <div>No users share your interests yet.</div>
            )}
          </TabsContent>
        </Tabs>

        {/* Filters Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-zinc-900
            text-gray-900 dark:text-gray-100 z-50 shadow-xl transform transition-transform duration-300
            ${showFilters ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="px-6 py-8 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Filters</h2>
              <button
                onClick={toggleFilters}
                className="text-gray-600 dark:text-gray-400 hover:text-yellow-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Countries</h3>
              <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm">
                {countries.map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-yellow-500"
                      checked={tempSelectedCountries.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-10">
              <button
                onClick={handleReset}
                className="bg-yellow-500 hover:bg-yellow-400 dark:hover:bg-yellow-800
                  dark:bg-yellow-900 transition text-white px-4 py-2 rounded"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="bg-yellow-500 hover:bg-yellow-400 dark:hover:bg-yellow-800
                  dark:bg-yellow-900 transition text-white px-4 py-2 rounded"
              >
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
