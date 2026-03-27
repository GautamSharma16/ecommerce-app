import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      alert("Reset link sent to your email");
    } catch (err) {
      alert("Error sending email");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="section-card w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="btn-primary w-full">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;