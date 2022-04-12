import React, { FC } from "react";

export const Layout: FC = ({ children }) => {
  return (
    <>
      <div className="flex flex-col flex-1">
        <main className="relative focus:outline-none p-8 prose prose-invert flex-1 md:flex-initial">
          {children}
        </main>
      </div>
    </>
  );
};
