// components/Header.jsx
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center space-x-4 p-4">
      <Image
        src="/images/logo.svg"
        alt="Logo Rodzic.ai"
        width={48}
        height={48}
        className="rounded-full" // zaokrąglenie rogów
      />
      <h1 className="text-xl font-semibold text-gray-800">
        Serwis Rodzic.ai - Wsparcie dla rodziców, zawsze pod ręką.
      </h1>
    </header>
  );
}
