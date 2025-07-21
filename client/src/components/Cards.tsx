import {
  MapPin,
  Users,
  MessageCircle,
  UserRoundPlus,
} from "lucide-react";

const people = {
  '1': { fullName: "Alex Chen", username: "alexc", location: "San Francisco", connections: 5, bio: "Hey there! I'm using Talksy to connect with friends.", isOnline: true },
  '2': { fullName: "Maria Garcia", username: "mariag", location: "Barcelona", connections: 12, bio: "Hey there! I'm using Talksy to connect with friends.", isOnline: false },
  '3': { fullName: "Yuki Tanaka", username: "yukitanaka", location: "Tokyo", connections: 3, bio: "Hey there! I'm using Talksy to connect with friends.", isOnline: true },
  '4': { fullName: "Priya Singh", username: "priyasingh", location: "Mumbai", connections: 8, bio: "Excited to meet new people on Talksy!", isOnline: false },
  '5': { fullName: "John Smith", username: "johnsmith", location: "London", connections: 10, bio: "Always up for a chat and making friends.", isOnline: true },
  '6': { fullName: "Fatima Al-Farsi", username: "fatimaa", location: "Dubai", connections: 7, bio: "Connecting cultures and people on Talksy.", isOnline: false },
  '7': { fullName: "Lucas Müller", username: "lucasm", location: "Berlin", connections: 6, bio: "Here to expand my network and learn new things.", isOnline: true },
  '8': { fullName: "Sofia Rossi", username: "sofiar", location: "Rome", connections: 9, bio: "Ciao! Let's connect and share stories.", isOnline: false },
  '9': { fullName: "David Kim", username: "davidk", location: "Seoul", connections: 4, bio: "Looking forward to making global friends.", isOnline: true },
  '10': { fullName: "Emma Dubois", username: "emmad", location: "Paris", connections: 11, bio: "Bonjour! Happy to chat with new friends.", isOnline: false },
};

const Cards = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Object.entries(people).map(([id, person]) => (
          <div
            key={id}
            className="bg-white dark:bg-zinc-900 shadow-md dark:shadow-zinc-800 rounded-2xl p-4 flex flex-col justify-between transition hover:shadow-lg dark:hover:shadow-xl"
          >
            {/* Avatar & Name */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  {person.fullName[0]}
                </span>
                {person.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white dark:border-zinc-900 rounded-full" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {person.fullName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">@{person.username}</p>
              </div>
            </div>

            {/* Location & Mutuals */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <MapPin size={14} /> {person.location}
              </p>
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                <Users size={14} /> {person.connections} mutuals
              </span>
            </div>

            {/* Bio */}
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{person.bio}</p>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button
                className="text-sm flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 transition px-4 py-1.5 rounded-md"
              >
                <UserRoundPlus size={13} /> Connect
              </button>
              <button
                className="text-sm flex items-center gap-1 bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition px-4 py-1.5 rounded-md"
              >
                <MessageCircle size={13} /> Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
