export default function PembayaranLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 px-5 pb-14 pt-4 md:px-8 md:pb-16 md:pt-8 xl:px-10">
      {children}
    </div>
  );
}
