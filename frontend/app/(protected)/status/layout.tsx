import StatusSidebar from "@/components/global/menu/StatusSidebar";

interface Props {
    children: React.ReactNode;
  }
  const Layout = ({ children }: Props) => {
    return (
      <div className=" w-full min-h-screen flex">
        <StatusSidebar />
        {children}
      </div>
    );
  };
  
  export default Layout;