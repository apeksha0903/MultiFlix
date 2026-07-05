import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface PageWrapperProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function PageWrapper({ children, showNav = true }: PageWrapperProps) {
  if (!showNav) {
    return (
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="ambient-shell min-h-screen bg-background"
      >
        {children}
      </motion.main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="ambient-shell flex-1 overflow-x-hidden"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
