import React from 'react'
import { MapPin, Users, MessageCircle, UserRoundPlus } from 'lucide-react';

const people = {
  '1': {
    fullName: "Alex Chen",
    username: "alexc",
    location: "San Francisco",
    connections: 5,
    bio: "Hey there! I'm using Talksy to connect with friends.",
    isOnline: true
  },
  '2': {
    fullName: "Maria Garcia",
    username: "mariag",
    location: "Barcelona",
    connections: 12,
    bio: "Hey there! I'm using Talksy to connect with friends.",
    isOnline: false
  },
  '3': {
    fullName: "Yuki Tanaka",
    username: "yukitanaka",
    location: "Tokyo",
    connections: 3,
    bio: "Hey there! I'm using Talksy to connect with friends.",
    isOnline: true
  }, '4': {
    fullName: "Priya Singh",
    username: "priyasingh",
    location: "Mumbai",
    connections: 8,
    bio: "Excited to meet new people on Talksy!",
    isOnline: false
  },
  '5': {
    fullName: "John Smith",
    username: "johnsmith",
    location: "London",
    connections: 10,
    bio: "Always up for a chat and making friends.",
    isOnline: true
  },
  '6': {
    fullName: "Fatima Al-Farsi",
    username: "fatimaa",
    location: "Dubai",
    connections: 7,
    bio: "Connecting cultures and people on Talksy.",
    isOnline: false
  },
  '7': {
    fullName: "Lucas Müller",
    username: "lucasm",
    location: "Berlin",
    connections: 6,
    bio: "Here to expand my network and learn new things.",
    isOnline: true
  },
  '8': {
    fullName: "Sofia Rossi",
    username: "sofiar",
    location: "Rome",
    connections: 9,
    bio: "Ciao! Let's connect and share stories.",
    isOnline: false
  },
  '9': {
    fullName: "David Kim",
    username: "davidk",
    location: "Seoul",
    connections: 4,
    bio: "Looking forward to making global friends.",
    isOnline: true
  },
  '10': {
    fullName: "Emma Dubois",
    username: "emmad",
    location: "Paris",
    connections: 11,
    bio: "Bonjour! Happy to chat with new friends.",
    isOnline: false
  },
}

const Cards = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Object.entries(people).map(([id, person]) => (
          <div key={id} className="bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between transition-all hover:shadow-lg">
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <span className='bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold'>
                  {person.fullName[0]}
                </span>
                {person.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{person.fullName}</h2>
                <p className="text-sm text-gray-600">@{person.username}</p>
              </div>
            </div>
            <div className='flex flex-wrap items-center gap-3 mt-3'>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin size={14} /> {person.location}
              </p>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Users size={14} /> {person.connections} mutuals
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-700">{person.bio}</p>
            <div className='flex justify-between mt-4'>
              <button className='text-sm flex items-center gap-1 bg-green-50 cursor-pointer hover:bg-green-100' style={{ borderRadius: "5px", padding: "3px 20px" }}>
                <UserRoundPlus size={13} /> Connect
              </button>
              <button className='text-sm flex items-center gap-1  bg-gray-50 cursor-pointer hover:bg-gray-100' style={{ borderRadius: "5px", padding: "3px 20px" }}>
                <MessageCircle size={13} /> Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Cards