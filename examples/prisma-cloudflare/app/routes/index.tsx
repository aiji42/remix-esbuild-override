import { PrismaClient } from "~/libs/prisma.server";
import { useLoaderData } from "@remix-run/react";
import type { Link } from "@prisma/client";

type Data = {
  links: Array<Link>;
};

export async function loader() {
  const prisma = new PrismaClient();
  const links = await prisma.link.findMany({ take: 3 });

  return { links };
}

export default function Index() {
  const { links } = useLoaderData<Data>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <ul>
        {links.map(({ id, url, shortUrl }) => (
          <li key={id}>
            {shortUrl} ({url})
          </li>
        ))}
      </ul>
    </div>
  );
}
