import { PrismaClient } from "~/libs/prisma.server";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const prisma = new PrismaClient();
  const links = await prisma.link.findMany({ take: 3 });

  return { links };
}

export default function Index() {
  const { links } = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {JSON.stringify(links)}
    </div>
  );
}
