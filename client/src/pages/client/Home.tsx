import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Background Circle */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-yellow-100 rounded-full blur-3xl opacity-50 z-0"></div>

        <motion.div
          className="text-center max-w-2xl relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-600 text-transparent bg-clip-text mb-6 drop-shadow-md"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            Connect. Chat. Grow.
          </motion.h1>

          <motion.p
            className="text-gray-700 text-lg md:text-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Meet people who share your passions – from around the world 🌍
          </motion.p>

          <motion.button
            className="px-10 py-3 bg-yellow-400 text-white font-bold rounded-full shadow-md hover:scale-105 hover:bg-yellow-500 transition-all duration-300"
            whileTap={{ scale: 0.95 }}
          >
            🚀 Start Chatting Now
          </motion.button>
        </motion.div>
      </section>

      {/* Section 2: Features */}
      <section className="bg-white py-16 px-6 text-center">
        <motion.h2
          className="text-3xl font-bold text-yellow-600 mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Why TALKSY?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: "💬",
              title: "Live Chat",
              desc: "Message users instantly with real-time sync and emojis.",
            },
            {
              icon: "🎯",
              title: "Match Interests",
              desc: "Connect only with people who share your passions.",
            },
            {
              icon: "📊",
              title: "Smart Stats",
              desc: "See how many people you’ve connected with and track engagement.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-yellow-100 rounded-xl p-6 shadow hover:scale-105 transition-transform"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <h3 className="text-xl font-bold text-yellow-600 mb-1">
                {item.title}
              </h3>
              <p className="text-gray-700">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 3: Community Stats */}
      <section className=" py-16 text-center">
        <motion.h2
          className="text-3xl font-bold text-yellow-700 mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          TALKSY Community
        </motion.h2>

        <motion.div
          className="flex flex-wrap justify-center gap-8 text-lg font-medium text-yellow-900"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div>👥 4,320 Users Online</div>
          <div>🧠 12+ Interests Matched</div>
          <div>📨 15K+ Messages Sent</div>
        </motion.div>
      </section>

      {/* Section 4: Supported By */}
      <section className="bg-white py-20 px-6 text-center">
        <motion.h2
          className="text-3xl font-bold text-yellow-600 mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Supported by Real People 💛
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {[
            {
              name: "Aylin",
              avatar: "https://img.freepik.com/free-photo/shot-positive-european-young-female-with-dark-curly-hair-has-gentle-smile-freckled-skin-wears-casual-beige-shirt_273609-15736.jpg?semt=ais_hybrid&w=740",
              title: "Artist & Music Lover",
            },
            {
              name: "Kamil",
              avatar: "https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg",
              title: "Techie & Gamer",
            },
            {
              name: "Selin",
              avatar: "https://sb.kaleidousercontent.com/67418/1920x1282/7978bca0ba/christina-wocintechchat-com-50tkcap8m3a-unsplash.jpg",
              title: "Photographer",
            },
            {
              name: "Elvin",
              avatar: "https://www.morganstanley.com/content/dam/msdotcom/people/tiles/isaiah-dwuma.jpg.img.490.medium.jpg/1594668408164.jpg",
              title: "Traveler & Blogger",
            },
          ].map((user, i) => (
            <motion.div
              key={i}
              className="bg-yellow-50 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500">{user.title}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
