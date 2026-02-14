import { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Auth({ onLogin, isOnline }) {
  const [user,setUser] = useState(null);
  const auth = getAuth();

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); onLogin?.(result.user);
    } catch (err) { console.error(err); alert("Login failed"); }
  };

  const continueAsGuest = () => {
    const guest = { displayName:"Guest", guest:true };
    setUser(guest); onLogin?.(guest);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="text-center mb-6">
        <div className="text-yellow-400 font-extrabold text-5xl">🧠</div>
        <div className="text-2xl font-bold mt-2 tracking-widest">LOGIC LOOPER</div>
      </div>

      {!user && isOnline && (
        <button onClick={loginWithGoogle} className="bg-blue-600 px-6 py-3 rounded-lg mb-4">Login with Google</button>
      )}
      <button onClick={continueAsGuest} className={`px-6 py-3 rounded-lg font-bold mb-2 transition ${!isOnline?"bg-green-600":"bg-gray-400 cursor-not-allowed"}`}>
        Continue as Guest
      </button>
      {!isOnline && <p className="text-gray-300 text-sm mt-2">Guest mode only offline</p>}
    </div>
  );
}
