import ClientPage from "./ClientPage";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * REQUIRED for `output: export`
 * Must return ALL possible IDs
 */
export async function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Holiday Package ${id}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  console.log("Holiday Package ID (server):", id);

  return <ClientPage id={id} />;
}
