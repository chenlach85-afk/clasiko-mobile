import { useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "@/lib/supabase";

export function useSignInApple() {
  const [loading, setLoading] = useState(false);

  const signInWithApple = async () => {
    try {
      setLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      if (error.code === "ERR_REQUEST_CANCELED") return;
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { signInWithApple, loading };
}
