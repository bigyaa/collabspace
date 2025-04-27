import Link from 'next/link';

export default function HomePage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center space-y-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                        Welcome to CollabSpace 🚀
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        A real-time collaborative platform for teams to create together.
                    </p>
                </div>
                
                <div className="w-full max-w-xs mx-auto h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        href="/login" 
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-transform hover:-translate-y-1 shadow-md font-medium"
                    >
                        Login
                    </Link>
                    <br />
                    <Link 
                        href="/signup" 
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transform transition-transform hover:-translate-y-1 shadow-md font-medium"
                    >
                        Sign up
                    </Link>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Join thousands of teams already collaborating on CollabSpace
                </p>
            </div>
        </main>
    );
}