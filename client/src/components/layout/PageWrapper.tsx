import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface PageWrapperProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function PageWrapper({ children, showNav = true }: PageWrapperProps) {
  if (!showNav) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
