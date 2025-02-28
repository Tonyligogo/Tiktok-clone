import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export const AuthContext = createContext({
  user: null,
  signIn: async (email, password) => {},
  signUp: async (username, email, password) => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const getUser = async (id) => {
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return console.error(error);
    setUser(data);
    router.push("/(tabs)");
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      console.error(error);
    }
    getUser(data?.user?.id);
  };

  const signUp = async (username, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      username,
    });
    if (error) return console.error(error);
    const { error: userError } = await supabase
      .from("User")
      .insert({
        id: data?.user?.id,
        username,
        email,
      });
    if (userError) return console.error(userError);
    getUser(data?.user?.id);
    //dismiss the signup modal first
    router.back();
    router.push("/(tabs)");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/(auth)");
  };

  useEffect(()=>{
    const {data:authData} = supabase.auth.onAuthStateChange((event, session)=>{
        if(!session) return router.push("/(auth)")
        getUser(session?.user?.id)
    })
    return () => {
        authData.subscription.unsubscribe();
    }
  },[])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
