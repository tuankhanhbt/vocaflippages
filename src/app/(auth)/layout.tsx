interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-10 sm:py-16">
      {children}
    </div>
  );
}
