interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return <div className="flex flex-col space-y-1">{children}</div>;
};

export default Wrapper;
