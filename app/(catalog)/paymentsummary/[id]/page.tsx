import ClientPage from "./ClientPage";

type PageProps = {
  params: {
    id: string;
  };
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
  return {
    title: `Holiday Package ${params.id}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;

  console.log("Holiday Package ID (server) from payment summary:", id);

  return <ClientPage id={id} />;
}
