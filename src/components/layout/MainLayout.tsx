
import React from 'react';
import { 
  BellIcon, CogIcon, SearchIcon, UserIcon,
  HomeIcon, UsersIcon, BriefcaseIcon, ClipboardListIcon, BarChartIcon, LogOutIcon
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCrm } from '@/context/CrmContext';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentUser } = useCrm();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigationItems = [
    { title: 'Dashboard', icon: HomeIcon, path: '/' },
    { title: 'Customers', icon: UsersIcon, path: '/customers' },
    { title: 'Loans', icon: BriefcaseIcon, path: '/loans' },
    { title: 'Tasks', icon: ClipboardListIcon, path: '/tasks' },
    { title: 'Reports', icon: BarChartIcon, path: '/reports' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  // Only show reports for admin and teamlead roles
  const visibleNavItems = navigationItems.filter(item => {
    if (item.path === '/reports') {
      return user?.role === 'admin' || user?.role === 'teamlead';
    }
    return true;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader className="flex flex-col items-center py-4">
            <div className="text-2xl font-bold text-white mb-1">Debt Detective</div>
            <div className="text-sm text-sidebar-foreground/70">Collection CRM</div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        data-active={location.pathname === item.path}
                      >
                        <Link to={item.path}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || currentUser?.name}`} />
                  <AvatarFallback>{(user?.name || currentUser?.name || 'User').substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <div className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || currentUser?.name}</div>
                  <div className="text-xs text-sidebar-foreground/70 truncate capitalize">{user?.role || currentUser?.role.replace('_', ' ')}</div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-sidebar-foreground"
                onClick={handleSignOut}
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <SidebarTrigger />
                <div className="ml-4 relative">
                  <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Search customers, loans..." 
                    className="pl-10 w-80"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon">
                  <BellIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <CogIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
