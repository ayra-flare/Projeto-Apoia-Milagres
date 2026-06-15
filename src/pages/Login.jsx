import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Building2, User } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState("role"); // "role" | "login"
  const [role, setRole] = useState(null); // "ong" | "citizen"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1531844251246-9a1bfaaeeb9a?w=1200&h=800&fit=crop')`,
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Panel - Info */}
        <div className="hidden md:flex md:w-1/2 bg-[#FF8533] p-10 flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-6">Apoia Milagres</h2>
          <p className="text-white/90 text-sm leading-relaxed mb-8">
            Bem-vindo ao Apoia Milagres, a plataforma digital desenvolvida para fortalecer a rede de apoio social do nosso município. Nosso objetivo é acabar com a fragmentação das informações, centralizando as necessidades das nossas instituições e facilitando o seu engajamento como cidadão.
          </p>
          <p className="text-white font-semibold text-sm mb-3">• O que você pode fazer aqui?</p>
          <ul className="text-white/90 text-xs space-y-3 leading-relaxed">
            <li>
              <strong>Encontre onde ajudar:</strong> Utilize o nosso Mapa da Solidariedade integrado ao GPS para localizar instituições e ONGs sociais dentro de Milagres.
            </li>
            <li>
              <strong>Atenda a necessidades reais:</strong> Navegue pelo Feed de Necessidades, onde as instituições postam pedidos imediatos de alimentos, roupas e recursos.
            </li>
            <li>
              Com apenas um clique, você pode se candidatar para ajudar.
            </li>
            <li>
              <strong>Voz à Comunidade:</strong> Através da nossa Ouvidoria de Direitos Sociais, você pode realizar denúncias anônimas sobre violações de direitos com total segurança.
            </li>
          </ul>
        </div>

        {/* Right Panel - Actions */}
        <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center">
          {step === "role" ? (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-[#FF8533] text-center mb-8">LOGIN</h1>

              <Button
                onClick={() => { setRole("ong"); setStep("login"); }}
                className="w-full h-14 rounded-full bg-[#FF8533] hover:bg-[#FF8533]/90 text-white font-bold text-lg gap-2"
              >
                <Building2 size={22} />
                ONG
              </Button>

              <Button
                onClick={() => { setRole("citizen"); setStep("login"); }}
                className="w-full h-14 rounded-full bg-[#FF8533] hover:bg-[#FF8533]/90 text-white font-bold text-lg gap-2"
              >
                <User size={22} />
                APOIADOR
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400">ou</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 rounded-full text-sm font-medium border-gray-300"
                onClick={handleGoogle}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </Button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Não tem conta?{" "}
                <Link to="/register" className="text-[#FF8533] font-semibold hover:underline">
                  Criar conta
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <button
                onClick={() => setStep("role")}
                className="flex items-center gap-2 text-[#FF8533] text-sm font-medium hover:underline"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>

              <h1 className="text-3xl font-bold text-[#FF8533] text-center">
                {role === "ong" ? "ONG" : "APOIADOR"}
              </h1>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-full border-gray-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700">Senha</Label>
                    <Link to="/forgot-password" className="text-xs text-[#FF8533] hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-full border-gray-300"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 rounded-full bg-[#FF8533] hover:bg-[#FF8533]/90 text-white font-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}