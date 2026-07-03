"use client";

import { supabase, type Provider } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

import "./auth-page.css";

export default function AuthPage() {
  const pathname = usePathname();
  // console.log("🚦pathname🚦", pathname);
  const [mode, setMode] = useState(pathname == "/login" ? "login" : "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("失敗: " + error.message);
        return;
      }
      // // ユーザーのデータ確認
      // const { data: sites } = await supabase
      //   .from("t_sites")
      //   .select("*")
      //   .eq("user_id", data.user.id);

      // if (!sites || sites.length === 0) {
      //   router.push("/onboarding");
      // } else {
      //   router.push("/dashboard");
      // }

      console.log(data.user.email);
      router.push("/dashboard");

      alert("ログイン成功！");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert("失敗: " + error.message);
        return;
      }

      router.push("/onboard");
    }
  };

  const signInWithGoogle = async () => {
    const provider = "google" as Provider;
    const redirectTo = `${window.location.origin}/auth/callback`;
    console.log("🚦🚦🚦redirectTo🚦🚦🚦", redirectTo);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo,
        // flowType: 'pkce' はエラーになるので削除します
      },
    });

    if (error) {
      console.error("OAuth error:", error.message);
    }
  };
  return (
    <div className="container">
      <div className="left">
        <div className="form">
          <h1>omiseeへようこそ</h1>
          <h2>{mode === "login" ? "ログイン" : "アカウント作成"}</h2>
          <button className="google" onClick={signInWithGoogle}>
            Googleで続ける
          </button>
          <div className="divider">または</div>
          <input
            placeholder="メール"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSubmit}>
            {mode === "login" ? "ログイン" : "登録"}
          </button>
          <p onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "アカウント作成はこちら" : "ログインはこちら"}
          </p>
        </div>
      </div>

      <div className="right">
        <p>誰でも簡単にLPを作れる</p>
      </div>
    </div>
  );
}
