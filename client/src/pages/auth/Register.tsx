import RegisterForm from "@/components/RegisterForm";


export default function Register() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  dark:bg-black text-black dark:text-white transition-colors">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold">
          <span className="text-black dark:text-white">Talk</span>
          <span className="text-yellow-500">sy</span>
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-2">Create your account</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Almost there! Just a few more details</p>
      </div>

      <RegisterForm />
    </div>
  );
}
