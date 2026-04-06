interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1380px] flex-1 items-center px-4 py-4 sm:px-6 sm:py-6">
      {children}
    </div>
  );
}
