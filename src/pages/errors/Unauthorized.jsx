const Unauthorized = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold">403</h1>

        <p className="mt-4 text-xl">You are not allowed to access this page</p>
      </div>
    </div>
  );
};

export default Unauthorized;
