export default function CategoryHeader({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <>
      <div className="bg-black  w-full absolute top-0 left-0 py-36 text-white py- -z-10 "></div>
      <div className="max-w-container mx-auto">
        <h1 className="text-h1 text-white text-center pt-12 capitalize ">
          {children}
        </h1>
      </div>
    </>
  );
}
