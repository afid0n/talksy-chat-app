import {
  MapPin,
  Users,
  MessageCircle,
  UserRoundPlus,
  Heart,
} from "lucide-react";

const people = {
  '1': {
    fullName: "Almir Bajraktarevic",
    username: "almirbajraktarevic",
    location: "Brcko",
    connections: 0,
    bio: "People say nothing is impossible, but I do nothing every day😎",
    isOnline: true,
    hobbies: ["Basketball", "Sleeping", "Gaming"]
  },
  '2': {
    fullName: "Alex Chen",
    username: "alexc",
    location: "San Francisco",
    connections: 5,
    bio: "Hey there! I'm using Talksy to connect with friends.",
    isOnline: true,
    hobbies: ["Photography", "Hiking", "Tech", "Cooking"]
  },
  '3': {
    fullName: "Maria Garcia",
    username: "mariag",
    location: "Barcelona",
    connections: 12,
    bio: "Hey there! I'm using Talksy to connect with friends.",
    isOnline: false,
    hobbies: ["Travel", "Art", "Cycling"]
  },
  '4': {
    fullName: "Yuki Tanaka",
    username: "yukitanaka",
    location: "Tokyo",
    connections: 3,
    bio: "Hey there! I'm using Talksy to connect with friends.",
    isOnline: true,
    hobbies: ["Anime", "Gaming", "Music", "Coding", "Reading"]
  },
  '5': {
    fullName: "Priya Singh",
    username: "priyasingh",
    location: "Mumbai",
    connections: 8,
    bio: "Excited to meet new people on Talksy!",
    isOnline: false,
    hobbies: ["Dancing", "Yoga"]
  },
  '6': {
    fullName: "John Smith",
    username: "johnsmith",
    location: "London",
    connections: 10,
    bio: "Always up for a chat and making friends.",
    isOnline: true,
    hobbies: ["Football", "Reading", "Cooking"]
  },
  '7': {
    fullName: "Fatima Al-Farsi",
    username: "fatimaa",
    location: "Dubai",
    connections: 7,
    bio: "Connecting cultures and people on Talksy.",
    isOnline: false,
    hobbies: ["Travel", "Fashion"]
  },
  '8': {
    fullName: "Lucas Müller",
    username: "lucasm",
    location: "Berlin",
    connections: 6,
    bio: "Here to expand my network and learn new things.",
    isOnline: true,
    hobbies: ["Cycling", "Music", "Coding", "Chess"]
  },
  '9': {
    fullName: "Sofia Rossi",
    username: "sofiar",
    location: "Rome",
    connections: 9,
    bio: "Ciao! Let's connect and share stories.",
    isOnline: false,
    hobbies: ["Painting"]
  },
  '10': {
    fullName: "David Kim",
    username: "davidk",
    location: "Seoul",
    connections: 4,
    bio: "Looking forward to making global friends.",
    isOnline: true,
    hobbies: ["Gaming", "Music", "Travel"]
  },
  '11': {
    fullName: "Emma Dubois",
    username: "emmad",
    location: "Paris",
    connections: 11,
    bio: "Bonjour! Happy to chat with new friends.",
    isOnline: false,
    hobbies: ["Cooking", "Fashion", "Reading", "Travel"]
  },
  '12': {
    fullName: "Elvin Mammadov",
    username: "elvinm",
    location: "Baku",
    connections: 6,
    bio: "Always happy to meet new friends in Baku!",
    isOnline: true,
    hobbies: ["Football", "Chess", "Coding"]
  },
  '13': {
    fullName: "Aysel Huseynova",
    username: "ayselh",
    location: "Baku",
    connections: 8,
    bio: "Exploring Talksy and connecting with awesome people.",
    isOnline: false,
    hobbies: ["Music", "Travel"]
  },
  '14': {
    fullName: "Kamran Aliyev",
    username: "kamranali",
    location: "Baku",
    connections: 5,
    bio: "Let's chat and share stories from Baku!",
    isOnline: true,
    hobbies: ["Reading", "Football", "Coding", "Gaming"]
  },
};

interface CardsProps {
  city?: string;
}

const Cards = ({ city }: CardsProps) => {
  const filteredPeople = city
    ? Object.entries(people).filter(([_, person]) =>
        person.location.toLowerCase() === city.toLowerCase()
      )
    : Object.entries(people);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPeople.map(([id, person]) => (
          <div
            key={id}
            className="relative group bg-white dark:bg-zinc-900 shadow-md dark:shadow-zinc-800 rounded-2xl p-4 flex flex-col justify-between transition duration-200 ease-in-out hover:scale-105 hover:shadow-lg dark:hover:shadow-xl"
          >
            {/* Heart hover icon */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
              <Heart
                size={15}
                className="text-gray-400 hover:text-red-500 cursor-pointer"
              />
            </div>

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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  @{person.username}
                </p>
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
              <button className="text-sm flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 transition px-4 py-1.5 rounded-md">
                <UserRoundPlus size={13} /> Connect
              </button>
              <button className="text-sm flex items-center gap-1 bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition px-4 py-1.5 rounded-md">
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
